// Sizeof(Atmosphere) = 8 * 16 = 128
// Alignof(Atmosphere) = 16
struct Atmosphere
{
    scattering_rayleigh_per_Mm : vec3<f32>,
    density_scale_rayleigh_Mm : f32,
    absorption_rayleigh_per_Mm : vec3<f32>,

    planet_radius_Mm : f32,

    scattering_mie_per_Mm : vec3<f32>,
    density_scale_mie_Mm : f32,
    absorption_mie_per_Mm : vec3<f32>,

    atmosphere_radius_Mm : f32,

    ground_albedo : vec3<f32>,
    padding0 : f32,

    scattering_ozone_per_Mm : vec3<f32>,
    padding1 : f32,

    absorption_ozone_per_Mm : vec3<f32>,
    padding2 : f32,

    padding3 : vec4<f32>,
}

// Sizeof(CelestialLight) = 2 * 16 = 32
// Alignof(CelestialLight) = 16
struct CelestialLight
{
    color: vec3<f32>,
    strength: f32,

	forward: vec3<f32>,
    angular_radius: f32,
}

// Sizeof(Camera) = 4 * 64 = 256
// Alignof(Camera) = 16
struct Camera
{
    inv_proj: mat4x4<f32>,

	inv_view: mat4x4<f32>,

	proj_view: mat4x4<f32>,

    position: vec4<f32>,
	forward: vec4<f32>,
	padding0: mat2x4<f32>,
}

// Sizeof(Time) = 16
// Alignof(Time) = 16
struct Time
{
	padding0: vec2<f32>,
	time_seconds: f32,
	delta_time_seconds: f32,
}

// All of these uniform values have identical lifetimes: they update before rendering for the frame, and are constant throughout
// Thus we store everything together to simplify the bindings
// Sizeof(GlobalUBO) = 672 + 16 = 688 (as of writing)
// Alignof(GlobalUBO) = 16
struct GlobalUBO
{
	camera: Camera,           // offsets
	ocean_camera: Camera,     // 0   + 256 = 256
	atmosphere: Atmosphere,   // 256 + 256 = 512
	light: CelestialLight,    // 512 + 128 = 640
	time: Time,               // 640 + 32  = 672
}
