/*
 * Compute shader that draws to the target a UV test pattern.
 */

@group(0) @binding(0) var output_color: texture_storage_2d<rgba16float, write>;

@compute @workgroup_size(16,16,1)
fn renderUVTestPattern(@builtin(global_invocation_id) global_id : vec3<u32>)
{
	let texel_coord = vec2<u32>(global_id.xy);
    let size = textureDimensions(output_color);
    if(texel_coord.x >= size.x || texel_coord.y >= size.y)
    {
        return;
    }

	let uv = vec2<f32>(texel_coord) / vec2<f32>(size);

	let output = vec4<f32>(uv, 0.0, 1.0);
	textureStore(output_color, texel_coord, output);

}
