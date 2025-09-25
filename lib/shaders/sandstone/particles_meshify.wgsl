#include types.inc.wgsl
#include svd.inc.wgsl
#include graph.inc.wgsl
#include linear_algebra.inc.wgsl

struct GridPoint {
	position : vec3<f32>,
	filled   :      u32 ,
}

struct DrawIndexedIndirectParameters {
	padding0       : vec3<f32>,
	index_count    :      u32 ,
	instance_count :      u32 ,
	first_index    :      u32 ,
	base_vertex    :      u32 ,
	first_instance :      u32 ,
}

struct DispatchIndirectParameters {
	workgroup_count : vec3<u32>,
	padding0        :      u32 ,
}

struct GraphIndirectParameters {
	draw          : DrawIndexedIndirectParameters,
	dispatch_sort : DispatchIndirectParameters   ,
}

@group(0) @binding(0) var<uniform> 				u_global			: GlobalUniforms;

@group(1) @binding(0) var<storage, read> 		particles			: ParticleBuffer;
@group(1) @binding(0) var<storage, read_write> 	out_particles		: ParticleBuffer;

@group(2) @binding(0) var<storage, read> 		projected_grid		: array<GridPoint>;
@group(2) @binding(0) var<storage, read_write> 	out_projected_grid	: array<GridPoint>;

// Graph Read-Only
@group(3) @binding(0) var<storage, read>  particle_graph  : Graph;

// Graph with Indirect Buffer
@group(3) @binding(0) var<storage, read_write>  out_particle_graph      : Graph;
@group(3) @binding(1) var<storage, read_write>  out_particle_graph_indirect : GraphIndirectParameters;

// Graph Sorting
// @group(3) @binding(0) var<storage, read_write>  out_particle_graph      : Graph;
@group(3) @binding(1) var<storage, read_write>  out_particle_graph_pong : Graph;

const GRID_GAP = 1;
const GRID_DIMENSION: u32 = 32;

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

const EIGENVECTOR_METHOD_SVD       = 0u;
const EIGENVECTOR_METHOD_ITERATIVE = 1u;

// Sets the method used to compute the eigenvectors from the covariance matrix,
// which are used as the surface normals.
override EIGENVECTOR_METHOD : u32;

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

@compute @workgroup_size(256, 1, 1)
fn initParticleGraph(@builtin(global_invocation_id) invocation_id : vec3<u32>)
{
	out_particle_graph.padding0 = vec3<f32>(0.0);
	out_particle_graph.count = 0;

	out_particle_graph.edges[invocation_id.x].first_idx = 0;
	out_particle_graph.edges[invocation_id.x].second_idx = 0;

	out_particle_graph_indirect.draw = DrawIndexedIndirectParameters();
	out_particle_graph_indirect.dispatch_sort = DispatchIndirectParameters();
}

