//
// Implementation of: "Implicit-shifted Symmetric QR Singular Value
//   Decomposition of 3x3 Matrices" by Theodore Gast, Chuyuan Fu, Chenfanfu
//   Jiang, and Joseph Teran https://apps.dtic.mil/sti/tr/pdf/AD1014930.pdf
//
// See svd.py in 'sandstone/scripts'. Be wary that WGSL matrices are column
// major, while the python code uses row-major numpy ndarrays. Semantics also
// often differs, due to what is simplest in either language.
//
// Largely unoptimized, but quite accurate and fast anyway.
//

struct SVDecomposition {
	// Orthonormal rotation
	U : mat3x3<f32>,
	// Singular values, stored as the diagonal matrix.
	Σ : vec3<f32>,
	// Orthonormal rotation
	V : mat3x3<f32>,
}

struct PolarDecomposition {
	R : mat3x3<f32>,
	S : mat3x3<f32>,
}

struct SVDIntermediate {
	U : mat3x3<f32>,
	A : mat3x3<f32>,
	V : mat3x3<f32>
}

struct PolarDecomposition2D {
	R : mat2x2<f32>,
	S : mat2x2<f32>,
}

struct SVDecomposition2D {
	U : mat2x2<f32>,
	Σ : vec2<f32>,
	V : mat2x2<f32>,
}

const IDENTITY_MATRIX = mat3x3<f32>(
	1.0, 0.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 0.0, 1.0,
);
const IDENTITY_MATRIX_2D = mat2x2<f32>(
	1.0, 0.0,
	0.0, 1.0,
);

/********************************************************************************
* Algorithm 1
* 	Construction of Givens matrices
********************************************************************************/

fn givens_conventional(x: f32, y: f32) -> vec2<f32>
{
	let d = x * x + y * y;
	if (d == 0) {
		return vec2<f32>(1.0, 0.0);
	}

	let t = inverseSqrt(d);
	return vec2<f32>(x * t, -y * t);
}

fn givens_unconventional(x: f32, y: f32) -> vec2<f32>
{
	let d = x * x + y * y;
	if (d == 0) {
		return vec2<f32>(0.0, 1.0);
	}

	let t = inverseSqrt(d);
	return vec2<f32>(y * t, x * t);
}

fn givens_cs_3D_1_2(c: f32, s: f32) -> mat3x3<f32>
{
	return mat3x3<f32>(
		c, -s,  0,
		s,  c,  0,
		0,  0,  1
	);
}

fn givens_cs_3D_2_3(c: f32, s: f32) -> mat3x3<f32>
{
	return mat3x3<f32>(
		1,  0,  0,
		0,  c, -s,
		0,  s,  c
	);
}

fn givens_cs_3D_1_3(c: f32, s: f32) -> mat3x3<f32>
{
	return mat3x3<f32>(
		c,  0, -s,
		0,  1,  0,
		s,  0,  c
	);
}

fn givens_cs_2D(c: f32, s: f32) -> mat2x2<f32>
{
	return mat2x2<f32>(
		c, -s,
		s,  c
	);
}

fn givens_xy_3D_1_2(x: f32, y: f32) -> mat3x3<f32>
{
	let cs = givens_conventional(x, y);
	return givens_cs_3D_1_2(cs.x, cs.y);
}

fn givens_xy_3D_2_3(x: f32, y: f32) -> mat3x3<f32>
{
	let cs = givens_conventional(x, y);
	return givens_cs_3D_2_3(cs.x, cs.y);
}

fn givens_xy_3D_1_3(x: f32, y: f32) -> mat3x3<f32>
{
	let cs = givens_conventional(x, y);
	return givens_cs_3D_1_3(cs.x, cs.y);
}

fn givens_hat_xy_3D_1_2(x: f32, y: f32) -> mat3x3<f32>
{
	let cs = givens_unconventional(x,y);
	return givens_cs_3D_1_2(cs.x, cs.y);
}

fn givens_hat_xy_3D_2_3(x: f32, y: f32) -> mat3x3<f32>
{
	let cs = givens_unconventional(x,y);
	return givens_cs_3D_2_3(cs.x, cs.y);
}

