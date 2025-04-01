// Textures must have the same dimension

#include constants.inc.wgsl
#include types.inc.wgsl

const CASCADE_CAPACITY = 4u;

struct CascadeUBO
{
	wave_number_min_max: vec2<f32>,
	wave_patch_extent_meters: f32,
	padding0: f32,
}
struct FourierWavesUBO
{
	fourier_grid_size: u32,
	gravity: f32,
	padding0: f32,
	wave_period_seconds: f32,

	wind_speed_meters_per_second: f32,
	wind_fetch_meters: f32,
	wave_swell: f32,
	padding1: f32,

	cascades: array<CascadeUBO, CASCADE_CAPACITY>,
}

// Implementation derived from:
// Nicolas Lutz, Arnaud Schoentgen, and Guillaume Gilet. 2024. Fast orientable aperiodic ocean synthesis using tiling and blending. Proc. ACM Comput. Graph. Interact. Tech. 7, 3, Article 49 (August 2024), 22 pages. https://doi.org/10.1145/3675388

// Deterministic wave parameters derived from texture coordinate
struct WaveParameters
{
	// Ranges from -fourier_grid_size / 2 to fourier_grid_size / 2
	wave_coord: vec2<i32>,

	wave_vector: vec2<f32>,
	wave_number: f32,
	delta_wave_number: f32,
	frequency: f32,
	d_frequency_d_wave_number: f32,
	wind_angle: f32,
}

fn quantizeFrequency(frequency: f32, fundamental_frequency: f32) -> f32
{
	let multiple = frequency / fundamental_frequency;
	return (multiple - fract(multiple)) * fundamental_frequency;
}

fn waveParameters(
	settings: FourierWavesUBO,
	patch_extent_meters: f32,
	texel_coord: vec2<u32>
) -> WaveParameters
{
	var result: WaveParameters;

	let wave_coord_offset = i32(settings.fourier_grid_size / 2u);
	let g = settings.gravity;

	result.wave_coord = vec2<i32>(i32(texel_coord.x), i32(texel_coord.y)) - vec2<i32>(wave_coord_offset);

	const QUANTIZED_FREQUENCIES = true;
	if (QUANTIZED_FREQUENCIES)
	{
		let frequency_quantization_step = 2.0 * PI / settings.wave_period_seconds;
		let non_quantized_fundamental_wave_number = 2.0 * PI / patch_extent_meters;
		let fundamental_frequency = quantizeFrequency(
			sqrt(g * non_quantized_fundamental_wave_number),
			frequency_quantization_step
		);
		let fundamental_wave_number = fundamental_frequency * fundamental_frequency / g;
		result.delta_wave_number = fundamental_wave_number;

		let wave_number_non_quantized = length(fundamental_wave_number * vec2<f32>(result.wave_coord));

		result.frequency = quantizeFrequency(sqrt(g * wave_number_non_quantized), frequency_quantization_step);
		// d/dk (sqrt(gk)) = g / (2 * sqrt(g * k))
		result.d_frequency_d_wave_number = 0.5 * g / result.frequency;

		result.wave_number = result.frequency * result.frequency / g;

		result.wave_vector = result.wave_number * normalize(vec2<f32>(result.wave_coord));
	}
	else
	{
		let fundamental_wave_number = 2.0 * PI / patch_extent_meters;
		let fundamental_frequency = sqrt(g * fundamental_wave_number);
		result.delta_wave_number = fundamental_wave_number;

		result.wave_vector = fundamental_wave_number * vec2<f32>(result.wave_coord);
		result.wave_number = length(result.wave_vector);

		result.frequency = sqrt(g * result.wave_number);
		// d/dk (sqrt(gk)) = g / (2 * sqrt(g * k))
		result.d_frequency_d_wave_number = 0.5 * g * inverseSqrt(g * result.wave_number);
	}

	result.wind_angle = atan2(result.wave_vector.y, result.wave_vector.x);

	return result;
}

fn waveSpectrumJONSWAP(settings: FourierWavesUBO, frequency: f32, peak_frequency: f32) -> f32
{
	let wind_speed = settings.wind_speed_meters_per_second;
	let wind_fetch = settings.wind_fetch_meters;
	let g = settings.gravity;

	let alpha = 0.076 * pow(wind_speed * wind_speed / (wind_fetch * g), 0.22);
	let gamma = 3.3;
	var sigma = 0.07;
	if (frequency > peak_frequency)
	{
		sigma = 0.09;
	}
	let r = exp(-(frequency-peak_frequency)*(frequency-peak_frequency)/(2 * sigma * sigma * peak_frequency * peak_frequency));

	let f_ratio = peak_frequency / frequency;

	let numerator =
		alpha
		* g * g
		* exp(-1.25 * f_ratio * f_ratio * f_ratio * f_ratio)
		* pow(gamma, r);

	let denominator = frequency * frequency * frequency * frequency * frequency;

	return numerator / denominator;
}

