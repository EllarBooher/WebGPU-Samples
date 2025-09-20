import numpy as np, numpy.typing as npt, random as rng;

#
# Implementation of:
#	 "Implicit-shifted Symmetric QR Singular Value Decomposition of 3x3 Matrices"
#         by Theodore Gast, Chuyuan Fu, Chenfanfu Jiang, and Joseph Teran
#         https://apps.dtic.mil/sti/tr/pdf/AD1014930.pdf
#
# For testing and reference before porting to WGSL
#

NDArrayFloat = npt.NDArray[np.float64]
np.set_printoptions(precision=8, suppress=True)

# For visualizing the invariant that this product is unchanged
def mul_UAV_T(U: NDArrayFloat, A: NDArrayFloat, V: NDArrayFloat):
	return np.matmul(U, np.matmul(A, np.transpose(V)))

################################################################################
# Algorithm 1
#  Construction of Givens matrices
################################################################################

# Return the values for a 3x3 givens matrix
def givens_conventional(x: float, y: float):
	d = x * x + y * y
	if d == 0:
		return (1, 0)

	t = 1.0 / np.sqrt(d)
	return (x * t, -y * t)
def givens_unconventional(x: float, y: float):
	d = x * x + y * y
	if d == 0:
		return (0, 1)

	t = 1.0 / np.sqrt(d)
	return (y * t, x * t)

def givens_1_2_cs(c: float, s: float):
	return np.array([[c, s, 0], [-s, c, 0], [0, 0, 1]])

def givens_2_3_cs(c: float, s: float):
	return np.array([[1, 0, 0], [0, c, s], [0, -s, c]])

def givens_1_3_cs(c: float, s: float):
	return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])

def givens_cs_2D(c: float, s: float):
	return np.array([[c, s], [-s, c]])

def givens_1_2_xy(x: float, y: float):
	(c,s) = givens_conventional(x,y)
	return givens_1_2_cs(c,s)

def givens_2_3_xy(x: float, y: float):
	(c,s) = givens_conventional(x,y)
	return givens_2_3_cs(c,s)

def givens_1_3_xy(x: float, y: float):
	(c,s) = givens_conventional(x,y)
	return givens_1_3_cs(c,s)

def givens_hat_1_2_xy(x: float, y: float):
	(c,s) = givens_unconventional(x,y)
	return givens_1_2_cs(c,s)

def givens_hat_2_3_xy(x: float, y: float):
	(c,s) = givens_unconventional(x,y)
	return givens_2_3_cs(c,s)

def givens_hat_1_3_xy(x: float, y: float):
	(c,s) = givens_unconventional(x,y)
	return givens_1_3_cs(c,s)

def givens_xy_2D(x: float, y: float):
	(c, s) = givens_conventional(x, y)
	return givens_cs_2D(c, s)

################################################################################
# Algorithm 5, 6
#  Zerochasing and Upper Bidiagonalization
################################################################################

# Assume U and V are rotations, and A(3,1) is 0. Makes A upper bidiagonal while
# maintaining UAV^T.
def zerochasing(U: NDArrayFloat, A: NDArrayFloat, V: NDArrayFloat):
	# We use these identities, which hold since G is a unitary rotation matrix:
	#
	# U(AG)(VG)^T = U(AG)(G^TV^T) = UA(GG^T)V^T = UAV^T
	# (UG)(G^TA)V^T = U(GG^T)AV^T = UAV^T

	G = givens_1_2_xy(A[0][0],A[1][0])

	U = np.matmul(U, G)
	A = np.matmul(np.transpose(G), A)

	G = givens_2_3_xy(A[0][1],A[0][2])

	A = np.matmul(A, G)
	V = np.matmul(V, G)

	G = givens_2_3_xy(A[1][1], A[2][1])

	U = np.matmul(U, G)
	A = np.matmul(np.transpose(G), A)

	return (U, A, V)

# Makes A upper bidiagonal while preserving UAV^T. Returns the new values (U, A, V).
def bidiagonalize(U: NDArrayFloat, A: NDArrayFloat, V: NDArrayFloat):
	G = givens_2_3_xy(A[1][0],A[2][0])

	U = np.matmul(U, G)
	A = np.matmul(np.transpose(G), A)

	return zerochasing(U, A, V)