fn givens_hat_xy_3D_1_3(x: f32, y: f32) -> mat3x3<f32>
{
	let cs = givens_unconventional(x,y);
	return givens_cs_3D_1_3(cs.x, cs.y);
}

fn givens_xy_2D(x: f32, y: f32) -> mat2x2<f32>
{
	let cs = givens_conventional(x, y);
	return givens_cs_2D(cs.x, cs.y);
}

/********************************************************************************
* Algorithm 5, 6
*  Zerochasing and Upper Bidiagonalization
********************************************************************************/

fn zerochasing(UAV: SVDIntermediate) -> SVDIntermediate
{
	var out = UAV;

	var G = givens_xy_3D_1_2(out.A[0][0], out.A[0][1]);

	out.U = out.U * G;
	out.A = transpose(G) * out.A;

	G = givens_xy_3D_2_3(out.A[1][0], out.A[2][0]);

	out.A = out.A * G;
	out.V = out.V * G;

	G = givens_xy_3D_2_3(out.A[1][1], out.A[1][2]);

	out.U = out.U * G;
	out.A = transpose(G) * out.A;

	return out;
}

fn bidiagonalize(UAV: SVDIntermediate) -> SVDIntermediate
{
	var out = UAV;

	let G = givens_xy_3D_2_3(out.A[0][1], out.A[0][2]);

	out.U = out.U * G;
	out.A = transpose(G) * out.A;

	return zerochasing(out);
}

/********************************************************************************
* Algorithm 3, 4
*  SVD for 2x2
********************************************************************************/

fn polar_decomposition_2D(A: mat2x2<f32>) -> PolarDecomposition2D
{
	var out : PolarDecomposition2D;

	let x = A[0][0] + A[1][1];
	let y = A[0][1] - A[1][0];
	let d = sqrt(x * x + y * y);

	out.R = givens_cs_2D(1, 0);
	if (d != 0) {
		out.R = givens_cs_2D(x / d, -y / d);
	}

	out.S = transpose(out.R) * A;

	return out;
}

fn svd_2D(A: mat2x2<f32>) -> SVDecomposition2D
{
	let RS = polar_decomposition_2D(A);
	let R = RS.R;
	let S = RS.S;
	var c = 1.0;
	var s = 0.0;

	var out : SVDecomposition2D;

	out.Σ = vec2<f32>(S[0][0], S[1][1]);
	if (S[1][0] != 0) {
		let τ = 0.5 * (S[0][0] - S[1][1]);
		let w = sqrt(τ * τ + S[1][0] * S[1][0]);
		let t = S[1][0] / (τ + (f32(τ > 0) - f32(τ <= 0)) * w);
		c = inverseSqrt(t * t + 1.0);
		s = -t * c;
		out.Σ = vec2<f32>(
			c * c * S[0][0] - 2.0 * c * s * S[1][0] + s * s * S[1][1]
		  , s * s * S[0][0] + 2.0 * c * s + S[1][0] + c * c * S[1][1]
		);
	}

	if (out.Σ.x < out.Σ.y) {
		out.Σ = out.Σ.yx;
		out.V = givens_cs_2D(-s, c);
	} else {
		out.V = givens_cs_2D(c, s);
	}

	out.U = R * out.V;
	return out;
}

/********************************************************************************
* Algorithm 10
*  Sorting and sign flipping to impose the Σ[0] ≥ Σ[1] ≥ |Σ[2]| invariant
********************************************************************************/

// Exchange the position of two columns in a matrix.
fn swap_columns(first: u32, second: u32, U: mat3x3<f32>) -> mat3x3<f32>
{
	var out = U;
	out[first] = U[second];
	out[second] = U[first];

	return out;
}

