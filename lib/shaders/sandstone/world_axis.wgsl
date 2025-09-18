#include types.inc.wgsl

@group(0) @binding(0) var<uniform> u_camera : CameraUBO;

const WORLD_AXES_VERTEX_LIST : array<vec4<f32>, 6> = array(
	// X
	vec4<f32>(0.0, 0.0, 0.0, 1.0),
	vec4<f32>(1.0, 0.0, 0.0, 1.0),
	// Y
	vec4<f32>(0.0, 0.0, 0.0, 1.0),
	vec4<f32>(0.0, 1.0, 0.0, 1.0),
	// Z
	vec4<f32>(0.0, 0.0, 0.0, 1.0),
	vec4<f32>(0.0, 0.0, 1.0, 1.0),
);
const WORLD_AXES_COLORS : array<vec4<f32>, 3> = array(
	// X
	vec4<f32>(1.0, 0.0, 0.0, 1.0),
	// Y
	vec4<f32>(0.0, 1.0, 0.0, 1.0),
	// Z
	vec4<f32>(0.0, 0.0, 1.0, 1.0),
);

struct VertexOut {
	@builtin(position) position : vec4<f32>,
	@location(0) color : vec4<f32>,
}
struct FragmentOut {
	@location(0) color : vec4<f32>,
}
@vertex
fn drawWorldAxesVertex(
   @builtin(vertex_index) vertex_idx : u32,
   @builtin(instance_index) instance_idx : u32
) -> VertexOut {
	var out : VertexOut;

	var vertex = 100.0 * WORLD_AXES_VERTEX_LIST[(instance_idx % 3) * 2 + vertex_idx].xyz;
	var color = WORLD_AXES_COLORS[instance_idx % 3];
	if(instance_idx >= 3) {
		vertex *= -1;
		color = vec4<f32>(0.8);
	}

	out.position = u_camera.proj_view * vec4<f32>(vertex, 1.0);
	out.color = color;

	return out;
}

@fragment
fn drawWorldAxesFragment(
	frag : VertexOut
) -> FragmentOut {
	var out : FragmentOut;

	out.color = frag.color;

	return out;
}