// This fit is valid for positive reals greater than or equal to 1.0, tested up to z = 141.0
// Note, gamma(z) = (z-1)! for integral z
fn gammaApprox(z: f32) -> f32
{
	// Values computed from Lanczos approximation, see webgpu/sky-sea/scripts/lanczos.py
	// Generated with n = 2 and r = 2.603209
	// r choice is not arbitrary, it is determined from the largest zero of an error function (see script for details)
	// For this strategy for choosing r, c_0 will just be 1 due to float precision
	const c_0 = 1.000000000267524225;
	const c_1 = 4.739837024840160673;
	const c_2 = -1.393160104839919367;
	const r = 2.603209;

	let s = c_0 + c_1 / (z+1.0) + c_2 / (z+2.0);
	return sqrt(2.0 * PI) * pow(z + r + 0.5, z + 0.5) * exp(-(z + r + 0.5)) * s;
}

fn waveDirectionalSpreading(settings: FourierWavesUBO, frequency: f32, peak_frequency: f32, angle: f32) -> f32
{
	let f_ratio = peak_frequency / frequency;
	let swell = settings.wave_swell;

	let s = 16.0 * tanh(f_ratio) * swell * swell;

	let gamma_0 = gammaApprox(s + 1.0);
	let gamma_1 = gammaApprox(2.0 * s + 1.0);

	let q = (pow(2.0, 2.0 * s - 1.0) / PI) * (gamma_0 * gamma_0 / gamma_1);

	return q * pow(abs(cos(angle / 2.0)), 2.0 * s);
}

@group(0) @binding(0) var out_initial_amplitude: texture_storage_2d_array<rg32float, write>;
@group(0) @binding(1) var in_gaussian_random_pairs: texture_2d_array<f32>;

@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
@group(1) @binding(1) var<uniform> u_fourier_waves: FourierWavesUBO;

@compute @workgroup_size(16, 16, 1)
fn computeInitialAmplitude(@builtin(global_invocation_id) global_id: vec3<u32>)
{
    let texel_coord: vec2<u32> = global_id.xy;
	let array_layer: u32 = global_id.z;
    let size: vec2<u32> = textureDimensions(out_initial_amplitude);
    if texel_coord.x >= size.x
		|| texel_coord.y >= size.y
	{
        return;
    }

	let gaussian_pair = textureLoad(in_gaussian_random_pairs, texel_coord, array_layer, 0).xy;
	let wave = waveParameters(u_fourier_waves, u_fourier_waves.cascades[array_layer].wave_patch_extent_meters, texel_coord);
	let wave_number_min_max = u_fourier_waves.cascades[array_layer].wave_number_min_max;

	if (abs(wave.wave_number) < wave.delta_wave_number
		|| abs(wave.wave_number) < wave_number_min_max.x
		|| abs(wave.wave_number) > wave_number_min_max.y
	)
	{
		let amplitude = vec2<f32>(0.0, 0.0);
		textureStore(
			out_initial_amplitude,
			texel_coord,
			array_layer,
			vec4<f32>(amplitude, 0.0, 0.0)
		);
		return;
	}

	let g = u_fourier_waves.gravity;
	let wind_speed = u_fourier_waves.wind_speed_meters_per_second;
	let wind_fetch = u_fourier_waves.wind_fetch_meters;

	let peak_frequency = 22.0 * pow(g * g / (wind_speed * wind_fetch), 1.0 / 3.0);

	let spectrum = waveSpectrumJONSWAP(u_fourier_waves, wave.frequency, peak_frequency)
		* waveDirectionalSpreading(u_fourier_waves, wave.frequency, peak_frequency, wave.wind_angle);

	let magnitude = sqrt(
		2.0
		* spectrum
		* (wave.d_frequency_d_wave_number / wave.wave_number)
		* wave.delta_wave_number * wave.delta_wave_number
	);

	let amplitude = inverseSqrt(2.0)
		* gaussian_pair
		* magnitude;

	textureStore(
		out_initial_amplitude,
		texel_coord,
		array_layer,
		vec4<f32>(amplitude, 0.0, 0.0)
	);
}


