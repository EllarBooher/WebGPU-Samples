// Returns the inverse of the given matrix. Result is undefined if the determinant is zero.
fn matrixInverse(
	m: mat3x3<f32>
) -> mat3x3<f32> {
    var adjoint: mat3x3<f32>;

    adjoint[0][0] =   (m[1][1] * m[2][2] - m[2][1] * m[1][2]);
    adjoint[1][0] = - (m[1][0] * m[2][2] - m[2][0] * m[1][2]);
    adjoint[2][0] =   (m[1][0] * m[2][1] - m[2][0] * m[1][1]);
    adjoint[0][1] = - (m[0][1] * m[2][2] - m[2][1] * m[0][2]);
    adjoint[1][1] =   (m[0][0] * m[2][2] - m[2][0] * m[0][2]);
    adjoint[2][1] = - (m[0][0] * m[2][1] - m[2][0] * m[0][1]);
    adjoint[0][2] =   (m[0][1] * m[1][2] - m[1][1] * m[0][2]);
    adjoint[1][2] = - (m[0][0] * m[1][2] - m[1][0] * m[0][2]);
    adjoint[2][2] =   (m[0][0] * m[1][1] - m[1][0] * m[0][1]);

	return (1.0 / determinant(m)) * adjoint;
}

// Returns left * right^T, assuming left and right are column vectors
fn multiplyOuter(
	left: vec3<f32>,
	right: vec3<f32>
) -> mat3x3<f32> {
	return mat3x3<f32>(
		right[0] * left, right[1] * left, right[2] * left
	);
}
