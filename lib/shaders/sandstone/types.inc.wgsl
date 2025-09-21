
// sizeof  :  5 * 64 = 256
// alignof :  16
struct CameraUBO
{
	// world -> camera
	view         : mat4x4<f32>,

	// world -> clip
	proj_view    : mat4x4<f32>,

    position     :   vec4<f32>,
	padding0     :   vec2<f32>,
	aspect_ratio :        f32 ,
	focal_length :        f32 ,

	padding1     : mat2x4<f32>,

	// camera -> clip
	proj         : mat4x4<f32>,

	// camera -> world
	model        : mat4x4<f32>,
}

struct GlobalUniforms {
	camera             : CameraUBO,
	padding0           : vec3<u32>,
	debug_particle_idx :      u32 ,
}

struct Particle {
	position_world : vec3<f32>,
	is_surface     :      u32 ,
	normal_world   : vec3<f32>,
	padding0       :      f32 ,
	color          : vec3<f32>,
	padding1       :      f32 ,
}

struct ParticleBuffer {
	padding0      : vec2<f32>,
	/* Total number of surface particles in the buffer. If 0, surface particles have not been identified and compacted. */
	count_surface :      u32,
	/* Total number of valid particles in the array */
	count_total   :      u32,
	particles     : array<Particle>,
}

const NEIGHBORHOOD_SIZE = 9;
struct PointNeighborhood {
	padding0       :       vec2<f32>   ,
	count          :            u32    ,
	particle_idx   :            u32    ,
	neighborhood   : array<vec4<u32>,5>, // uniform elements must be aligned to 16 bytes
}

struct Edge {
	first_idx  : u32,
	second_idx : u32,
}

struct Graph {
	padding0 : vec3<f32>  ,
	count    : u32        ,
	edges    : array<Edge>,
}
