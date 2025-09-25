#include types.inc.wgsl
#include svd.inc.wgsl
#include linear_algebra.inc.wgsl

/********************************************************************************
* Heavily based on:
* [0]
*  Chenfanfu Jiang, Craig Schroeder, Joseph Teran, Alexey Stomakhin, and Andrew
*  Selle. 2016. The material point method for simulating continuum materials. In
*  ACM SIGGRAPH 2016 Courses (SIGGRAPH '16). Association for Computing Machinery,
*  New York, NY, USA, Article 24, 1–52. https://doi.org/10.1145/2897826.2927348
*
* We refer to papers by the citation number.
********************************************************************************/

/********************************************************************************
* Kernels for grid interpolation
*  These kernels take in a normalized grid distance as their parameter.
*  For example, if 'h' is the grid spacing in world-units, and 'x' is the
*  distance of two particles in world-units, then you should call kernel_x(x/h).
********************************************************************************/

fn kernel_cubic(x: f32) -> f32 {
	let abs_x = abs(x);

	if(abs_x >= 2) {
		return 0;
	}

	if(abs_x >= 1) {
		let t = 2 - abs_x;
		return t * t * t / 6.0;
	}

	return 0.5 * abs_x * abs_x * abs_x - abs_x * abs_x + 2.0 / 3.0;
}

fn kernel_quadratic(x: f32) -> f32 {
	let abs_x = abs(x);

	if(abs_x > 1.5) {
		return 0;
	}

	if(abs_x > 0.5) {
		let t = 1.5 - abs_x;
		return 0.5 * t * t;
	}

	return 0.75 - abs_x * abs_x;
}

fn kernel_linear(x: f32) -> f32 {
	let abs_x = abs(x);

	if(abs_x > 1.0) {
		return 0;
	}

	return 1.0 - abs_x;
}

// All positions should be the same units.
// Computes N_i in Equation (121) from [0]
// Stencil is a cube of radius 1.5 grid points.
fn weighting_quadratic(
	position_particle: vec3<f32>,
	position_grid: vec3<f32>,
	grid_spacing: vec3<f32>
) -> f32
{
	let delta_normalized = (position_particle - position_grid) / grid_spacing;

	return kernel_quadratic(delta_normalized.x)
	     * kernel_quadratic(delta_normalized.y)
	     * kernel_quadratic(delta_normalized.z);
}

// Computes σ, the Cauchy stress tensor, from equations (38) and (52) of [0]
// deformation_gradient is labelled F in [0]
fn stressCauchy(
	deformation_gradient: mat3x3<f32>
) -> mat3x3<f32>
{
	let J = determinant(deformation_gradient);

	let μ = LAMÉ_PARAMETER_GIGAPASCALS;
	let λ = SHEAR_MODULUS_GIGAPASCALS;
	let F = deformation_gradient;
	let F_T = transpose(F);

	let RS = polar_decomposition_3D(F);

	let P = 2.0 * μ * (F - RS.R) + λ * (J - 1) * J * matrixInverse(F_T);

	return (1.0 / J) * P * transpose(F_T);
}

const LAMÉ_PARAMETER_GIGAPASCALS = 15.0;
const SHEAR_MODULUS_GIGAPASCALS = 12.0;

const G_METER_PER_SECOND2 = 9.80665;
const SECOND_PER_YEAR = 365 * 24 * 60 * 60;
const G_METERS_PER_YEAR2 = G_METER_PER_SECOND2 * SECOND_PER_YEAR;
const TIMESTEP_YEAR = 1000.0;

// Numbers between 1 and 4 seem acceptable for density in g/cm
const PARTICLE_DENSITY_GRAM_PER_CENTIMETER3 = 3.0;
const PARTICLE_VOLUME_CENTIMETER3 = 1.0;
const METER_PER_CENTIMETER = 1.0 / 100.0;

const PARTICLE_VOLUME_METER3 = PARTICLE_VOLUME_CENTIMETER3 * METER_PER_CENTIMETER * METER_PER_CENTIMETER * METER_PER_CENTIMETER;
const PARTICLE_MASS_GRAM = PARTICLE_VOLUME_CENTIMETER3 * PARTICLE_DENSITY_GRAM_PER_CENTIMETER3;

@group(0) @binding(0) var<storage, read> particles : ParticleBuffer;
@group(0) @binding(0) var<storage, read_write> out_particles : ParticleBuffer;

@group(0) @binding(1) var<storage, read> grid  : MPMGrid;
@group(0) @binding(1) var<storage, read_write> out_grid  : MPMGrid;

