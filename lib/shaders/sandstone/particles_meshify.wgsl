#include types.inc.wgsl

struct GridPoint {
	position_world : vec3<f32>,
	filled: f32,
}

@group(0) @binding(0) var<storage, read> particles: array<vec3<f32>>;
@group(0) @binding(1) var<uniform> u_camera: CameraUBO;

@group(1) @binding(0) var<storage, read_write> out_projected_grid: array<GridPoint>;
@group(1) @binding(0) var<storage, read> in_projected_grid: array<GridPoint>;

const GRID_GAP = 0.4;
const GRID_DIMENSION: u32 = 32;

const VERTEX_TWIDDLES: array<vec2<f32>,4> = array(
	vec2<f32>(1.0, 1.0),
	vec2<f32>(1.0, -1.0),
	vec2<f32>(-1.0, -1.0),
	vec2<f32>(-1.0, 1.0)
);
const EMPTY_GRID_POINT: GridPoint = GridPoint(
	vec3<f32>(0.0, 0.0, 0.0),
	0.0
);

@compute @workgroup_size(8, 8, 4)
fn initGrid(@builtin(global_invocation_id) grid_position : vec3<u32>) {
	let grid_idx = grid_position.x
		+ grid_position.y * GRID_DIMENSION
		+ grid_position.z * GRID_DIMENSION * GRID_DIMENSION;

	var grid_point : GridPoint;
	grid_point.position_world = vec3<f32>(grid_position) * GRID_GAP;
	grid_point.filled = 0.0;

	out_projected_grid[grid_idx] = grid_point;
}

@compute @workgroup_size(256, 1, 1)
fn projectParticlesToGrid(@builtin(global_invocation_id) particle_idx : vec3<u32>)
{
	let particle_position = particles[particle_idx.x].xyz;

	let grid_position = vec3<u32>(round(particle_position / GRID_GAP));

	if(any(grid_position >= vec3<u32>(GRID_DIMENSION)) || any(grid_position < vec3<u32>(0))) {
		return;
	}

	let grid_idx = grid_position.x
		+ grid_position.y * GRID_DIMENSION
		+ grid_position.z * GRID_DIMENSION * GRID_DIMENSION;

	out_projected_grid[grid_idx].filled = 1.0;
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
) -> VertexOut
{
	let grid_point = in_projected_grid[grid_idx];

	let center = u_camera.proj_view * vec4<f32>(grid_point.position_world, 1.0);
	let depth = center.z / center.w;

	var out: VertexOut;
	out.position = vec4<f32>(center.xy + 0.05 * (1.0 - depth) * VERTEX_TWIDDLES[vertex_idx] * vec2<f32>(1.0 / u_camera.aspect_ratio, 1.0), center.zw);

	let green = vec4<f32>(0.0, 1.0, 0.0, 1.0);
	let red = vec4<f32>(1.0, 0.0, 0.0, 1.0);
	out.color = mix(red, green, grid_point.filled);

	return out;
}

@fragment
fn fragmentMain(
	frag_interpolated: VertexOut
) -> FragmentOut
{
	var out: FragmentOut;
	out.color = frag_interpolated.color;

	return out;
}
