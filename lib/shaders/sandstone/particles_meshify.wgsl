#include types.inc.wgsl

struct GridPoint {
	position : vec3<f32>,
	filled   : u32,
}

@group(0) @binding(0) var<uniform> 				u_camera			: CameraUBO;
@group(0) @binding(1) var<storage, read_write>  debug_neighborhood  : PointNeighborhood;

@group(1) @binding(0) var<storage, read> 		particles			: ParticleBuffer;
@group(1) @binding(0) var<storage, read_write> 	out_particles		: ParticleBuffer;

@group(2) @binding(0) var<storage, read> 		projected_grid		: array<GridPoint>;
@group(2) @binding(0) var<storage, read_write> 	out_projected_grid	: array<GridPoint>;

const GRID_GAP = 0.2;
const GRID_DIMENSION: u32 = 64;

const VERTEX_TWIDDLES: array<vec2<f32>,4> = array(
	vec2<f32>(1.0, 1.0),
	vec2<f32>(1.0, -1.0),
	vec2<f32>(-1.0, -1.0),
	vec2<f32>(-1.0, 1.0)
);
const GRID_STRIDE = vec3<u32>(
	1,
	GRID_DIMENSION,
	GRID_DIMENSION * GRID_DIMENSION
);

override PARTICLE_COUNT : u32;

@compute @workgroup_size(8, 8, 4)
fn initGrid(@builtin(global_invocation_id) grid_position : vec3<u32>) {
	let grid_idx = dot(GRID_STRIDE, grid_position);

	out_projected_grid[grid_idx].position = vec3<f32>(grid_position);
	out_projected_grid[grid_idx].filled = 0;
}

@compute @workgroup_size(256, 1, 1)
fn projectParticlesToGrid(@builtin(global_invocation_id) particle_idx : vec3<u32>) {
	let particle_position = particles.particles[particle_idx.x].position_world.xyz;

	let grid_position = vec3<u32>(round(particle_position / GRID_GAP));

	if(any(grid_position >= vec3<u32>(GRID_DIMENSION)) || any(grid_position < vec3<u32>(0))) {
		return;
	}

	let grid_idx = dot(GRID_STRIDE, grid_position);

	out_projected_grid[grid_idx].filled = 1;
}

@compute @workgroup_size(256, 1, 1)
fn identifySurfaceParticles(@builtin(global_invocation_id) particle_idx : vec3<u32>) {
	let particle_position = out_particles.particles[particle_idx.x].position_world.xyz;

	let grid_position = vec3<u32>(round(particle_position / GRID_GAP));

	if(any(grid_position >= vec3<u32>(GRID_DIMENSION)) || any(grid_position < vec3<u32>(0))) {
		return;
	}

	let grid_idx = dot(GRID_STRIDE, grid_position);

	var surface = false;

	surface |= (grid_position.x <= 0 			    || projected_grid[grid_idx - GRID_STRIDE.x].filled == 0);
	surface |= (grid_position.x >= GRID_DIMENSION-1 || projected_grid[grid_idx + GRID_STRIDE.x].filled == 0);
	surface |= (grid_position.y <= 0 			    || projected_grid[grid_idx - GRID_STRIDE.y].filled == 0);
	surface |= (grid_position.y >= GRID_DIMENSION-1 || projected_grid[grid_idx + GRID_STRIDE.y].filled == 0);
	surface |= (grid_position.z <= 0 			    || projected_grid[grid_idx - GRID_STRIDE.z].filled == 0);
	surface |= (grid_position.z >= GRID_DIMENSION-1 || projected_grid[grid_idx + GRID_STRIDE.z].filled == 0);

	out_particles.particles[particle_idx.x].is_surface = u32(surface);
}

/*
 * Call with one invocation. Shifts all the surface particles to the left,
 * to produce a more compact and efficient buffer. Does not overwrite the non-surface particles.
 * Also sets the count_surface counter.
 */
@compute @workgroup_size(1, 1, 1)
fn compactSurfaceParticles() {
	var seek_idx : u32 = 0;
	var count_surface : u32 = 0;

	while(seek_idx < out_particles.count_total) {
		let particle = out_particles.particles[seek_idx];
		if(particle.is_surface < 1) {
			seek_idx += 1;
			continue;
		}

		out_particles.particles[seek_idx] = out_particles.particles[count_surface];
		out_particles.particles[count_surface] = particle;

		seek_idx += 1;
		count_surface += 1;
	}

	out_particles.count_surface = count_surface;
}

struct ClosestPoint {
	position : vec3<f32>,
	distance : f32,
	particle_idx: u32,
}

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

