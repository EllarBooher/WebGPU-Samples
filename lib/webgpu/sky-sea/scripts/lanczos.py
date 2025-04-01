# Produce the parameters for the Lanczos approximation of the gamma function
# https://en.wikipedia.org/wiki/Lanczos_approximation
#
# These can then be dropped into place wherever they needed as a simple, accurate approximation of the gamma function.
#
# Based on https://web.viu.ca/pughg/phdThesis/phdThesis.pdf
# For the coefficient formula, see the explicit form of equation (6.2) on page 74
# Values of r based on n with a good error bound can be obtained from table C.2: Error Data

import argparse, math

parser = argparse.ArgumentParser(
	prog='lanczos',
	description='Generate parameters for an approximation of the Gamma function')

parser.add_argument(
	'-n',
	help='The number of terms minus one to use when approximating the value. The approximation converges as terms tend to infinity.',
	type=int,
)
parser.add_argument(
	'-r',
	help='A relatively arbitrary parameter that helps control the rate of convergence and error. Determining the best value as a function of n is complicated, but any value near n should be decent.',
	type=float,
)

args = parser.parse_args()

term_count = 3 if args.n is None else args.n
r = 3.655180 if args.r is None else args.r

print(f'Generating approximation of the Gamma function with n={term_count} and r={r}')

if term_count < 1:
	raise Exception("Term count (argument -N) must be 1 or greater.")

a_0 = math.sqrt(2.0 * math.e / (math.pi * (r + 0.5))) * math.exp(r)
lanczos_coefficients = [a_0]
# sum over 1,...,term_count
for k in range(1, term_count+1):
	scalar = math.sqrt(2.0 / math.pi) * math.exp(r) * k
	sum = 0.0
	# sum over 0,...,k
	for j in range(0,k+1):
		unit_term = (-1)**j
		factorial_term = math.factorial(k+j-1) / (math.factorial(k - j) * math.factorial(j))
		exponential_term = math.pow(math.e / (j + r + 0.5), j + 0.5)
		sum += unit_term * factorial_term * exponential_term
	lanczos_coefficients.append((-1)**k * scalar * sum)

# These coefficients are for the original Lanczos approximation sum formulation, sum of terms s_i where:
# s_0 = 0.5 * a_0
# s_i = z * a_i * [(z-1)*(z-2)*...*(z-(i-1))] / [(z+1)*(z+2)*...*(z-i)]
#
# We perform a partial fractions decomposition to compute new coefficients c_i for an equivalent sum of terms s'_i where:
# s'_0 = 0.5 + c_0
# s'_i = c_i / (z+i)
#
# The decomposition relies on the fact that (z-(n-1))/[(z+n)(z+k)] = 1/(n-k){[-k-(n-1)]/[z+k] + [2(n-1)+1]/[z+n]}
# The k-th (k > 0) term of the original sum decomposes into k terms of this new sum
# Also:
#  	z/(z+k) = 1 - k/(z+k)
# Combining these two facts gives us an algorithm for calculating c_i from a_0 through a_i

coefficients = [0] * len(lanczos_coefficients)

coefficients[0] += 0.5 * lanczos_coefficients[0]

# a_1 * z/z+1 = a_1 - a_1 * 1/z+1
coefficients[0] += lanczos_coefficients[1]
coefficients[1] += -lanczos_coefficients[1]

# decompose P_i = (a_i * z) * [(z-1)...(z-(i-1))] / [(z+1)(z+2)...(z+i)] into sum of 1/(z+i)
# An additional factor of (z-(i-1)) / (z+i) is multiplied at each successive term
# For the i-th term, we have to compute i two-fraction partial fraction decompositions since P_(i-1) is already decomposed and we can use that decomposition recursively
decomposition_terms = [1]

for n in range(2, term_count+1):
	decomposition_terms.append(0)
	for k in range(1, n):
		# these values will all be integral
		decomposition_terms[n-1] += ((2 * (n-1) + 1) * decomposition_terms[k-1]) / (n-k)
		decomposition_terms[k-1] = (-1) * (decomposition_terms[k-1] * ((n-1) + k)) / (n-k)

	for k in range(1, n+1):
		# After decomposition, numerator is of the form z * term
		# Note that z * term/(z+k) = term - (term * k) / (z+k)
		term = decomposition_terms[k-1] * lanczos_coefficients[n]
		coefficients[0] += term
		coefficients[k] += -k * term

print('')

print('Fitted polynomial: P(z) = c_0 + c_1 * (z+1)^(-1) + ... + c_k * (z+k)^(-1) + ... ')
print('Full equation gamma function approximation: gamma(z) = sqrt(2.0 * PI) * pow(z + r + 0.5, z + 0.5) * exp(-(z + r + 0.5)) * P(z)')
print(f'r = {r:0.18f}')
print('Coefficients c_i starting at c_0 (tail is all 0):')
print(["{0:0.18f}".format(c) for c in coefficients])
print('')

def gamma_approx(s):
	z = s - 1
	sum = coefficients[0]
	for i in range(1, len(coefficients)):
		sum += coefficients[i] / float(z + i)

	return math.sqrt(2.0 * math.pi) * math.pow(z + r + 0.5, z + 0.5) * math.exp(-(z+r+0.5)) * sum

epsilon = 0.0
worst_x = 0.0
step_size = 0.01
print(f'Testing absolute error |gamma_approx(x)/gamma(x) - 1.0|. Testing starts from x = 1.0, step sizes between samples is {step_size}.')
x = 0.0
while True:
	try:
		approx = gamma_approx(float(x)+1.0)
		exact = math.gamma(float(x)+1.0)
		if (not math.isfinite(exact) or not math.isfinite(approx)):
			print(f'Hit numeric limits of either function, stopping at {x=}')
			break

		ratio = approx / exact
		sample_epsilon = math.fabs(ratio - 1.0)
		if (sample_epsilon > epsilon):
			worst_x = x
			epsilon = sample_epsilon

		x += 0.0001

	except OverflowError:
		print('Hit overflow, stopping tests.')
		break
	except Exception as err:
		print(f'Unexpected error while testing approximation error {err=}, {type(err)=}')
		break

print(f'Worst absolute error found at x={worst_x}: {epsilon}.\n')
