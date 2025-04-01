const TWO_PI = 6.28318530717958647693;

/*
 * Terminology
 *  - DFT  - Discrete Fourier Transform
 *  - FFT  - Fast Fourier Transform
 *  - DFFT - Discrete Fast Fourier Transform
 */

/*
 * Decimation-in-time Inverse Discrete Fast Fourier Transform
 * Performed on a Square 2D Grid
 */

struct DFFTParameters
{
	log_2_size: u32,
	size: u32,
	b_inverse: f32,
}

/*
 * A two-point DFT, used as the atomic step in the recursive DFFT algorithm. A
 * single twist in the so-called "butterfly" diagram of an FFT.
 * Butterfly indices are generated with the Stockham formulation, meaning that
 * no permutation step is required before performing the actual algorithm.
 */
struct TwoPointButterfly
{
	twiddle: vec2<f32>,

	// The un-twiddled index
	lower_index: u32,

	// The twiddled index
	upper_index: u32,
}

/*
 * out_butterflies_log2n_by_n:
 *
 * 	2d array of dimension log2(N) by N, where N is the size of the input grid
 * 	Each row represents a step in the 1D DFFT
 * 	step 0 is the first step performed, and represents the initial N/2 2-point DFTs
 * 	step log2(N) - 1 is the last step performed, and represents the final N-point DFT
 *
 * 	Each element is the source indices for a 2-point DFT plus twiddle factor
 */

@group(0) @binding(0) var<uniform> u_parameters: DFFTParameters;
@group(0) @binding(1) var<storage, read_write> out_butterflies_log2n_by_n: array<TwoPointButterfly>;

fn butterflyIndex(step: u32, major_index: u32) -> u32
{
	return step * u_parameters.size + major_index;
}

// Only imaginary argument since that's what is needed
fn complexExp(imaginary_arg: f32) -> vec2<f32>
{
	return vec2<f32>(cos(imaginary_arg),sin(imaginary_arg));
}

// Dispatch should have (N / 2, 1) invocations, where N is the grid size.
@compute @workgroup_size(2, 1)
fn precomputeDFFTInstructions(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	var major_index = global_id.x;

	let grid_size = u_parameters.size;

	for(var step = 0u; step < u_parameters.log_2_size; step += 1u)
	{
		let dft_size = 1u << (step + 1u);
		let dft_count = u32(grid_size / dft_size);

		let dft = u32(major_index / u32(dft_size / 2u));
		let n = major_index % u32(dft_size / 2u);

		var lower_twiddle: TwoPointButterfly;
		lower_twiddle.twiddle = complexExp(-TWO_PI * f32(n) / f32(dft_size));
		lower_twiddle.lower_index = dft + n * 2u * dft_count;
		lower_twiddle.upper_index = lower_twiddle.lower_index + dft_count;

		var upper_twiddle = lower_twiddle;
		upper_twiddle.twiddle *= -1.0;

		let instruction_index = n * dft_count + dft;

		out_butterflies_log2n_by_n[butterflyIndex(step, instruction_index)] = lower_twiddle;
		out_butterflies_log2n_by_n[butterflyIndex(step, instruction_index + (grid_size / 2u))] = upper_twiddle;
	}
}

// Avoid redeclare
// @group(0) @binding(0) var<uniform> u_parameters: DFFTParameters;
@group(0) @binding(2) var<storage, read> butterflies_log2n_by_n: array<TwoPointButterfly>;
@group(0) @binding(3) var<storage, read_write> buffer_0: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> buffer_1: array<vec4<f32>>;
@group(0) @binding(5) var<uniform> step_counter: u32;
@group(0) @binding(6) var out_texture: texture_storage_2d_array<rgba16float, write>;