@compute @workgroup_size(256, 1, 1)
fn computeGridNormals(@builtin(global_invocation_id) invocation_id : vec3<u32>)
{
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
	var points : array<ClosestPoint,NEIGHBORHOOD_SIZE>;
	var count = 0;

	let particle_idx = invocation_id.x;
	let particle = out_particles.particles[particle_idx];
	if(particle.is_surface < 1) {
		out_particles.particles[particle_idx].normal_world = vec3<f32>(0.0);
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
		let further_than_furthest_possible = count >= NEIGHBORHOOD_SIZE && distance >= points[count - 1].distance;
		if(further_than_furthest_possible) {
			continue;
		}

		count = min(count + 1, NEIGHBORHOOD_SIZE);

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

	let edge_offset = 2 * NEIGHBORHOOD_SIZE * particle_idx;
	for(var i = 0; i < min(count, NEIGHBORHOOD_SIZE); i++) {
		let other_idx = points[i].particle_idx;

		if(other_idx == particle_idx) {
			continue;
		}

		var edge : Edge;
		edge.first_idx = particle_idx;
		edge.second_idx = other_idx;

		var inverse_edge : Edge;
		inverse_edge.first_idx = edge.second_idx;
		inverse_edge.second_idx = edge.first_idx;

		out_particle_graph.edges[edge_offset + u32(i)] = edge;
		out_particle_graph.edges[edge_offset + u32(i) + NEIGHBORHOOD_SIZE] = inverse_edge;
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

	var eigenvector : vec3<f32>;

	if(EIGENVECTOR_METHOD == EIGENVECTOR_METHOD_ITERATIVE) {
		/*
         * Taking the advantage of the fact that A^n v converges on the
		 * eigenvector with the largest eigenvalue. The covariance matrix
		 * is positive semi-definite, so all of its eigenvalues are non-negative.
		 * Thus, the eigenvector with the largest eigenvalue of the covariance
		 * matrix inverse is the vector we want.
		 */
		let cv_inverse = matrixInverse(covariance_matrix);
		// The centroid is a good guess for the axis of the normal
		eigenvector = -centroid;

		for(var i = 0; i < 20; i++) {
			eigenvector = normalize(cv_inverse * eigenvector);
		}
	} else if (EIGENVECTOR_METHOD == EIGENVECTOR_METHOD_SVD) {
		let TBN = svd_3D(covariance_matrix).U;
		eigenvector = normalize(TBN[2]);
	}

	out_particles.particles[particle_idx].normal_world = eigenvector;
}

/*
 * Call with one invocation. Compacts the graph, removing loops and empty edges. This prepares the graph for sorting.
 */
@compute @workgroup_size(1,1,1)
fn compactParticleGraph()
{
	var count_valid : u32 = 0;

	for(var seek_idx = 0u; seek_idx < arrayLength(&out_particle_graph.edges); seek_idx++) {
		let edge = out_particle_graph.edges[seek_idx];
		if(edge.first_idx == edge.second_idx) {
			out_particle_graph.edges[seek_idx] = Edge(0, 0);
			continue;
		}

		out_particle_graph.edges[count_valid] = edge;

		count_valid += 1;
	}

	out_particle_graph.count = count_valid;

	out_particle_graph_indirect.draw = DrawIndexedIndirectParameters();
	out_particle_graph_indirect.draw.index_count = 2;
	out_particle_graph_indirect.draw.instance_count = out_particle_graph.count;

	out_particle_graph_indirect.dispatch_sort = DispatchIndirectParameters();
	out_particle_graph_indirect.dispatch_sort.workgroup_count = vec3<u32>(count_valid / (256 * 32) + 1, 1, 1);
}

/*
 * Returns positive if left > right, returns 0 if =, returns negative otherwise
 */
fn compareEdge(
	left: Edge,
	right: Edge
) -> i32
{
	if(left.first_idx < right.first_idx) {
		return -1;
	}

	if (left.first_idx > right.first_idx) {
		return 1;
	}

	if (left.second_idx < right.second_idx) {
		return -1;
	}

	if (left.second_idx > right.second_idx) {
		return 1;
	}

	return 0;
}

/*
 * Call with one invocation. Compacts the graph, removing runs of duplicates.
 * The graph must already be sorted for this to remove all duplicates.
 */
@compute @workgroup_size(1,1,1)
fn compactSortedParticleGraph()
{
	// First one is valid for free
	var count_valid : u32 = 1;

	for(var seek_idx = 1u; seek_idx < out_particle_graph.count; seek_idx++) {
		let edge = out_particle_graph.edges[seek_idx];

		let this_edge_is_duplicate = compareEdge(edge, out_particle_graph.edges[count_valid - 1]) == 0;
		if(this_edge_is_duplicate) {
			continue;
		}

		out_particle_graph.edges[count_valid] = edge;
		count_valid += 1;
	}

	out_particle_graph.count = count_valid;

	for(var wipe_idx = out_particle_graph.count; wipe_idx < arrayLength(&out_particle_graph.edges); wipe_idx++) {
		out_particle_graph.edges[wipe_idx] = Edge(0, 0);
	}

	out_particle_graph_indirect.draw = DrawIndexedIndirectParameters();
	out_particle_graph_indirect.draw.index_count = 2;
	out_particle_graph_indirect.draw.instance_count = out_particle_graph.count;

	out_particle_graph_indirect.dispatch_sort = DispatchIndirectParameters();
}

/*
 * Performs the initial insertion sort before merging is possible.
 */
@compute @workgroup_size(256,1,1)
fn sortParticleGraphInitialChunks(
	@builtin(global_invocation_id) invocation_id : vec3<u32>
)
{
	// assume count_max >= 32
	let count_max = out_particle_graph.count;

	let chunk_size_ideal = 32u;
	let chunk_size_leftover = count_max % chunk_size_ideal;

	let chunk_count = count_max / chunk_size_ideal + u32(chunk_size_leftover > 0);

	if(invocation_id.x >= chunk_count) {
		return;
	}

	let is_last_chunk = (chunk_size_leftover > 0) && (invocation_id.x == chunk_count - 1);
	let chunk_size = u32(is_last_chunk) * chunk_size_leftover
		+ (1 - u32(is_last_chunk)) * chunk_size_ideal;

	let start = invocation_id.x * chunk_size_ideal;
	let end = start + chunk_size;

	// First element is trivially sorted
	var count_sorted : u32 = 1;
	for(var seek_idx = start + 1; seek_idx < end; seek_idx++) {
		let edge = out_particle_graph.edges[seek_idx];

		var insert_idx = start + count_sorted;
		while(insert_idx > start) {
			let other_edge = out_particle_graph.edges[insert_idx - 1];

			let greater_than_or_equal = compareEdge(edge, other_edge) > 0;
			if(greater_than_or_equal) {
				break;
			}

			out_particle_graph.edges[insert_idx] = out_particle_graph.edges[insert_idx - 1];
			insert_idx--;
		}

		out_particle_graph.edges[insert_idx] = edge;
		count_sorted++;
	}
}

/*
 * Merges the chunks. call with one invocation.
 */
@compute @workgroup_size(1, 1, 1)
fn sortParticleGraphMerge()
{
	let count_max = out_particle_graph.count;

	var write_into_pong = true;

	var chunk_size_ideal = 32u;

	while(chunk_size_ideal < count_max) {
		let chunk_size_leftover = count_max % chunk_size_ideal;

		let chunk_count = count_max / chunk_size_ideal + u32(chunk_size_leftover > 0);
		let merge_count = chunk_count / 2;

		var merge = 0u;
		var edges_transferred = 0u;
		for(; merge < merge_count; merge++) {
			let right_is_last_chunk = (2 * merge + 1) == (chunk_count - 1);
			let right_is_leftover_chunk = (chunk_size_leftover > 0) && right_is_last_chunk;

			let size_left = chunk_size_ideal;
			let size_right = u32(right_is_leftover_chunk) * chunk_size_leftover
				+ (1 - u32(right_is_leftover_chunk)) * chunk_size_ideal;

			let start_left = merge * 2 * chunk_size_ideal;
			let start_right = start_left + size_left;

			var idx_left = start_left;
			let end_left = start_left + size_left;

			var idx_right = start_right;
			let end_right = start_right + size_right;

			var idx_dest = start_left;

			while(idx_left < end_left && idx_right < end_right) {
				var edge_left : Edge;
				var edge_right : Edge;

				if(write_into_pong) {
					edge_left = out_particle_graph.edges[idx_left];
					edge_right = out_particle_graph.edges[idx_right];
				} else {
					edge_left = out_particle_graph_pong.edges[idx_left];
					edge_right = out_particle_graph_pong.edges[idx_right];
				}

				let less_than_or_equal = compareEdge(edge_left, edge_right) < 0;
				if(less_than_or_equal) {
					if(write_into_pong) {
						out_particle_graph_pong.edges[idx_dest] = edge_left;
					} else {
						out_particle_graph.edges[idx_dest] = edge_left;
					}
					idx_left++;
				} else {
					if(write_into_pong) {
						out_particle_graph_pong.edges[idx_dest] = edge_right;
					} else {
						out_particle_graph.edges[idx_dest] = edge_right;
					}
					idx_right++;
				}
				idx_dest++;
			}

			while(idx_left < end_left) {
				if(write_into_pong) {
					out_particle_graph_pong.edges[idx_dest] = out_particle_graph.edges[idx_left];
				} else {
					out_particle_graph.edges[idx_dest] = out_particle_graph_pong.edges[idx_left];
				}
				idx_dest++;
				idx_left++;
			}
			while(idx_right < end_right) {
				if(write_into_pong) {
					out_particle_graph_pong.edges[idx_dest] = out_particle_graph.edges[idx_right];
				} else {
					out_particle_graph.edges[idx_dest] = out_particle_graph_pong.edges[idx_right];
				}
				idx_dest++;
				idx_right++;
			}

			edges_transferred += size_left + size_right;
		}

		// Copy any edges that may have been left if there are an odd amount of chunks
		for(var idx_dest = edges_transferred; idx_dest < count_max; idx_dest++) {
			if(write_into_pong) {
				out_particle_graph_pong.edges[idx_dest] = out_particle_graph.edges[idx_dest];
			} else {
				out_particle_graph.edges[idx_dest] = out_particle_graph_pong.edges[idx_dest];
			}
		}

		chunk_size_ideal *= 2;
		write_into_pong = !write_into_pong;
	}

	let final_data_is_in_pong = !write_into_pong;
	if(final_data_is_in_pong) {
		for(var i : u32 = 0; i < count_max; i++) {
			out_particle_graph.edges[i] = out_particle_graph_pong.edges[i];
		}
	}
}

/********************************************************************************
* Render projected grid, highlighting filled cells
********************************************************************************/

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

	let center = u_global.camera.proj_view * vec4<f32>(GRID_GAP * grid_point.position, 1.0);
	let depth = center.z / center.w;

	var out: VertexOut;
	out.position = vec4<f32>(center.xy + 0.05 * (1.0 - depth) * VERTEX_TWIDDLES[vertex_idx] * vec2<f32>(1.0 / u_global.camera.aspect_ratio, 1.0), center.zw);

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

/********************************************************************************
* Render ParticleGraph with line list primitives
********************************************************************************/

struct DrawParticleGraphVertexOut {
	@builtin(position) position : vec4<f32>,
	@location(0) color : vec4<f32>,
}
struct DrawParticleGraphFragmentOut {
	@location(0) color : vec4<f32>,
}

@vertex
fn drawParticleGraphVertex(
	@builtin(vertex_index) vertex_idx : u32,
	@builtin(instance_index) edge_idx : u32
) -> DrawParticleGraphVertexOut
{
	let edge = particle_graph.edges[edge_idx];

	var particle_idx = edge.first_idx;
	if(vertex_idx > 0) {
		particle_idx = edge.second_idx;
	}

	let particle = particles.particles[particle_idx];

	var out : DrawParticleGraphVertexOut;
	out.position = u_global.camera.proj_view * vec4<f32>(particle.position_world.xyz, 1.0);

	// Dim further graph edges to make closer ones easier to see
	out.color = vec4<f32>(max(min(50 * out.position.z / out.position.w, 0.7), 0.2));

	if(edge.first_idx == u_global.debug_particle_idx || edge.second_idx == u_global.debug_particle_idx) {
		out.color = vec4<f32>(1.0, 0.0, 0.0, 1.0);
	}

	return out;
}

@fragment
fn drawParticleGraphFragment(
	frag : DrawParticleGraphVertexOut
) -> DrawParticleGraphFragmentOut
{
	var out : DrawParticleGraphFragmentOut;
	out.color = frag.color;

	return out;
}
