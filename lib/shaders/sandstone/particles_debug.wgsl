#include raycast.inc.wgsl
#include types.inc.wgsl

// Render a buffer of particle positions, as many tiny spheres with their
// properties optionally layered on top. These properties are populated in
// various other pipelines and stages.
//
// The vertex stage converts them into tight quads.
//
// Then the fragment stage draws only the fragments that pass a ray-sphere
// intersection.

override PARTICLE_RADIUS_SQUARED: f32;
const VERTEX_TWIDDLES: array<vec2<f32>,4> = array(
	vec2<f32>(1.0, 1.0),
	vec2<f32>(1.0, -1.0),
	vec2<f32>(-1.0, -1.0),
	vec2<f32>(-1.0, 1.0)
);

struct ParticlesDebugConfig {
	hide_non_surface : u32,
}

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<uniform> u_camera: CameraUBO;
@group(0) @binding(2) var<uniform> u_config: ParticlesDebugConfig;

@group(1) @binding(0) var<storage, read_write> vertices_out: array<vec4<f32>>;
@group(1) @binding(0) var<storage, read> vertices_in: array<vec4<f32>>;

@compute @workgroup_size(256, 1, 1)
fn populateVertexBuffer(@builtin(global_invocation_id) particle_idx : vec3<u32>)
{
	// Generally work in camera space our goal is to get the axes of the
	// projected sphere in 'clip space'. We don't use the projection matrix to
	// get to clip space, the ellipse coefficients below are derived with a
	// manual ray-plane intersection with the view plane.

	// Remember, particle center is not the generally the center of the ellipse.
	let particle_center = (u_camera.view * vec4<f32>(particles[particle_idx.x].position_world.xyz,1.0)).xyz;

	let depth = particle_center.z - sqrt(PARTICLE_RADIUS_SQUARED);

	// General form of ellipse
	// https://iquilezles.org/articles/sphereproj/
	let a = PARTICLE_RADIUS_SQUARED - dot(particle_center.yz, particle_center.yz);
	let b = 2.0 * particle_center.x * particle_center.y;
	let c = PARTICLE_RADIUS_SQUARED - dot(particle_center.xz, particle_center.xz);
	let d = 2.0 * particle_center.x * particle_center.z * depth;
	let e = 2.0 * particle_center.y * particle_center.z * depth;
	let f = (PARTICLE_RADIUS_SQUARED - dot(particle_center.xy,particle_center.xy))
		  * depth * depth;


	// Various derived properties of an ellipse
	// https://math.stackexchange.com/a/820896
	let discriminant = 4.0 * a * c - b * b;

	let x_num = b * e - 2.0 * c * d;
	let y_num = b * d - 2.0 * a * e;

	let x_center = x_num / discriminant;
	let y_center = y_num / discriminant;

	for(var vertex_idx: u32 = 0; vertex_idx < 4; vertex_idx++) {
		// The boundaries of the bounding box of our ellipse are all conjugate
		// solutions of the same quadratic equation, so these +-1 twiddle factors
		// select them based on which corner of the box we want
		let vertex_selector = VERTEX_TWIDDLES[vertex_idx];

		let x_vertex = (
			x_num
			+ 0.5 * vertex_selector.x
				* sqrt(4.0 * x_num * x_num + 4.0 * discriminant * (e * e - 4.0 * c * f))
		) / discriminant;

		let y_vertex = (
			y_num
			+ 0.5 * vertex_selector.y
				* sqrt(4.0 * y_num * y_num + 4.0 * discriminant * (d * d - 4.0 * a * f))
		) / discriminant;

		// Negate due to handed-ness
		vertices_out[particle_idx.x * 4 + vertex_idx] = vec4<f32>(x_vertex, y_vertex, depth, 0);
	}
}

struct VertexOut {
    @builtin(position) position : vec4<f32>,
	// camera space position of the particle's center
    @location(0) particle_center_camera : vec3<f32>,
	// camera space position of this fragment
	@location(1) position_camera : vec3<f32>,
	@location(2) @interpolate(flat) particle_idx : u32,
	@location(3) @interpolate(flat) visible : u32,
	@location(4) normal : vec3<f32>,
}

@vertex
fn vertexMain(
	@builtin(vertex_index) vertex_idx : u32,
	@builtin(instance_index) particle_idx : u32
) -> VertexOut
{
	let particle = particles[particle_idx];

	let particle_center = (u_camera.view * vec4<f32>(particle.position_world.xyz,1.0)).xyz;

	var out: VertexOut;

	// For our ray-sphere intersection
	out.particle_center_camera = particle_center;
	out.position_camera = vertices_in[particle_idx * 4 + vertex_idx].xyz;

	// For rasterization
	out.position = u_camera.proj * vec4<f32>(out.position_camera, 1.0);
	out.particle_idx = particle_idx;

	out.visible = 1;
	if(u_config.hide_non_surface > 0) {
		out.visible = particle.is_surface;
	}

	out.normal = particle.normal_world.xyz;

	return out;
}

struct FragmentOut {
	@builtin(frag_depth) depth: f32,
	@location(0) color: vec4<f32>
}

@fragment
fn fragmentMain(
	frag_interpolated: VertexOut
) -> FragmentOut
{
	if(frag_interpolated.visible < 1) {
		discard;
	}

	let ray_origin = -frag_interpolated.particle_center_camera;
	let ray_direction_normalized = normalize(frag_interpolated.position_camera);
	let radius = sqrt(PARTICLE_RADIUS_SQUARED);
	let hit = raySphereIntersection(ray_origin, ray_direction_normalized, radius);

	if(!hit.hit || hit.t0 < 0) {
		discard;
	}

	let hit_position = hit.t0 * ray_direction_normalized + ray_origin;
	let normal_world = normalize((u_camera.model * vec4<f32>(normalize(hit_position), 0.0)).xyz);

	var out: FragmentOut;

	// let normal = normal_world;
	let normal = frag_interpolated.normal;

	out.color = vec4<f32>(0.5 * (normal + 1.0), 1.0);
	out.depth = (u_camera.proj * vec4<f32>(hit_position + frag_interpolated.particle_center_camera, 1.0)).z;

	return out;
}