// One invocation per grid point
@compute @workgroup_size(8, 8, 4)
fn transferParticleToGrid(
	@builtin(global_invocation_id) grid_position : vec3<u32>
) {
	let grid_stride = vec3(1, out_grid.dimension, out_grid.dimension * out_grid.dimension);
	let grid_idx = dot(grid_position, grid_stride);

	var mass = 0.0;
	var momentum = vec3<f32>(0.0);
	var force_stress = vec3<f32>(0.0);

	let grid_position_world = out_grid.spacing_world * vec3<f32>(grid_position);

	// Dp, defined in equation (174) of [0]. This simplified identity in the
	// quadratic case is given a paragraph or two ahead.
	let weighting_uniform_quadratic = 1.0 / (0.25 * out_grid.spacing_world * out_grid.spacing_world);

	for(var particle_idx = 0u; particle_idx < particles.count_total; particle_idx++) {
		let particle = particles.particles[particle_idx];
		let weighting = weighting_quadratic(
			particle.position_world,
			grid_position_world,
			vec3<f32>(out_grid.spacing_world)
		);
		let delta = grid_position_world - particle.position_world;

		mass += PARTICLE_MASS_GRAM * weighting;
		momentum += PARTICLE_MASS_GRAM * weighting
			* (particle.velocity
				+ particle.affine_velocity * delta);

		force_stress -= (
				determinant(particle.deformation_gradient)
				* PARTICLE_VOLUME_METER3
				* weighting
				* weighting_uniform_quadratic )
			* (particle.stress_cauchy * delta);
	}

	let force_gravity = mass * vec3<f32>(0.0, -G_METERS_PER_YEAR2, 0.0);
	momentum += TIMESTEP_YEAR * (force_gravity + force_stress);

	var grid_point : MPMGridPoint;
	grid_point.momentum = momentum;
	grid_point.mass = mass;
	grid_point.velocity = momentum / mass;

	out_grid.points[grid_idx] = grid_point;
}

@compute @workgroup_size(256,1,1)
fn transferGridToParticle(
	@builtin(global_invocation_id) invocation_id : vec3<u32>
) {
	let particle_idx = invocation_id.x;
	let particle_position_world_old = out_particles.particles[particle_idx].position_world.xyz;
	let particle_position_grid = particle_position_world_old / grid.spacing_world;

	let grid_stride = vec3(1, grid.dimension, grid.dimension * grid.dimension);

	// the basis of the quadratic kernel we use
	const STENCIL_RADIUS_QUADRATIC = 1.5;

 	var velocity = vec3<f32>(0.0);

	let stencil_min = vec3<u32>(max( ceil(particle_position_grid - STENCIL_RADIUS_QUADRATIC), vec3<f32>()));
	let stencil_max = vec3<u32>(min(floor(particle_position_grid + STENCIL_RADIUS_QUADRATIC), vec3(f32(grid.dimension))));
	for(var z : u32 = stencil_min.z; z < stencil_max.z; z += 1) {
		for(var y : u32 = stencil_min.y; y < stencil_max.y; y += 1) {
			for(var x : u32 = stencil_min.x; x < stencil_max.x; x += 1) {
				let grid_position = vec3<u32>(x,y,z);
				let grid_position_world = grid.spacing_world * vec3<f32>(grid_position);
				let grid_idx = dot(grid_position, grid_stride);

				let weighting = weighting_quadratic(
					particle_position_world_old,
					grid_position_world,
					vec3<f32>(grid.spacing_world)
				);

				velocity += weighting * grid.points[grid_idx].velocity.xyz;
			}
		}
	}

	out_particles.particles[particle_idx].velocity = velocity;

	out_particles.particles[particle_idx].position_world += TIMESTEP_YEAR * velocity;
	let particle_position_world_new = out_particles.particles[particle_idx].position_world;

	// Dp, defined in equation (174) of [0]. This simplified identity in the
	// quadratic case is given a paragraph or two ahead.
	let weighting_uniform_quadratic = 1.0 / (0.25 * grid.spacing_world * grid.spacing_world);

	var affine_velocity = mat3x3<f32>();

	for(var z : u32 = stencil_min.z; z < stencil_max.z; z += 1) {
		for(var y : u32 = stencil_min.y; y < stencil_max.y; y += 1) {
			for(var x : u32 = stencil_min.x; x < stencil_max.x; x += 1) {
				let grid_position = vec3<u32>(x,y,z);
				let grid_position_world = grid.spacing_world * vec3<f32>(grid_position);

				let weighting = weighting_quadratic(
					particle_position_world_new,
					grid_position_world,
					vec3<f32>(grid.spacing_world)
				);

				let delta = grid_position_world - particle_position_world_new;
				let weighting_factor = 0.25 * dot(delta, delta);

				affine_velocity += weighting_uniform_quadratic * weighting * multiplyOuter(velocity, delta);
			}
		}
	}

	const IDENTITY_MATRIX = mat3x3<f32>(
		1.0, 0.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 0.0, 1.0
	);

	out_particles.particles[particle_idx].affine_velocity = affine_velocity;

	let deformation_gradient = (IDENTITY_MATRIX + TIMESTEP_YEAR * affine_velocity) * out_particles.particles[particle_idx].deformation_gradient;

	out_particles.particles[particle_idx].deformation_gradient = deformation_gradient;
	out_particles.particles[particle_idx].stress_cauchy = stressCauchy(deformation_gradient);
}

