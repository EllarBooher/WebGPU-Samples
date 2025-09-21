#include raycast.inc.wgsl
#include types.inc.wgsl
#include graph.inc.wgsl

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
const NORMAL_LENGTH = 0.4;

struct ParticlesDebugConfig {
	// Only draw surface particles
	draw_surface_only  : u32,
	// Shader particles with their normal vector
	draw_normals       : u32,
}

@group(0) @binding(0) var<uniform>       u_global  : GlobalUniforms;
@group(0) @binding(1) var<uniform>       u_config  : ParticlesDebugConfig;
@group(0) @binding(2) var<storage, read> particles : ParticleBuffer;
@group(0) @binding(3) var<storage, read> graph     : Graph;

@group(1) @binding(0) var<storage, read_write> out_vertices : array<vec4<f32>>;
@group(1) @binding(0) var<storage, read>       vertices  : array<vec4<f32>>;

@compute @workgroup_size(256, 1, 1)
fn populateVertexBuffer(@builtin(global_invocation_id) particle_idx : vec3<u32>)
{
	// Generally work in camera space our goal is to get the axes of the
	// projected sphere in 'clip space'. We don't use the projection matrix to
	// get to clip space, the ellipse coefficients below are derived with a
	// manual ray-plane intersection with the view plane.

	// Remember, particle center is not the generally the center of the ellipse.
	let particle_center = (u_global.camera.view * vec4<f32>(particles.particles[particle_idx.x].position_world.xyz,1.0)).xyz;

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
		out_vertices[particle_idx.x * 4 + vertex_idx] = vec4<f32>(x_vertex, y_vertex, depth, 0);
	}
}

struct ParticleVertexOut {
    @builtin(position) position : vec4<f32>,
	// camera space position of the particle's center
    @location(0) particle_center_camera : vec3<f32>,
	// camera space position of this fragment
	@location(1) position_camera : vec3<f32>,
	@location(2) @interpolate(flat) particle_idx : u32,
	@location(3) @interpolate(flat) visible : u32,
	@location(4) normal : vec3<f32>,
	@location(5) color : vec3<f32>,
}
struct ParticleFragmentOut {
	@builtin(frag_depth) depth: f32,
	@location(0) color: vec4<f32>
}

// Returns an interval of edge indices, start (inclusive) and stop (inclusive)
fn searchSortedGraphForEdge(search_edge: Edge) -> bool
{
	let count = graph.count;

	if(count == 0) {
		return false;
	}

	var min = 0u;
	var max = count;

	while(min < max) {
		let idx = (min + max) / 2;
		let edge = graph.edges[idx];

		if(edge.first_idx == search_edge.first_idx) {
			min = idx;
			max = idx;
			break;
		}

		if(edge.first_idx < search_edge.first_idx) {
			min = idx;
		} else {
			max = idx;
		}
	}

	// min == max
	var idx = min;

	// We probably hit some random position in the interval of edges with the
	// right first_idx, so we linear search up and down.

	if(graph.edges[idx].first_idx != search_edge.first_idx) {
		return false;
	}

	if(graph.edges[idx].second_idx == search_edge.second_idx) {
		return true;
	} else if (graph.edges[idx].second_idx > search_edge.second_idx) {
		idx -= 1;
		while(idx > 0) {
			if(graph.edges[idx].first_idx != search_edge.first_idx) {
				return false;
			}

			if(graph.edges[idx].second_idx == search_edge.second_idx) {
				return true;
			}

			idx -= 1;
		}
	} else if (graph.edges[idx].second_idx < search_edge.second_idx) {
		idx += 1;
		while(idx < count) {
			if(graph.edges[idx].first_idx != search_edge.first_idx) {
				return false;
			}

			if(graph.edges[idx].second_idx == search_edge.second_idx) {
				return true;
			}

			idx += 1;
		}
	}

	return false;
}

@vertex
fn drawParticlesVertex(
	@builtin(vertex_index) vertex_idx : u32,
	@builtin(instance_index) particle_idx : u32
) -> ParticleVertexOut
{
	let particle = particles.particles[particle_idx];

	let particle_center = (u_global.camera.view * vec4<f32>(particle.position_world.xyz,1.0)).xyz;

	var out: ParticleVertexOut;

	// For our ray-sphere intersection
	out.particle_center_camera = particle_center;
	out.position_camera = vertices[particle_idx * 4 + vertex_idx].xyz;

	// For rasterization
	out.position = u_global.camera.proj * vec4<f32>(out.position_camera, 1.0);
	out.particle_idx = particle_idx;

	out.visible = 1;
	if(u_config.draw_surface_only > 0) {
		out.visible = particle.is_surface;
	}

	out.normal = particle.normal_world.xyz;
	out.color = particle.color;

	if(u_global.debug_particle_idx == particle_idx) {
		out.color = vec3<f32>(0.0, 0.0, 1.0);
	} else if(searchSortedGraphForEdge(Edge(u_global.debug_particle_idx, particle_idx))) {
		out.color = vec3<f32>(1.0, 0.0, 0.0);
	}

	return out;
}

