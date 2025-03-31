// Displace a grid of vertices representing the ocean surface, then rasterize into the gbuffer with a graphics pass

#include constants.inc.wgsl
#include types.inc.wgsl
#include util/raycast.inc.wgsl

const CASCADE_CAPACITY = 4u;

struct PlaneWave
{
    direction: vec2<f32>,
    amplitude: f32,
    wavelength: f32,
}

struct WaveCascade
{
	padding0: vec3<f32>,
	patch_size_meters: f32,
}

struct WaveSurfaceDisplacementUBO
{
	patch_world_half_extent: f32,
	b_gerstner: u32,
	b_displacement_map: u32,
	vertex_size: u32,

	gbuffer_extent: vec2<f32>,
	foam_scale: f32,
	foam_bias: f32,

	padding_0: vec3<f32>,
	procedural_wave_count: u32,

	cascades: array<WaveCascade, CASCADE_CAPACITY>,
}

@group(0) @binding(0) var<uniform> u_settings: WaveSurfaceDisplacementUBO;
@group(0) @binding(1) var<uniform> u_global: GlobalUBO;

@group(1) @binding(0) var displacement_map_sampler: sampler;
@group(1) @binding(1) var Dx_Dy_Dz_Dxdz_spatial: texture_2d_array<f32>;
@group(1) @binding(2) var Dydx_Dydz_Dxdx_Dzdz_spatial: texture_2d_array<f32>;
@group(1) @binding(3) var<storage> u_waves: array<PlaneWave>;

@group(2) @binding(0) var turbulence_jacobian: texture_2d_array<f32>;

struct OceanSurfaceDisplacement
{
	displacement: vec3<f32>,
}

fn sampleOceanSurfaceDisplacementFromMap(
	global_uv: vec2<f32>,
	cascade_position_weights: array<f32,CASCADE_CAPACITY>,
	gerstner: bool,
) -> OceanSurfaceDisplacement
{
    var result: OceanSurfaceDisplacement;
	result.displacement = vec3<f32>(0.0);

	for(var array_layer = 0u; array_layer <= 3u; array_layer++)
	{
		let position_lambda = cascade_position_weights[array_layer];

		let patch_uv = global_uv / u_settings.cascades[array_layer].patch_size_meters;

		let Dx_Dy_Dz_Dxdz = textureSampleLevel(
			Dx_Dy_Dz_Dxdz_spatial,
			displacement_map_sampler,
			patch_uv,
			array_layer,
			0.0
		);

		var delta_displacement = Dx_Dy_Dz_Dxdz.xyz;
		if(!gerstner)
		{
			delta_displacement.x = 0.0;
			delta_displacement.z = 0.0;
		}

		result.displacement += position_lambda * delta_displacement;
	}

	return result;
}

fn sampleOceanSurfaceDisplacementFromWave(
	wave: PlaneWave,
	time: f32,
	coords: vec2<f32>,
	falloff_distance: f32
) -> OceanSurfaceDisplacement
{
	let falloff_factor = (1.0 - smoothstep(0.0, falloff_distance, length(coords)));
    let wave_amplitude = falloff_factor * wave.amplitude;
    let wave_direction = normalize(wave.direction);
    let wavelength = wave.wavelength;

    let wave_number = 2.0 * 3.141592653589793 / wavelength;

    let gravity = 9.8;

    // Dispersion relationship for deep ocean waves
    // wave_speed = sqrt(gravity / wave_number)
    // angular_frequency = wave_speed * wave_number
    let angular_frequency = sqrt(gravity * wave_number);

    let wave_vector = wave_direction * wave_number;

    let theta = dot(coords, wave_vector) - angular_frequency * time;
    let sin_theta = sin(theta);
    let cos_theta = cos(theta);

    var result: OceanSurfaceDisplacement;

    let result_xz = -wave_direction * wave_amplitude * sin_theta;
    let result_y = wave_amplitude * cos_theta;
    result.displacement = vec3<f32>(result_xz.x, result_y, result_xz.y);

    return result;
}

