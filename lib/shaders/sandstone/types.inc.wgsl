
// sizeof  :  5 * 64 = 256
// alignof :  16
struct CameraUBO
{
	// world -> camera
	view: mat4x4<f32>,

	// world -> clip
	proj_view: mat4x4<f32>,

    position: vec4<f32>,
	padding0: vec2<f32>,
	aspect_ratio: f32,
	focal_length: f32,

	padding1: mat2x4<f32>,

	// camera -> clip
	proj: mat4x4<f32>,

	// camera -> world
	model: mat4x4<f32>,
}

struct Particle {
	position_world : vec3<f32>,
	is_surface     :      u32 ,
	normal_world   : vec3<f32>,
	padding0       :      f32 ,
	color          : vec3<f32>,
	padding1       :      f32 ,
}