fn sort_with_top_left_sub(UΣV : SVDecomposition) -> SVDecomposition
{
	var out = UΣV;

	if (abs(out.Σ.y) >= abs(out.Σ.z)) {
		if(out.Σ.y < 0) {
			out.Σ = vec3(out.Σ.x, -out.Σ.y, -out.Σ.z);
			out.U[1] *= -1;
			out.U[2] *= -1;
		}
		return out;
	}

	if (out.Σ.z < 0) {
		out.Σ = vec3(out.Σ.x, -out.Σ.y, -out.Σ.z);
		out.U[1] *= -1;
		out.U[2] *= -1;
	}

	out.Σ = out.Σ.xzy;
	out.U = swap_columns(1, 2, out.U);
	out.V = swap_columns(1, 2, out.V);

	if (out.Σ.y > out.Σ.x) {
		out.Σ = out.Σ.yxz;
		out.U = swap_columns(0, 1, out.U);
		out.V = swap_columns(0, 1, out.V);
	} else {
		out.U[2] *= -1;
		out.V[2] *= -1;
	}

	return out;
}

fn sort_with_bot_right_sub(UΣV : SVDecomposition) -> SVDecomposition
{
	var out = UΣV;

	if(abs(out.Σ.x) >= abs(out.Σ.y)) {
		if(out.Σ.x < 0) {
			out.Σ = vec3(-out.Σ.x, out.Σ.y, -out.Σ.z);
			out.U[0] *= -1; // !!!!!! maybe this doesn't assign??
			out.U[2] *= -1;
		}
		return out;
	}

	out.Σ = out.Σ.yxz;
	out.U = swap_columns(0, 1, out.U);
	out.V = swap_columns(0, 1, out.V);

	if(abs(out.Σ.y) < abs(out.Σ.z)) {
		out.Σ = out.Σ.xzy;
		out.U = swap_columns(1, 2, out.U);
		out.V = swap_columns(1, 2, out.V);
	} else {
		out.U[1] *= -1;
		out.V[1] *= -1;
	}

	if(out.Σ[1] < 0) {
		out.Σ = vec3(out.Σ.x, -out.Σ.y, -out.Σ.z);
		out.U[1] *= -1;
		out.U[2] *= -1;
	}

	return out;
}

/********************************************************************************
* Algorithm 7, 8, 9
*  The final QR SVD for 3x3
********************************************************************************/

/*
 * Finishes the SVD for which only the upper left needs to be solved.
 * A needs to look like this:
 *
 *    *  *  0
 *    *  *  0
 *    0  0 Σ[2]
 */
fn solve_reduced_top_left(UAV : SVDIntermediate) -> SVDecomposition
{
	var out : SVDecomposition;
	var top_left_svd = svd_2D(mat2x2(UAV.A[0].xy, UAV.A[1].xy));

	out.Σ = vec3(top_left_svd.Σ, UAV.A[2][2]);

	let u = mat3x3(
		vec3(top_left_svd.U[0], 0),
		vec3(top_left_svd.U[1], 0),
		vec3(0, 0, 1)
	);
	out.U = UAV.U * u;
	let v = mat3x3(
		vec3(top_left_svd.V[0], 0),
		vec3(top_left_svd.V[1], 0),
		vec3(0, 0, 1)
	);
	out.V = UAV.V * v;

	return out;
}

/*
 * Finishes the SVD for which only the bottom right needs to be solved.
 * A needs to look like this:
 *
 *  Σ[0] 0  0
 *    0  *  *
 *    0  *  *
 */
fn solve_reduced_bot_right(UAV : SVDIntermediate) -> SVDecomposition
{
	var out : SVDecomposition;
	var bot_right_svd = svd_2D(mat2x2(UAV.A[1].yz, UAV.A[2].yz));

	out.Σ = vec3(UAV.A[0][0], bot_right_svd.Σ);

	let u = mat3x3(
		vec3(1, 0, 0),
		vec3(0, bot_right_svd.U[0]), // !!!! maybe embedding this way is wrong?
		vec3(0, bot_right_svd.U[1])
	);
	out.U = UAV.U * u;
	let v = mat3x3(
		vec3(1, 0, 0),
		vec3(0, bot_right_svd.V[0]),
		vec3(0, bot_right_svd.V[1])
	);
	out.V = UAV.V * v;

	return out;
}

fn norm_frobenius(A: mat3x3<f32>) -> f32
{
	return sqrt(dot(A[0], A[0]) + dot(A[1], A[1]) + dot(A[2], A[2]));
}