fn getOceanSurfaceDisplacement(
	global_uv: vec2<f32>,
	cascade_position_weights: array<f32,CASCADE_CAPACITY>,
) -> OceanSurfaceDisplacement
{
	var result: OceanSurfaceDisplacement;
	result.displacement = vec3<f32>(0.0);

	if(u_settings.b_displacement_map == 1u)
	{
    	let uv = (global_uv + vec2<f32>(0.5,0.5));
		let gerstner = u_settings.b_gerstner == 1u;
		let sample = sampleOceanSurfaceDisplacementFromMap(uv, cascade_position_weights, gerstner);

		result.displacement += sample.displacement;
	}
	else
	{
		var sample: OceanSurfaceDisplacement;

		for (var i = 0u; i < u_settings.procedural_wave_count; i++)
		{
			sample = sampleOceanSurfaceDisplacementFromWave(
				u_waves[i],
				u_global.time.time_seconds,
				global_uv,
				u_settings.patch_world_half_extent
			);

			result.displacement += sample.displacement;
		}
	}

	return result;
}

fn projectNDCToOceanSurface(
	ndc: vec2<f32>,
	horizon_distance: f32,
	camera: Camera,
) -> vec3<f32>
{
	let near_plane = 1.0;
	let direction_view_space = camera.inv_proj * vec4<f32>(
		ndc,
		near_plane,
		1.0
	);

	let direction_world = normalize((camera.inv_view * vec4<f32>(direction_view_space.xyz, 0.0)).xyz);

	let ocean_hit = raySphereIntersection(
		camera.position.xyz + vec3<f32>(0.0, u_global.atmosphere.planet_radius_Mm * METERS_PER_MM, 0.0),
		direction_world,
		u_global.atmosphere.planet_radius_Mm * METERS_PER_MM
	);

	if(!ocean_hit.hit)
	{
		// Let these vertices get depth culled, it's hard to salvage them
		return vec3<f32>(0.0, -100000.0, 0.0);
	}

	// Hacky way to snap to horizon, since raycasting can be very inaccurate at the edge
	let t = mix(
		ocean_hit.t0,
		horizon_distance,
		smoothstep(0.2, 1.0, ocean_hit.t0 / horizon_distance)
	);
	let flat_position = camera.position.xyz + t * direction_world;
	let planet_radius = u_global.atmosphere.planet_radius_Mm * METERS_PER_MM;
	return planet_radius * normalize(flat_position + vec3<f32>(0.0, planet_radius, 0.0))
		- vec3<f32>(0.0, planet_radius, 0.0);
}
fn projectNDCToOceanSurfaceWithPivot(
	ndc: vec2<f32>,
	horizon_distance: f32,
	camera: Camera,
	pivot: vec3<f32>,
) -> vec3<f32>
{
	let world_position = projectNDCToOceanSurface(ndc,horizon_distance,camera);
	let pivot_offset = world_position - pivot;
	let pivot_distance = length(pivot_offset);

	/*
	 * Stretch all points away from a pivot, which should be some sort of
	 * "center" of the projected ocean surface. This covers gaps at the
	 * edges when waves grow too large, while being reactive to the overall
	 * shape of the ocean surface.
	 *
	 * Some other solutions that might work, but weren't chosen over this due
	 * to being too complicated or difficult to make work nicely:
	 * 		- stretch input NDC-space coordinates before projecting. This ends
	 *		  up wasting many vertices in the distance, and compensating for
	 *		  world space distance in ndc-space requires lots of back and forth
	 * 		  conversions.
	 *		- Some sort of offset based on the camera forward. This quickly
	 *		  falls apart when the camera forward is close to the unperturbed
	 *		  ocean surface normal/world-up, and handling that case separately
	 *		  is messy since it is predicated on camera FOV, aspect ratio,
	 *		  position, etc.
	 */
	const STRETCH_THRESHOLDS = vec2<f32>(2.0,20.0);
	// Avoid the singularity near the pivot, and drop out when this fix is less necessary
	if(pivot_distance < STRETCH_THRESHOLDS.x || camera.position.y > 100.0)
	{
		return world_position;
	}
	let stretch_parameter = smoothstep(
		STRETCH_THRESHOLDS.x,
		STRETCH_THRESHOLDS.y,
		pivot_distance
	);
	const STRETCH_ABSOLUTE_BIAS = 80.0;
	let stretch = ((pivot_distance + stretch_parameter * STRETCH_ABSOLUTE_BIAS) / pivot_distance);
	return pivot + pivot_offset * stretch;
}