fn complexMult(a: vec2<f32>, b: vec2<f32>) -> vec2<f32>
{
	return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

fn complexMult2(a: vec4<f32>, b: vec4<f32>) -> vec4<f32>
{
	return vec4<f32>(complexMult(a.xy, b.xy), complexMult(a.zw, b.zw));
}

fn bufferIndex(x: u32, y: u32, z: u32) -> u32
{
	let size = u_parameters.size;
	return x + y * size + z * size * size;
}

fn loadButterfly(major_index: u32) -> TwoPointButterfly
{
	var result = butterflies_log2n_by_n[butterflyIndex(step_counter % u_parameters.log_2_size, major_index)];
	result.twiddle.y *= (1.0 - 2.0 * u_parameters.b_inverse);

	return result;
}

/*
* buffer_0 needs to have the initial data
* buffer_1's state does not matter, it will be overwritten
* The final output will be in buffer_0 (since vertical + horizontal guarantees an even amount of ping-pongs)
* Make sure step_counter is updated between steps, incrementing by one until 2 * log2(N)
*/
@compute @workgroup_size(16, 16, 1)
fn performDFFTStep(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	// We need to bounce between buffers since each cell in each step relies on multiple cells from the previous step
	let ping_pong = (step_counter % 2u) == 1u;

	// step_counter ranges from [ 0, 2 * log2(N) ), with the second half representing the vertical pass
	// We do this to avoid needing to pass duplicate data with an extra vertical flag, or needing to split up the function into two kernels

	if (step_counter < u_parameters.log_2_size)
	{
		// Horizontal Pass
		let two_point_dft = loadButterfly(global_id.x);
		if(ping_pong)
		{
			let lower_input = buffer_1[bufferIndex(two_point_dft.lower_index, global_id.y, global_id.z)];
			let upper_input = buffer_1[bufferIndex(two_point_dft.upper_index, global_id.y, global_id.z)];

			let result = lower_input + complexMult2(vec4<f32>(two_point_dft.twiddle, two_point_dft.twiddle), upper_input);

			buffer_0[bufferIndex(global_id.x, global_id.y, global_id.z)] = result;
		}
		else
		{
			let lower_input = buffer_0[bufferIndex(two_point_dft.lower_index, global_id.y, global_id.z)];
			let upper_input = buffer_0[bufferIndex(two_point_dft.upper_index, global_id.y, global_id.z)];

			let result = lower_input + complexMult2(vec4<f32>(two_point_dft.twiddle, two_point_dft.twiddle), upper_input);

			buffer_1[bufferIndex(global_id.x, global_id.y, global_id.z)] = result;
		}
	}
	else
	{
		// Vertical Pass
		let two_point_dft = loadButterfly(global_id.y);
		if(ping_pong)
		{
			let lower_input = buffer_1[bufferIndex(global_id.x, two_point_dft.lower_index, global_id.z)];
			let upper_input = buffer_1[bufferIndex(global_id.x, two_point_dft.upper_index, global_id.z)];

			let result = lower_input + complexMult2(vec4<f32>(two_point_dft.twiddle, two_point_dft.twiddle), upper_input);

			buffer_0[bufferIndex(global_id.x, global_id.y, global_id.z)] = result;
		}
		else
		{
			let lower_input = buffer_0[bufferIndex(global_id.x, two_point_dft.lower_index, global_id.z)];
			let upper_input = buffer_0[bufferIndex(global_id.x, two_point_dft.upper_index, global_id.z)];

			let result = lower_input + complexMult2(vec4<f32>(two_point_dft.twiddle, two_point_dft.twiddle), upper_input);

			buffer_1[bufferIndex(global_id.x, global_id.y, global_id.z)] = result;
		}
	}
}

/*
 * Flips the sign of even numbered cells in the fourier grid. A cell at (x,y) is
 * even when (x + y) is even.
 *
 * step_counter should be left as it was for the last step performed.
 *
 * Why you might do this:
 *
 * When an DFT's input data has its energy clustered around the middle
 * around (grid_size / 2), the result will have alternating sign flips from the
 * desired result. This is since a frequency of (grid_size)/2 will show up as a
 * wave with wavelength 2 texels.
 *
 * This sort of clustering occurs with how we process ocean waves, since our
 * wave "origin" with the longest wavelength, highest frequency/energy waves is
 * at (grid_size/2, grid_size/2)
 */
@compute @workgroup_size(16, 16, 1)
fn performSwapEvenSignsAndCopyToHalfPrecisionOutput(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	let ping_pong = (step_counter % 2u) == 1u;

	let factor = 1.0 - 2.0 * f32((global_id.x + global_id.y) % 2);

	if(ping_pong)
	{
		textureStore(
			out_texture,
			global_id.xy,
			global_id.z,
			buffer_0[bufferIndex(global_id.x, global_id.y, global_id.z)] * factor
		);
	}
	else
	{
		textureStore(
			out_texture,
			global_id.xy,
			global_id.z,
			buffer_1[bufferIndex(global_id.x, global_id.y, global_id.z)] * factor
		);
	}
}

@group(0) @binding(7) var<storage, read_write> out_step_counter: u32;

@compute @workgroup_size(1)
fn incrementStepCounter(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	if(global_id.x == 0)
	{
		out_step_counter = out_step_counter + 1;
	}
}
@compute @workgroup_size(1)
fn resetStepCounter(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	if(global_id.x == 0)
	{
		out_step_counter = 0;
	}
}