@fragment
fn drawParticlesFragment(
	frag: ParticleVertexOut
) -> ParticleFragmentOut
{
	if(frag.visible < 1) {
		discard;
	}

	let ray_origin = -frag.particle_center_camera;
	let ray_direction_normalized = normalize(frag.position_camera);
	let radius = sqrt(PARTICLE_RADIUS_SQUARED);
	let hit = raySphereIntersection(ray_origin, ray_direction_normalized, radius);

	if(!hit.hit || hit.t0 < 0) {
		discard;
	}

	let hit_position = hit.t0 * ray_direction_normalized + ray_origin;

	var out: ParticleFragmentOut;

	if(u_config.draw_normals > 0) {
		let normal = frag.normal;
		out.color = vec4<f32>(0.5 * (normal + 1.0), 1.0);
	} else {
		let normal = normalize((u_global.camera.model * vec4<f32>(hit_position, 0.0)).xyz);
		out.color = vec4<f32>(frag.color, 1.0);
	}

	let projected = u_global.camera.proj * vec4<f32>(hit_position + frag.particle_center_camera, 1.0);
	out.depth = projected.z / projected.w;

	return out;
}

struct NormalVertexOut {
	@builtin(position) position : vec4<f32>,
	@location(0) color : vec3<f32>,
	@location(1) @interpolate(flat) visible : u32,
}
struct NormalFragmentOut {
	@location(0) color : vec4<f32>,
}

@vertex
fn drawNormalsVertex(
	@builtin(vertex_index) vertex_idx : u32,
	@builtin(instance_index) particle_idx : u32
) -> NormalVertexOut {
	let particle = particles.particles[particle_idx];

	// index should be 0 (for startpoint) and 1 (for endpoint)
	let length = NORMAL_LENGTH * f32(vertex_idx) * f32(particle.is_surface);
	let particle_center = (u_global.camera.view * vec4<f32>(particle.position_world.xyz,1.0)).xyz;

	var out : NormalVertexOut;

	let position = particle.position_world.xyz + length * particle.normal_world.xyz;
	out.position = u_global.camera.proj_view * vec4<f32>(position, 1.0);

	out.color = abs(particle.normal_world.xyz);

	out.visible = 1;
	if(u_config.draw_surface_only > 0) {
		out.visible = particle.is_surface;
	}

	return out;
}

@fragment
fn drawNormalsFragment(
	frag : NormalVertexOut
) -> NormalFragmentOut {
	if(frag.visible < 1) {
		discard;
	}

	var out : NormalFragmentOut;

	out.color = vec4<f32>(frag.color,1.0);

	return out;
}

/********************************************************************************
* Draw tangent planes of spheres (requires normals)
********************************************************************************/

struct DragTangentPlanesVertexOut {
	@builtin(position) position : vec4<f32>,
	@location(0) color : vec3<f32>,
}
struct DrawTangentPlanesFragmentOut {
	@location(0) color : vec4<f32>,
}
@vertex
fn drawTangentPlanesVertex(
   @builtin(vertex_index) vertex_idx : u32,
   @builtin(instance_index) particle_idx : u32
) -> DragTangentPlanesVertexOut {

	let particle = particles.particles[particle_idx];

	let b = cross(particle.normal_world, particle.normal_world.yxz + vec3<f32>(1.0,0.0,0.0));
	let a = cross(b, particle.normal_world);

	let vertex_selector = VERTEX_TWIDDLES[vertex_idx];

	let position_world =
		NORMAL_LENGTH
			* (vertex_selector.x * normalize(a)
			+ vertex_selector.y * normalize(b))
		+ particle.position_world;

	var out : DragTangentPlanesVertexOut;
	out.position = u_global.camera.proj_view * vec4<f32>(position_world, 1.0);
	// out.color = 0.5 * (particle.normal_world.xyz + 1.0);
	out.color = abs(particle.normal_world.xyz);

	return out;
}

@fragment
fn drawTangentPlanesFragment(
	frag : DragTangentPlanesVertexOut

) -> DrawTangentPlanesFragmentOut {

	var out : DrawTangentPlanesFragmentOut;
	out.color = vec4<f32>(frag.color.xyz, 1.0);

	return out;
}
