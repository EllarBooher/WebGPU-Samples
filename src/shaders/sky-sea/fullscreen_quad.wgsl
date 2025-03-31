// Call this in a render pass, passing in an index buffer [0, 1, 2, 0, 2, 3]

@group(0) @binding(0) var b_texture: texture_2d<f32>;
@group(0) @binding(0) var b_texture_array: texture_2d_array<f32>;
@group(0) @binding(0) var b_texture_3d: texture_3d<f32>;
@group(0) @binding(1) var b_sampler: sampler;

struct FullscreenQuadUBO
{
    color_gain: vec4<f32>,
    vertex_scale: vec4<f32>,
	swap_ba_rg: u32,
	channel_mask: u32,
	depth_or_array_layer: f32,
	mip_level: u32,
}

@group(1) @binding(0) var<uniform> u_fullscreen_quad: FullscreenQuadUBO;

const QUAD_VERTICES: array<vec4<f32>, 4> = array<vec4<f32>,4>(
    vec4<f32>(-1.0, -1.0, 0.0, 1.0),
    vec4<f32>(1.0, -1.0, 0.0, 1.0),
    vec4<f32>(1.0, 1.0, 0.0, 1.0),
    vec4<f32>(-1.0, 1.0, 0.0, 1.0),
);
const QUAD_UVS: array<vec2<f32>,4> = array<vec2<f32>,4>(
    vec2<f32>(0.0, 1.0),
    vec2<f32>(1.0, 1.0),
    vec2<f32>(1.0, 0.0),
    vec2<f32>(0.0, 0.0),
);

struct VertexOut {
    @builtin(position) position : vec4<f32>,
    @location(0) uv : vec2<f32>
}

@vertex
fn vertexMain(@builtin(vertex_index) index : u32) -> VertexOut
{
    var output : VertexOut;
    output.position = u_fullscreen_quad.vertex_scale * QUAD_VERTICES[index];
    output.uv = QUAD_UVS[index];
    return output;
}

struct FragmentOut {
	@location(0) color: vec4<f32>
}

fn doFragment(rgba: vec4<f32>) -> FragmentOut
{
	var result: FragmentOut;
	result.color = rgba;

	if(u_fullscreen_quad.swap_ba_rg == 1)
	{
		result.color = result.color.barg;
	}

	result.color.r *= f32((u_fullscreen_quad.channel_mask & 1) > 0);
	result.color.g *= f32((u_fullscreen_quad.channel_mask & 2) > 0);
	result.color.b *= f32((u_fullscreen_quad.channel_mask & 4) > 0);

	result.color *= u_fullscreen_quad.color_gain;

	result.color.a = 1.0;

	return result;
}

@fragment
fn fragmentMain(frag_interpolated: VertexOut) -> FragmentOut
{
    return doFragment(
		textureSampleLevel(
			b_texture,
			b_sampler,
			frag_interpolated.uv,
			f32(u_fullscreen_quad.mip_level)
		)
	);
}

@fragment
fn fragmentMainArray(frag_interpolated: VertexOut) -> FragmentOut
{
	return doFragment(
		textureSampleLevel(
			b_texture_array,
			b_sampler,
			frag_interpolated.uv,
			u32(u_fullscreen_quad.depth_or_array_layer),
			f32(u_fullscreen_quad.mip_level)
		)
	);
}

@fragment
fn fragmentMain3D(frag_interpolated: VertexOut) -> FragmentOut
{
	let coord = vec3<f32>(frag_interpolated.uv, u_fullscreen_quad.depth_or_array_layer / f32(textureDimensions(b_texture_3d).z));
	return doFragment(
		textureSampleLevel(
			b_texture_3d,
			b_sampler,
			coord,
			f32(u_fullscreen_quad.mip_level)
		)
	);
}