@compute @workgroup_size(256, 1, 1)
fn computeGridNormals(@builtin(global_invocation_id) particle_idx : vec3<u32>) {
	// We estimate the normal as follows:
	//
	//      1) Get the k-neighborhood of closest points (k = 20) in our case
	//      2) Compute the centroid
	//      3) Compute the positive-definite covariance matrix obtained by summing (y-centroid) x (y-centroid)^T 3x3 matrices for y in the neighborhood
	//      4) Compute the eigenvector of smallest eigenvalue, and use that as the normal.
	//
	// The result will need to be refined in later steps by possibly flipping
	// it.

	// Brute fore the neighborhood
	var points : array<ClosestPoint,20>;
	var count = 0;

	let particle = out_particles.particles[particle_idx.x];
	if(particle.is_surface < 1) {
		out_particles.particles[particle_idx.x].normal_world = vec3<f32>(0.0);
		return;
	}

	let particle_position = particle.position_world;

	for(var candidate_idx : u32 = 0; candidate_idx < PARTICLE_COUNT; candidate_idx++) {
		let candidate_position = out_particles.particles[candidate_idx].position_world;
		let distance = distance(particle_position.xyz, candidate_position.xyz);
		if(distance < 0.00001) {
			continue;
		}

		// TODO: This is a spot where randomizing the order of the particles changes the output.
		let further_than_furthest_possible = count >= 20 && distance >= points[count - 1].distance;
		if(further_than_furthest_possible) {
			continue;
		}

		count = min(count + 1, 20);

		// shift points over
		var j = count - 1;
		while(j > 0) {
			if(points[j - 1].distance <= distance) {
				break;
			}
			points[j] = points[j - 1];
			j = j - 1;
		}

		var point : ClosestPoint;
		point.position = candidate_position;
		point.distance = distance;
		point.particle_idx = candidate_idx;

		points[j] = point;
	}

	if(particle_idx.x == debug_neighborhood.particle_idx) {
		for(var i = 0; i < min(count, NEIGHBORHOOD_SIZE); i++) {
			debug_neighborhood.neighborhood[i / 4][i % 4] = points[i].particle_idx;
		}
		debug_neighborhood.count = u32(min(count, NEIGHBORHOOD_SIZE));
	}

	// Compute the centroid
	var sum = vec3<f32>(0.0);
	for(var i = 0; i < count; i++) {
		sum += points[i].position;
	}
	let centroid = sum / f32(count);

	// Covariance Matrix is the sum of (y - centroid) x (y - centroid)^T, the
	// 3x3 matrices resulting from the outer product where y varies over the
	// closest points.
	var covariance_matrix = mat3x3<f32>(0,0,0,0,0,0,0,0,0);
	for(var i = 0; i < count; i++) {
		let position = points[i].position - centroid;
		covariance_matrix += mat3x3<f32>(position.x * position, position.y * position, position.z * position);
	}

	// compute eigenvectors, taking the advantage of the fact that A^n v
	// converges on the eigenvector with the largest eigenvalue. The covariance
	// matrix is positive semi-definite, so all of its eigenvalues are
	// non-negative. Thus, the eigenvector with the largest eigenvalue of the
	// covariance matrix inverse is the vector we want.
	//
	// TODO: consider case of eigenvalue equalling zero

	const ITERATION_STEPS = 100;

	let position = points[0].position - centroid;

	let cv_inverse = matrixInverse(covariance_matrix);
	// The centroid is a good guess for the axis of the normal
	var eigenvector = -centroid;

	for(var i = 0; i < ITERATION_STEPS; i++) {
		eigenvector = normalize(cv_inverse * eigenvector);
	}

	out_particles.particles[particle_idx.x].normal_world = eigenvector;
}

struct VertexOut {
    @builtin(position) position : vec4<f32>,
	@location(0) color : vec4<f32>,
}

struct FragmentOut {
	@location(0) color: vec4<f32>
}

@vertex
fn vertexMain(
	@builtin(vertex_index) vertex_idx : u32,
	@builtin(instance_index) grid_idx : u32
) -> VertexOut {
	let grid_point = projected_grid[grid_idx];

	let center = u_camera.proj_view * vec4<f32>(GRID_GAP * grid_point.position, 1.0);
	let depth = center.z / center.w;

	var out: VertexOut;
	out.position = vec4<f32>(center.xy + 0.05 * (1.0 - depth) * VERTEX_TWIDDLES[vertex_idx] * vec2<f32>(1.0 / u_camera.aspect_ratio, 1.0), center.zw);

	let green = vec4<f32>(0.0, 1.0, 0.0, 1.0);
	let red = vec4<f32>(1.0, 0.0, 0.0, 1.0);
	out.color = mix(red, green, f32(grid_point.filled));

	return out;
}

@fragment
fn fragmentMain(
	frag_interpolated: VertexOut
) -> FragmentOut {
	var out: FragmentOut;
	out.color = frag_interpolated.color;

	return out;
}