struct VertexOut {
    @builtin(position) position             : vec4<f32>,
	@location(0) surface_normal             : vec3<f32>,
    @location(1) color                      : vec3<f32>,
    @location(2) camera_distance            : f32,
	@location(3) cascade_1234_normal_weights: vec4<f32>,
	@location(5) global_uv                  : vec2<f32>,
}

/*
 * Projects a grid of vertices with evenly distributed screen space coordinates
 */
@vertex
fn screenSpaceWarped(@builtin(vertex_index) index : u32) -> VertexOut
{
	var output : VertexOut;

	/*
	 * Note the usage of a separate camera. The camera for ocean surface
	 * generation is decoupled from the final rendering POV camera. In normal
	 * use it's the same, but for debugging and illustration it helps to render
	 * the ocean surface from anywhere.
	 */
	let ocean_camera = u_global.ocean_camera;

	let vert_coord = vec2<f32>(
		f32(index % u_settings.vertex_size),
		f32(index / u_settings.vertex_size)
	) / f32(u_settings.vertex_size - 1u);

	let overlap = vec2<f32>(1.05);

	let ndc_horizon_forward =
		ocean_camera.proj_view
		* vec4<f32>(
			ocean_camera.forward.x,
			0.0,
			ocean_camera.forward.z,
			0.0
		);

	let ndc_min = vec2<f32>(-overlap.x, -overlap.y);
	let ndc_max = vec2<f32>(overlap.x, min(ndc_horizon_forward.y / ndc_horizon_forward.w, overlap.y));

	let ndc_space_coord = mix(ndc_min, ndc_max, vert_coord);

	let planet_radius = u_global.atmosphere.planet_radius_Mm * METERS_PER_MM;
	let camera_radius = length(ocean_camera.position.xyz + vec3<f32>(0.0, planet_radius, 0.0));
	let horizon_distance = sqrt(camera_radius * camera_radius - planet_radius * planet_radius);

	let center_position = projectNDCToOceanSurface(
		mix(ndc_min, ndc_max, 0.5),
		horizon_distance,
		ocean_camera,
	);

	let cell_world_position = projectNDCToOceanSurfaceWithPivot(
		ndc_space_coord,
		horizon_distance,
		ocean_camera,
		center_position
	);

	/*
	 * Weight further vertices so they displace less and don't disrupt the
	 * horizon. It's hard to guarantee this with distances alone. Pretty hacky.
	 */
	let fraction_to_horizon = distance(cell_world_position, ocean_camera.position.xyz) / horizon_distance;
	let weight = 1.0 - smoothstep(0.3, 0.5, fraction_to_horizon);

	let cascade_position_weights = array<f32, CASCADE_CAPACITY>(weight,weight,weight,weight);
	let cascade_normal_weights = array<f32, CASCADE_CAPACITY>(weight,weight,weight,weight);

	let global_uv = cell_world_position.xz;
	let displacement_result = getOceanSurfaceDisplacement(
		global_uv,
		cascade_position_weights
	);
	let world_position = cell_world_position + displacement_result.displacement;

	output.global_uv = global_uv;

    output.position = u_global.camera.proj_view * vec4<f32>(world_position, 1.0);
    output.camera_distance = distance(u_global.camera.position.xyz, world_position);

	// Unclipped depth didn't work (and requires a feature) so this is a workaround
	output.position.z /= 1.001;

	output.color = 0.3 * vec3<f32>(16.0 / 255.0, 97.0 / 255.0, 171.0 / 255.0);

	// Test screen-space density of vertices
	// output.color = vec3<f32>(step(fract(50 * ndc_space_coord), vec2<f32>(0.1)),0.0);
 	// output.color = vec3<f32>(step(fract(1.0 * world_position.x), 0.05),0.0,0.0);

	output.surface_normal = normalize(
		world_position
		+ vec3<f32>(0.0, u_global.atmosphere.planet_radius_Mm * METERS_PER_MM, 0.0)
	);

	output.cascade_1234_normal_weights = vec4<f32>(
		cascade_normal_weights[0],
		cascade_normal_weights[1],
		cascade_normal_weights[2],
		cascade_normal_weights[3],
	);

    return output;
}