################################################################################
# Algorithm 3, 4
#  SVD for 2x2
################################################################################

def polar_decomposition_2D(A: NDArrayFloat):
	(x, y) = (A[0][0]+A[1][1], A[1][0] - A[0][1])
	d = np.sqrt(x * x + y * y)
	R = givens_cs_2D(1, 0)
	if d != 0:
		R = givens_cs_2D(x / d, -y / d)

	S = np.matmul(np.transpose(R), A)

	return (R, S)

def test_polar_decomposition_2D():
	A = np.array([[rng.random() for x in range(0,2)] for y in range(0,2)])
	(R, S) = polar_decomposition_2D(A)
	print(f'test_polar_decomposition_2D: \n RR^T={np.matmul(R, np.transpose(R))} \n {S=}')

def svd_2D(A: NDArrayFloat):
	(R, S) = polar_decomposition_2D(A)
	(c, s) = (1, 0)
	σ = (S[0][0], S[1][1])
	if S[0][1] != 0:
		τ = 0.5 * (S[0][0] - S[1][1])
		w = np.sqrt(τ * τ + S[0][1] * S[0][1])
		t = S[0][1] / (τ + w if τ > 0 else τ - w)
		c = 1.0 / np.sqrt(t * t + 1)
		s = -t * c
		σ = (c * c * S[0][0] - 2 * c * s * S[0][1] + s * s * S[1][1]
	   		, s * s * S[0][0] + 2 * c * s * S[0][1] + c * c * S[1][1])

	V = givens_cs_2D(c, s)
	if σ[0] < σ[1]:
		σ = (σ[1], σ[0])
		V = givens_cs_2D(-s, c)

	U = np.matmul(R, V)
	return (U, σ, V)

################################################################################
# Algorithm 10
#  Sorting and sign flipping to impose the Σ[0] ≥ Σ[1] ≥ |Σ[2]| invariant
################################################################################

def flip_column_1(U: NDArrayFloat):
	U = np.copy(U)
	U[0][0] *= -1
	U[1][0] *= -1
	U[2][0] *= -1

	return U

def flip_column_2(U: NDArrayFloat):
	U = np.copy(U)
	U[0][1] *= -1
	U[1][1] *= -1
	U[2][1] *= -1

	return U

def flip_column_3(U: NDArrayFloat):
	U = np.copy(U)
	U[0][2] *= -1
	U[1][2] *= -1
	U[2][2] *= -1

	return U

def swap_columns_1_2(U: NDArrayFloat):
	U = np.array([
		[U[0][1], U[0][0], U[0][2]],
		[U[1][1], U[1][0], U[1][2]],
		[U[2][1], U[2][0], U[2][2]],
	])
	return U

def swap_columns_2_3(U: NDArrayFloat):
	U = np.array([
		[U[0][0], U[0][2], U[0][1]],
		[U[1][0], U[1][2], U[1][1]],
		[U[2][0], U[2][2], U[2][1]],
	])
	return U

def swap_columns_1_3(U: NDArrayFloat):
	U = np.array([
		[U[0][2], U[0][1], U[0][0]],
		[U[1][2], U[1][1], U[1][0]],
		[U[2][2], U[2][1], U[2][0]],
	])
	return U

def sort_with_top_left_sub(U: NDArrayFloat, Σ: list[float], V: NDArrayFloat):
	# print(f'Sort with top left. invariant Σ[1] ≥ |Σ[2]|: {Σ[0] >= abs(Σ[1])}')

	if abs(Σ[1]) >= abs(Σ[2]):
		if Σ[1] < 0:
			Σ = [Σ[0], -Σ[1], -Σ[2]]
			U = flip_column_2(flip_column_3(U))
		return (U, Σ, V)

	if Σ[2] < 0:
		Σ = [Σ[0], -Σ[1], -Σ[2]]
		U = flip_column_2(flip_column_3(U))

	Σ = [Σ[0], Σ[2], Σ[1]]
	(U, V) = (swap_columns_2_3(U), swap_columns_2_3(V))
	if Σ[1] > Σ[0]:
		Σ = [Σ[1], Σ[0], Σ[2]]
		(U, V) = (swap_columns_1_2(U), swap_columns_1_2(V))
	else:
		(U, V) = (flip_column_3(U), flip_column_3(V))

	return (U, Σ, V)

