#include types.inc.wgsl

struct GridPoint {
	position : vec3<f32>,
	filled   : u32,
}

@group(0) @binding(0) var<uniform> 				u_camera			: CameraUBO;

@group(1) @binding(0) var<storage, read> 		particles			: array<Particle>;
@group(1) @binding(0) var<storage, read_write> 	out_particles		: array<Particle>;

@group(2) @binding(0) var<storage, read> 		projected_grid		: array<GridPoint>;
@group(2) @binding(0) var<storage, read_write> 	out_projected_grid	: array<GridPoint>;

const GRID_GAP = 0.2;
const GRID_DIMENSION: u32 = 64;

const VERTEX_TWIDDLES: array<vec2<f32>,4> = array(
	vec2<f32>(1.0, 1.0),
	vec2<f32>(1.0, -1.0),
	vec2<f32>(-1.0, -1.0),
	vec2<f32>(-1.0, 1.0)
);
const GRID_STRIDE = vec3<u32>(
	1,
	GRID_DIMENSION,
	GRID_DIMENSION * GRID_DIMENSION
);

@compute @workgroup_size(8, 8, 4)
fn initGrid(@builtin(global_invocation_id) grid_position : vec3<u32>) {
	let grid_idx = dot(GRID_STRIDE, grid_position);

	out_projected_grid[grid_idx].position = vec3<f32>(grid_position);
	out_projected_grid[grid_idx].filled = 0;
}

@compute @workgroup_size(256, 1, 1)
fn projectParticlesToGrid(@builtin(global_invocation_id) particle_idx : vec3<u32>) {
	let particle_position = particles[particle_idx.x].position_world.xyz;

	let grid_position = vec3<u32>(round(particle_position / GRID_GAP));

	if(any(grid_position >= vec3<u32>(GRID_DIMENSION)) || any(grid_position < vec3<u32>(0))) {
		return;
	}

	let grid_idx = dot(GRID_STRIDE, grid_position);

	out_projected_grid[grid_idx].filled = 1;
}

@compute @workgroup_size(256, 1, 1)
fn identifySurfaceParticles(@builtin(global_invocation_id) particle_idx : vec3<u32>) {
	let particle_position = out_particles[particle_idx.x].position_world.xyz;

	let grid_position = vec3<u32>(round(particle_position / GRID_GAP));

	if(any(grid_position >= vec3<u32>(GRID_DIMENSION)) || any(grid_position < vec3<u32>(0))) {
		return;
	}

	let grid_idx = dot(GRID_STRIDE, grid_position);

	var surface = false;

	surface |= (grid_position.x <= 0 			    || projected_grid[grid_idx - GRID_STRIDE.x].filled == 0);
	surface |= (grid_position.x >= GRID_DIMENSION-1 || projected_grid[grid_idx + GRID_STRIDE.x].filled == 0);
	surface |= (grid_position.y <= 0 			    || projected_grid[grid_idx - GRID_STRIDE.y].filled == 0);
	surface |= (grid_position.y >= GRID_DIMENSION-1 || projected_grid[grid_idx + GRID_STRIDE.y].filled == 0);
	surface |= (grid_position.z <= 0 			    || projected_grid[grid_idx - GRID_STRIDE.z].filled == 0);
	surface |= (grid_position.z >= GRID_DIMENSION-1 || projected_grid[grid_idx + GRID_STRIDE.z].filled == 0);

	out_particles[particle_idx.x].is_surface = u32(surface);
}

struct VertexOut {
    @builtin(position) position : vec4<f32>,
	@location(0) color : vec4<f32>,
}

struct FragmentOut {
	@location(0) color: vec4<f32>
}

@vertex
fn vertexMain(
	@builtin(vertex_index) vertex_idx : u32,
	@builtin(instance_index) grid_idx : u32
) -> VertexOut {
	let grid_point = projected_grid[grid_idx];

	let center = u_camera.proj_view * vec4<f32>(GRID_GAP * grid_point.position, 1.0);
	let depth = center.z / center.w;

	var out: VertexOut;
	out.position = vec4<f32>(center.xy + 0.05 * (1.0 - depth) * VERTEX_TWIDDLES[vertex_idx] * vec2<f32>(1.0 / u_camera.aspect_ratio, 1.0), center.zw);

	let green = vec4<f32>(0.0, 1.0, 0.0, 1.0);
	let red = vec4<f32>(1.0, 0.0, 0.0, 1.0);
	out.color = mix(red, green, f32(grid_point.filled));

	return out;
}

@fragment
fn fragmentMain(
	frag_interpolated: VertexOut
) -> FragmentOut {
	var out: FragmentOut;
	out.color = frag_interpolated.color;

	return out;
}