struct FragmentOut
{
    @location(0) color_with_surface_world_depth_in_alpha: vec4<f32>,
    @location(1) world_normal_with_surface_foam_strength_in_alpha: vec4<f32>,
}

struct OceanSurfaceTangents
{
	tangent: vec3<f32>,
	bitangent: vec3<f32>,
	foam_strength: f32,
}

fn sampleOceanSurfaceTangentDifferentialFromMap(
	global_uv: vec2<f32>,
	cascade_normal_weights: array<f32,CASCADE_CAPACITY>,
	gerstner: bool,
) -> OceanSurfaceTangents
{
    var result: OceanSurfaceTangents;
	result.tangent = vec3<f32>(0.0);
	result.bitangent = vec3<f32>(0.0);

	var turbulence_accumulated = 0.0;
	var turbulence_max = 0.0;
	for(var array_layer = 0u; array_layer < textureNumLayers(Dx_Dy_Dz_Dxdz_spatial); array_layer++)
	{
		let normal_lambda = cascade_normal_weights[array_layer];

		let patch_uv = global_uv / u_settings.cascades[array_layer].patch_size_meters;

		let Dx_Dy_Dz_Dxdz = textureSample(
			Dx_Dy_Dz_Dxdz_spatial,
			displacement_map_sampler,
			patch_uv,
			array_layer
		);

		let Dydx_Dydz_Dxdx_Dzdz = textureSample(
			Dydx_Dydz_Dxdx_Dzdz_spatial,
			displacement_map_sampler,
			patch_uv,
			array_layer
		);

		let Dydx = Dydx_Dydz_Dxdx_Dzdz.x;
		let Dydz = Dydx_Dydz_Dxdx_Dzdz.y;

		let Dxdz = Dx_Dy_Dz_Dxdz.w * f32(gerstner);
		let Dzdx = Dxdz;

		var Dxdx = Dydx_Dydz_Dxdx_Dzdz.z * f32(gerstner);
		var Dzdz = Dydx_Dydz_Dxdx_Dzdz.w * f32(gerstner);

		result.tangent += normal_lambda * vec3<f32>(Dxdx, Dydx, Dzdx);
		result.bitangent += normal_lambda * vec3<f32>(Dxdz, Dydz, Dzdz);

		let turbulence = textureSample(
			turbulence_jacobian,
			displacement_map_sampler,
			patch_uv,
			array_layer
		).x;
		turbulence_accumulated += normal_lambda * clamp(1.0 - turbulence, 0.0, 1.0);
		turbulence_max += max(normal_lambda, 0.1);
	}

	// TODO: this could use more rigour
	result.foam_strength = clamp(
		u_settings.foam_scale * (turbulence_accumulated / turbulence_max - u_settings.foam_bias),
		0.0,
		1.0
	);

	return result;
}

fn sampleOceanSurfaceTangentDifferentialFromWave(
	global_uv: vec2<f32>,
	wave: PlaneWave,
	time: f32,
	falloff_distance: f32,
	gerstner: bool,
) -> OceanSurfaceTangents
{
	let falloff_factor = (1.0 - smoothstep(0.0, falloff_distance, length(global_uv)));
    let wave_amplitude = falloff_factor * wave.amplitude;
    let wave_direction = normalize(wave.direction);
    let wavelength = wave.wavelength;

    let wave_number = 2.0 * PI / wavelength;

	// TODO: parameterize this in ubo (like how the FFT waves do it)
    let gravity = 9.8;

    // Dispersion relationship for deep ocean waves
    // wave_speed = sqrt(gravity / wave_number)
    // angular_frequency = wave_speed * wave_number
    let angular_frequency = sqrt(gravity * wave_number);

    let wave_vector = wave_direction * wave_number;

    let theta = dot(global_uv, wave_vector) - angular_frequency * time;
    let sin_theta = sin(theta);
    let cos_theta = cos(theta);

    var result: OceanSurfaceTangents;

    // partial derivatives computed exactly via the above formula
    // Note these vectors are parallel, since wave only displaces in travel direction
    result.tangent = vec3<f32>(
        - wave_amplitude * wave_direction.x * cos_theta * wave_vector.x,
        - wave_amplitude * sin_theta * wave_vector.x,
        - wave_amplitude * wave_direction.y * cos_theta * wave_vector.x,
    );
    result.bitangent = vec3<f32>(
        - wave_amplitude * wave_direction.x * cos_theta * wave_vector.y,
        - wave_amplitude * sin_theta * wave_vector.y,
        - wave_amplitude * wave_direction.y * cos_theta * wave_vector.y,
    );
	result.foam_strength = 0.0;

	if(!gerstner)
	{
		result.tangent.x = 0.0;
		result.tangent.z = 0.0;

		result.bitangent.x = 0.0;
		result.bitangent.z = 0.0;
	}

    return result;
}