def sort_with_bot_right_sub(U: NDArrayFloat, Σ: list[float], V: NDArrayFloat):
	# print(f'Sort with bot right. invariant Σ[1] ≥ |Σ[2]|: {Σ[1] >= abs(Σ[2])}')

	if abs(Σ[0]) >= abs(Σ[1]):
		if Σ[0] < 0:
			Σ = [-Σ[0], Σ[1], -Σ[2]]
			U = flip_column_1(flip_column_3(U))
		return (U, Σ, V)

	Σ = [Σ[1], Σ[0], Σ[2]]
	(U, V) = (swap_columns_1_2(U), swap_columns_1_2(V))

	if abs(Σ[1]) < abs(Σ[2]):
		Σ = [Σ[0], Σ[2], Σ[1]]
		(U, V) = (swap_columns_2_3(U), swap_columns_2_3(V))
	else:
		(U, V) = (flip_column_2(U), flip_column_2(V))

	if Σ[1] < 0:
		Σ = [Σ[0], -Σ[1], -Σ[2]]
		U = flip_column_2(flip_column_3(U))

	return (U, Σ, V)

################################################################################
# Algorithm 7, 8, 9
#  The final QR SVD for 3x3
################################################################################

def solve_reduced_top_left(A: NDArrayFloat, U: NDArrayFloat, V: NDArrayFloat):
	σ_3 = A[2][2]
	(u, σ_12, v) = svd_2D(np.array([[A[0][0],A[0][1]],[A[1][0],A[1][1]]]))
	# embed 2D givens in 3D
	u = givens_1_2_cs(u[0][0], u[0][1])
	v = givens_1_2_cs(v[0][0], v[0][1])
	U = np.matmul(U, u)
	V = np.matmul(V, v)
	return (U, [σ_12[0], σ_12[1], σ_3], V)

def solve_reduced_bot_right(A: NDArrayFloat, U: NDArrayFloat, V: NDArrayFloat):
	σ_1 = A[0][0]
	(u, σ_23, v) = svd_2D(np.array([[A[1][1],A[1][2]],[A[2][1],A[2][2]]]))
	# embed 2D givens in 3D
	u = givens_2_3_cs(u[0][0], u[0][1])
	v = givens_2_3_cs(v[0][0], v[0][1])
	U = np.matmul(U, u)
	V = np.matmul(V, v)
	return (U, [σ_1, σ_23[0], σ_23[1]], V)

