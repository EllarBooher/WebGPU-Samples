@group(0) @binding(0) var out_next_mip_level: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var in_previous_mip_level: texture_2d_array<f32>;

@compute @workgroup_size(16, 16, 1)
fn fillMipMap(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	// Each mip level halves the resolution

	let array_level = global_id.z;

	let color = 0.25 * (
		  textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(0,0), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(0,1), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(1,0), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(1,1), array_level, 0)
	);
	textureStore(out_next_mip_level, global_id.xy, array_level, color);
}

// A separate kernel for generating mips smaller than 16 by 16
@compute @workgroup_size(1, 1, 1)
fn fillMipMapSmaller(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	// Each mip level halves the resolution

	let array_level = global_id.z;

	let color = 0.25 * (
		  textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(0,0), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(0,1), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(1,0), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(1,1), array_level, 0)
	);
	textureStore(out_next_mip_level, global_id.xy, array_level, color);
}