fn getOceanSurfaceTangents(
	global_uv: vec2<f32>,
	cascade_normal_weights: array<f32,CASCADE_CAPACITY>,
) -> OceanSurfaceTangents
{
	var result: OceanSurfaceTangents;
	/*
	 * The derivative of the sum of all waves is the sum of the derivatives.
	 * Thus, the unperturbed tangent T=(1,0,0) (which comes from d/dx(x,y,z))
	 * is summed with the tangent differentials dT=d/dx(Dx,Dy,Dz) for each
	 * contribution, where (Dx,Dy,Dz) is the displacement due to the wave as a
	 * function of (x,y,z).
	 * Same for bitangent, just replace d/dx with d/dz
	 */
    result.tangent = vec3<f32>(1.0, 0.0, 0.0);
    result.bitangent = vec3<f32>(0.0, 0.0, 1.0);
	result.foam_strength = 0.0;

	let gerstner = u_settings.b_gerstner == 1u;
	if(u_settings.b_displacement_map == 1u)
	{
		let sample: OceanSurfaceTangents = sampleOceanSurfaceTangentDifferentialFromMap(
			global_uv,
			cascade_normal_weights,
			gerstner
		);

		result.tangent += sample.tangent;
		result.bitangent += sample.bitangent;
		result.foam_strength += sample.foam_strength;
	}
	else
	{
		var sample: OceanSurfaceTangents;

		for (var i = 0u; i < u_settings.procedural_wave_count; i++)
		{
			sample = sampleOceanSurfaceTangentDifferentialFromWave(
				global_uv,
				u_waves[i],
				u_global.time.time_seconds,
				u_settings.patch_world_half_extent,
				gerstner
			);

			result.tangent += sample.tangent;
			result.bitangent += sample.bitangent;
			result.foam_strength += sample.foam_strength
				/ f32(u_settings.procedural_wave_count);
		}
	}

	result.tangent = normalize(result.tangent);
	result.bitangent = normalize(result.bitangent);

	return result;
}

@fragment
fn rasterizationFragment(frag_interpolated: VertexOut) -> FragmentOut
{
    var output : FragmentOut;

    output.color_with_surface_world_depth_in_alpha = vec4<f32>(
		frag_interpolated.color,
		frag_interpolated.camera_distance
	);

	var cascade_normal_weights = array<f32, CASCADE_CAPACITY>();
	cascade_normal_weights[0] = frag_interpolated.cascade_1234_normal_weights.x;
	cascade_normal_weights[1] = frag_interpolated.cascade_1234_normal_weights.y;
	cascade_normal_weights[2] = frag_interpolated.cascade_1234_normal_weights.z;
	cascade_normal_weights[3] = frag_interpolated.cascade_1234_normal_weights.w;

	let surface = getOceanSurfaceTangents(
		frag_interpolated.global_uv,
		cascade_normal_weights,
	);
	// reverse left-handed WGSL coordinates
	let normal = normalize(-cross(surface.tangent, surface.bitangent));

	// This probably falls apart in the general case, but the distance surface
	// should be near flat anyway, with the surface normal close to planet
	// normal
	let surface_normal = normalize(frag_interpolated.surface_normal);
	let tangent = normalize(-cross(vec3<f32>(0.0,0.0,1.0), surface_normal));
	let bitangent = normalize(-cross(surface_normal, tangent));
	let perturbed_normal = normal.x * tangent + normal.y * surface_normal + normal.z * bitangent;

	//output.world_normal_with_surface_foam_strength_in_alpha = vec4<f32>(normal, surface.foam_strength);
	output.world_normal_with_surface_foam_strength_in_alpha = vec4<f32>(
		normalize(perturbed_normal),
		surface.foam_strength
	);

    return output;
}