def svd_3D(A: NDArrayFloat):
	U = np.identity(3)
	V = np.identity(3)
	(U, A, V) = bidiagonalize(U, A, V)
	α = (A[0][0], A[1][1], A[2][2])
	β = (A[0][1],A[1,2])
	γ = (α[0] * β[0], α[1] * β[1])
	η = 128.0 / (1 << 23)
	τ = η * np.maximum(0.5 * np.linalg.norm(A), 1.0)

	iter = 0
	while np.abs(β[1]) > τ and np.abs(β[0]) > τ and np.abs(α[0]) > τ and np.abs(α[1]) > τ and np.abs(α[2]) > τ:
		d = 0.5 * (α[1] * α[1] + β[0] * β[0] - (α[2] * α[2] + β[1] * β[1]))
		μ = np.copysign(γ[1] * γ[1] / (np.abs(d) + np.sqrt(d * d + γ[1] * γ[1])), d)
		G = givens_1_2_xy(α[0] * α[0] - μ, γ[0])
		A = np.matmul(A, G)
		V = np.matmul(V, G)
		(U, A, V) = zerochasing(U, A, V)
		α = (A[0][0], A[1][1], A[2][2])
		β = (A[0][1],A[1,2])
		γ = (α[0] * β[0], α[1] * β[1])
		iter += 1

	# Inlined Algorithm 8, post process

	if np.abs(β[1]) <= τ:
		(U, Σ, V) = solve_reduced_top_left(A, U, V)
		(U, Σ, V) = sort_with_top_left_sub(U, Σ, V)

	elif np.abs(β[0]) <= τ:
		(U, Σ, V) = solve_reduced_bot_right(A, U, V)
		(U, Σ, V) = sort_with_bot_right_sub(U, Σ, V)

	elif np.abs(α[1]) <= τ:
		G_hat = givens_hat_2_3_xy(A[1][2], A[2][2])
		U = np.matmul(U, G_hat)
		A = np.matmul(np.transpose(G_hat), A)

		(U, Σ, V) = solve_reduced_top_left(A, U, V)
		(U, Σ, V) = sort_with_top_left_sub(U, Σ, V)

	elif np.abs(α[2]) <= τ:
		G = givens_2_3_xy(A[1][1], A[1][2])
		A = np.matmul(A, G)
		V = np.matmul(V, G)

		G = givens_1_3_xy(A[0][0], A[0][2])
		A = np.matmul(A, G)
		V = np.matmul(V, G)

		(U, Σ, V) = solve_reduced_top_left(A, U, V)
		(U, Σ, V) = sort_with_top_left_sub(U, Σ, V)

	else: # np.abs(α[0]) <= τ
		G_hat = givens_hat_1_2_xy(A[0][1], A[1][1])
		U = np.matmul(U, G_hat)
		A = np.matmul(np.transpose(G_hat), A)

		G_hat = givens_hat_1_3_xy(A[0][2], A[2][2])
		U = np.matmul(U, G_hat)
		A = np.matmul(np.transpose(G_hat), A)

		(U, Σ, V) = solve_reduced_bot_right(A, U, V)
		(U, Σ, V) = sort_with_bot_right_sub(U, Σ, V)

	return (U, Σ, V, iter)

def test_svd_3D():
	max_error = 4 * [0]
	total_error = 4 * [0]
	total_iter = 0
	total_QR_iter = 0
	max_QR_iter = 0

	for i in range(0, 100):
		A = np.array([[np.floor(2.0 * rng.random()) for x in range(0,3)] for y in range(0,3)])
		(U, Σ, V, QT_iter) = svd_3D(A)

		R = np.matmul(U, np.transpose(V))
		Σ = np.diag(Σ)
		S = np.matmul(V, np.matmul(Σ, np.transpose(V)))

		reconstructed_UAV_T = np.matmul(U, np.matmul(Σ, np.transpose(V)))
		reconstructed_RS = np.matmul(R, S)

		print(f'{np.linalg.det(A)=} \n {U=} \n {Σ=} \n {V=} \n {A=} \n {reconstructed_UAV_T=}')

		error = [
			np.linalg.norm(np.matmul(R, np.transpose(R)) - np.identity(3)),
			np.linalg.norm(reconstructed_UAV_T - A),
			np.linalg.norm(reconstructed_RS - A),
			np.linalg.norm(np.transpose(S) - S),
		]

		max_error = np.maximum(max_error, error)
		total_error = np.add(total_error, error)
		total_iter += 1
		total_QR_iter += QT_iter
		max_QR_iter = max(max_QR_iter, QT_iter)

	print(f'''
error from {total_iter} iterations:
	iteration of QR algorithm
		total   : {total_QR_iter}
		average : {total_QR_iter / total_iter}
		max     : {max_QR_iter}

	||R * R^T - I||
		total   : {total_error[0]}
		average : {total_error[0] / total_iter}
		max     : {max_error[0]}

	||UA(V^T) - A||
		total : {total_error[1]}
		average : {total_error[1] / total_iter}
		max   : {max_error[1]}

	||R * S - A||
		total : {total_error[2]}
		average : {total_error[2] / total_iter}
		max   : {max_error[2]}

	||S^T - S||
		total : {total_error[3]}
		average : {total_error[3] / total_iter}
		max   : {max_error[3]}
''')

test_svd_3D()