// Singular Value Decomposition for 3x3 matrices.
fn svd_3D(A_in: mat3x3<f32>) -> SVDecomposition
{
	var UAV : SVDIntermediate;

	UAV.U = IDENTITY_MATRIX;
	UAV.A = A_in;
	UAV.V = IDENTITY_MATRIX;

	// QR Iterative Algorithm

	UAV = bidiagonalize(UAV);
	var α = vec3(UAV.A[0][0], UAV.A[1][1], UAV.A[2][2]);
	var β = vec2(UAV.A[1][0], UAV.A[2][1]);
	var γ = vec2(α[0] * β[0], α[1] * β[1]);
	const η = 128.0 / (1 << 23);
	let τ = η * max(0.5 * norm_frobenius(UAV.A), 1.0);

	while (abs(β[1]) > τ
		&& abs(β[0]) > τ
		&& abs(α[0]) > τ
		&& abs(α[1]) > τ
		&& abs(α[2]) > τ
	) {
		let d = 0.5 * (α[1] * α[1] + β[0] * β[0] - (α[2] * α[2] + β[1] * β[1]));
		let μ = (sign(d) + f32(d == 0))
			* abs(γ[1] * γ[1] / (abs(d) + sqrt(d * d + γ[1] * γ[1])));
		let G = givens_xy_3D_1_2(α[0] * α[0] - μ, γ[0]);
		UAV.A = UAV.A * G;
		UAV.V = UAV.V * G;
		UAV = zerochasing(UAV);
		α = vec3(UAV.A[0][0], UAV.A[1][1], UAV.A[2][2]);
		β = vec2(UAV.A[1][0], UAV.A[2][1]);
		γ = vec2(α[0] * β[0], α[1] * β[1]);
	}

	// Inlined Algorithm 8, post process

	var out : SVDecomposition;

	if (abs(β[1]) <= τ) {
		out = solve_reduced_top_left(UAV);
		out = sort_with_top_left_sub(out);
	} else if (abs(β[0]) <= τ) {
		out = solve_reduced_bot_right(UAV);
		out = sort_with_bot_right_sub(out);
	} else if (abs(α[1]) <= τ) {
		let G_hat = givens_hat_xy_3D_2_3(UAV.A[2][1], UAV.A[2][2]);
		UAV.U = UAV.U * G_hat;
		UAV.A = transpose(G_hat) * UAV.A;

		out = solve_reduced_top_left(UAV);
		out = sort_with_top_left_sub(out);
	} else if (abs(α[2]) <= τ) {
		var G = givens_xy_3D_2_3(UAV.A[1][1], UAV.A[2][1]);
		UAV.A = UAV.A * G;
		UAV.V = UAV.V * G;

		G = givens_xy_3D_1_3(UAV.A[0][0], UAV.A[2][0]);
		UAV.A = UAV.A * G;
		UAV.V = UAV.V * G;

		out = solve_reduced_top_left(UAV);
		out = sort_with_top_left_sub(out);
	} else /*(abs(α[0]) <= τ)*/ {
		var G_hat = givens_hat_xy_3D_1_2(UAV.A[1][0], UAV.A[1][1]);
		UAV.U = UAV.U * G_hat;
		UAV.A = transpose(G_hat) * UAV.A;

		G_hat = givens_hat_xy_3D_1_3(UAV.A[2][0], UAV.A[2][2]);
		UAV.U = UAV.U * G_hat;
		UAV.A = transpose(G_hat) * UAV.A;

		out = solve_reduced_bot_right(UAV);
		out = sort_with_bot_right_sub(out);
	}

	return out;
}

// Produces a polar decomposition of A: that is, A = RS where R is a rotation and S is symmetric.
fn polar_decomposition_3D(A: mat3x3<f32>) -> PolarDecomposition
{
	let svd = svd_3D(A);

	var out : PolarDecomposition;
	out.R = svd.U * transpose(svd.V);
	out.S = svd.V * mat3x3<f32>(svd.Σ[0], 0, 0, 0, svd.Σ[1], 0, 0, 0, svd.Σ[2]) * transpose(svd.V);

	return out;
}