/*
 * Capital D refers to displacement of the water surface
 * Lowercase d refers to partial derivative
 *
 * In order to halve the total FFT's we have to perform, we can do the following trick
 * If we have the following results from the FT:
 * 		complex f(n) -> purely real a
 * 		complex g(n) -> purely real b
 *
 * Then, by the linearity of the FT over linear combinations of the input function, we have that:
 *		 complex f(n) + i * g(n) -> a + i * b
 *
 * Thus, we can pack two sets of inputs for the FFT into the same two input channels, and avoid a wasted output channel.
 */
@group(0) @binding(2) var out_packed_Dx_plus_iDy_Dz_iDxdz_amplitudeArray: texture_storage_2d_array<rgba32float, write>;
@group(0) @binding(3) var out_packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_amplitudeArray: texture_storage_2d_array<rgba32float, write>;
@group(0) @binding(4) var in_initial_amplitude: texture_2d_array<f32>;

/* Commented to avoid re-declaration
@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
@group(1) @binding(1) var<uniform> u_fourier_waves: FourierWavesUBO;
*/
fn complexMult(a: vec2<f32>, b: vec2<f32>) -> vec2<f32>
{
	return vec2<f32>(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

@compute @workgroup_size(16, 16, 1)
fn computeTimeDependentAmplitude(@builtin(global_invocation_id) global_id: vec3<u32>)
{
    let texel_coord: vec2<u32> = global_id.xy;
	let array_layer: u32 = global_id.z;
    let size = textureDimensions(in_initial_amplitude);
    if texel_coord.x >= size.x
		|| texel_coord.y >= size.y
	{
        return;
    }

	let wave = waveParameters(u_fourier_waves, u_fourier_waves.cascades[array_layer].wave_patch_extent_meters, texel_coord);
	let wave_number_min_max = u_fourier_waves.cascades[array_layer].wave_number_min_max;

	if (abs(wave.wave_number) < wave.delta_wave_number
		|| abs(wave.wave_number) < wave_number_min_max.x
		|| abs(wave.wave_number) > wave_number_min_max.y
	)
	{
		textureStore(
			out_packed_Dx_plus_iDy_Dz_iDxdz_amplitudeArray,
			texel_coord,
			array_layer,
			vec4<f32>(0.0)
		);
		textureStore(
			out_packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_amplitudeArray,
			texel_coord,
			array_layer,
			vec4<f32>(0.0)
		);
		return;
	}

	let k_amplitude = textureLoad(in_initial_amplitude, texel_coord, array_layer, 0).xy;

	let k_minus_coord = vec2<u32>(
		(u_fourier_waves.fourier_grid_size - texel_coord.x) % u_fourier_waves.fourier_grid_size,
		(u_fourier_waves.fourier_grid_size - texel_coord.y) % u_fourier_waves.fourier_grid_size
	);
	let k_minus_amplitude = textureLoad(in_initial_amplitude, k_minus_coord, array_layer, 0).xy;
	let k_minus_amplitude_conjugate = vec2<f32>(k_minus_amplitude.x, -k_minus_amplitude.y);

	let phase = wave.frequency * u_global.time.time_seconds;
	let exponential = vec2<f32>(cos(phase), sin(phase));
	let exponential_conjugate = vec2<f32>(exponential.x, -exponential.y);

	let Dy_amplitude = complexMult(exponential, k_amplitude)
		+ complexMult(exponential_conjugate, k_minus_amplitude_conjugate);

	/*
	 * For gerstner waves, displacement in x/z directions is based on the
	 * gradient (x,z)-Displacement of:
	 *
	 * h(k,t) * exp(i * dot(k,x))
	 * 	= i * k(k,t)/k * h(k,t) * exp(i * dot(k,x))
	 *
	 * Where i is the imaginary number sqrt(-1)
	 *
	 * We're going to be doing a few derivatives.
	 * h(k,t) is independent of (x,z) when performing the fourier transform sum,
	 * since we sum over all fixed k and k is not a function of position at this
	 * point. So in general taking the derivative brings down a factor of
	 * i * k_x or i * k_z from the exponential
	 */

	let iDy_amplitude = vec2<f32>(-Dy_amplitude.y, Dy_amplitude.x);

	var one_over_wave_number = 1.0 / wave.wave_number;

	// wave.wave_vector.y here actually refers to the wave-vector's z component, since it is two-channel
	let k_x = wave.wave_vector.x;
	let k_z = wave.wave_vector.y;

	let Dx_amplitude = iDy_amplitude * k_x * one_over_wave_number;
	let Dz_amplitude = iDy_amplitude * k_z * one_over_wave_number;

	let Dxdx_amplitude = -Dy_amplitude * k_x * k_x * one_over_wave_number;
	let Dydx_amplitude = iDy_amplitude * k_x;
	// Mixed derivative is redundant, since Dxdz = Dzdx, so we do not keep it
	// let Dzdx_amplitude = -Dy_amplitude * k_x * k_z / wave.wave_number;

	let Dxdz_amplitude = -Dy_amplitude * k_x * k_z * one_over_wave_number;
	let Dydz_amplitude = iDy_amplitude * k_z;
	let Dzdz_amplitude = -Dy_amplitude * k_z * k_z * one_over_wave_number;

	let iDxdz_amplitude = vec2<f32>(-Dxdz_amplitude.y, Dxdz_amplitude.x);
	let iDydz_amplitude = vec2<f32>(-Dydz_amplitude.y, Dydz_amplitude.x);
	let iDzdz_amplitude = vec2<f32>(-Dzdz_amplitude.y, Dzdz_amplitude.x);

	textureStore(
		out_packed_Dx_plus_iDy_Dz_iDxdz_amplitudeArray,
		texel_coord,
		array_layer,
		vec4<f32>(Dx_amplitude + iDy_amplitude, Dz_amplitude + iDxdz_amplitude)
	);
	textureStore(
		out_packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_amplitudeArray,
		texel_coord,
		array_layer,
		vec4<f32>(Dydx_amplitude + iDydz_amplitude, Dxdx_amplitude + iDzdz_amplitude)
	);
}

@group(0) @binding(5) var out_turbulence_jacobian_array: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(6) var in_turbulence_jacobian_array: texture_2d_array<f32>;
@group(0) @binding(7) var in_Dx_Dy_Dz_Dxdz_spatial_array: texture_2d_array<f32>;
@group(0) @binding(8) var in_Dydx_Dydz_Dxdx_Dzdz_spatial_array: texture_2d_array<f32>;

/* Commented to avoid re-declaration
@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
*/

@compute @workgroup_size(16, 16, 1)
fn accumulateTurbulence(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	let texel_coord = vec2<u32>(global_id.xy);
	let array_layer: u32 = global_id.z;
    let size = textureDimensions(out_turbulence_jacobian_array);
    if texel_coord.x >= size.x || texel_coord.y >= size.y {
        return;
    }

	// TODO: support for mipmapping and lambda scaling factor present in wave_surface_displacement.wgsl
	const mip = 0u;

	let Dx_Dy_Dz_Dxdz = textureLoad(in_Dx_Dy_Dz_Dxdz_spatial_array, texel_coord, array_layer, mip);
	let Dydx_Dydz_Dxdx_Dzdz = textureLoad(in_Dydx_Dydz_Dxdx_Dzdz_spatial_array, texel_coord, array_layer, mip);

	let Dydx = Dydx_Dydz_Dxdx_Dzdz.x;
	let Dydz = Dydx_Dydz_Dxdx_Dzdz.y;

	let Dxdz = Dx_Dy_Dz_Dxdz.w;
	let Dzdx = Dxdz;

	var Dxdx = Dydx_Dydz_Dxdx_Dzdz.z;
	var Dzdz = Dydx_Dydz_Dxdx_Dzdz.w;

	var jacobian_xx = 1.0;
	var jacobian_zz = 1.0;
	var jacobian_xz = 0.0;
	var jacobian_zx = 0.0;

	jacobian_xx += Dxdx;
	jacobian_zz += Dzdz;

	jacobian_xz += Dxdz;
	jacobian_zx += Dzdx;

	let jacobian = jacobian_xx * jacobian_zz - jacobian_xz * jacobian_zx;
	let turbulence_previous = textureLoad(in_turbulence_jacobian_array, texel_coord, array_layer, mip).x;

	/*
	 * Function that causes foam to linger.
	 *
	 * Note this is not actually the turbulence of the displacement as a
	 * field, but instead an ad-hoc visually appealing approximation.
	 *
	 * This creates foam even when jacobian is nonnegative, but visually
	 * this does not look too strange. Utilizing this value takes a lot of
	 * tweaking with scaling/bias factors anyway.
	 *
	 * I found this on a few examples on github, and I'd like to know where
	 * it originates since I struggled to come up with my own function that
	 * works well.
	 */
	let turbulence = min(
		turbulence_previous + u_global.time.delta_time_seconds * 0.5 / max(jacobian, 0.5),
		jacobian
	);

	textureStore(out_turbulence_jacobian_array, texel_coord, array_layer,
		vec4<f32>(turbulence, jacobian, 0.0, 0.0)
	);
}
