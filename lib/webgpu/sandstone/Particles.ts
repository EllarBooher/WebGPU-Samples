import { SIZEOF } from "./Sizeof";

export const PARTICLE_BOUNDING_BOX = {
	min: [1.0, 1.0, 1.0],
	max: [15.0, 15.0, 15.0],
};
export const PARTICLE_DIMENSIONS = [32, 32, 32];
export const PARTICLE_COUNT =
	PARTICLE_DIMENSIONS[0] * PARTICLE_DIMENSIONS[1] * PARTICLE_DIMENSIONS[2];
export const GRID_DIMENSION = 32;
export const NEIGHBORHOOD_SIZE = 9;

export interface Particles {
	/* ParticleBuffer in types.inc.wgsl */
	particleBuffer: GPUBuffer;
	/* A buffer to copy the particles header into, for querying particle stats such as surface particle count */
	particleHeaderHostBuffer: GPUBuffer;
	countSurface?: number;

	particleGraphBuffer: GPUBuffer;
	particleGraphBufferDebug: GPUBuffer;
	particleGraphPongBuffer: GPUBuffer;
	particleGraphIndirect: GPUBuffer;

	// Each particle has 4 vertices, for the quad when rendering a debug view
	vertices: GPUBuffer;
	// The small grid we project to when converting to a mesh
	projectedGrid: GPUBuffer;
	// Flag that tracks if the particle normals / projectedGrid have been populated
	meshDirty: boolean;
}
export const buildParticles = (device: GPUDevice): Particles => {
	const verticesBuffer = device.createBuffer({
		size: PARTICLE_COUNT * 4 * SIZEOF.vec4_f32,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
	});

	const projectedGridBuffer = device.createBuffer({
		size:
			SIZEOF.gridPoint * GRID_DIMENSION * GRID_DIMENSION * GRID_DIMENSION,
		usage: GPUBufferUsage.STORAGE,
	});

	const particleBufferHeaderSize = SIZEOF.vec4_f32;
	const particleHeaderHostBuffer = device.createBuffer({
		size: particleBufferHeaderSize,
		usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
	});
	const particleBuffer = device.createBuffer({
		size: particleBufferHeaderSize + PARTICLE_COUNT * SIZEOF.particle,
		usage:
			GPUBufferUsage.COPY_DST |
			GPUBufferUsage.STORAGE |
			GPUBufferUsage.COPY_SRC,
	});

	const edgeCapacity = NEIGHBORHOOD_SIZE * PARTICLE_COUNT * 2;
	const particleGraphBufferHeaderSize = SIZEOF.vec4_u32;
	const particleGraphBuffer = device.createBuffer({
		size: particleGraphBufferHeaderSize + edgeCapacity * SIZEOF.vec2_u32,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
	});
	const particleGraphIndirect = device.createBuffer({
		size:
			SIZEOF.dispatchIndirectParameters +
			SIZEOF.drawIndexedIndirectParameters,
		usage:
			GPUBufferUsage.INDIRECT |
			GPUBufferUsage.STORAGE |
			GPUBufferUsage.COPY_SRC,
	});
	const particleGraphBufferDebug = device.createBuffer({
		size: particleGraphIndirect.size + particleGraphBuffer.size,
		usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
	});
	const particleGraphPongBuffer = device.createBuffer({
		size: particleGraphBuffer.size,
		usage: particleGraphBuffer.usage,
	});

	return {
		particleBuffer,
		particleHeaderHostBuffer,
		particleGraphBuffer,
		particleGraphBufferDebug,
		particleGraphPongBuffer,
		vertices: verticesBuffer,
		projectedGrid: projectedGridBuffer,
		meshDirty: true,
		particleGraphIndirect,
	};
};
export const writeParticles = (
	device: GPUDevice,
	particles: Particles
): void => {
	interface Layer {
		start: number;
		end: number;
		color: [number, number, number];
	}
	const layers: Layer[] = [];
	let totalFractionalHeight = 0;
	const minColor = [0.78, 0.658, 0.494];
	const maxColor = [0.31, 0.173, 0.0745];
	const lerp = (min: number, max: number, t: number): number =>
		min * (1 - t) + max * t;

	const particleBoundingBoxExtent = PARTICLE_BOUNDING_BOX.max.map(
		(value, idx) => value - PARTICLE_BOUNDING_BOX.min[idx]
	);

	while (totalFractionalHeight < 1) {
		let height = 0.1 * Math.random();
		if (layers.length === 0) {
			height = Math.max(height, 0.1);
		}
		if (totalFractionalHeight >= 0.9) {
			height = 1.0;
		}
		const t = Math.pow(Math.random(), 1 / 2);
		layers.push({
			start: totalFractionalHeight,
			end: totalFractionalHeight + height,
			color: [
				lerp(minColor[0], maxColor[0], t),
				lerp(minColor[1], maxColor[1], t),
				lerp(minColor[2], maxColor[2], t),
			],
		});
		totalFractionalHeight += height;
	}
	const sampleColor = (
		fractionOfHeight: number
	): [number, number, number] => {
		let layer = 0;
		while (
			layer < layers.length &&
			(layers.at(layer)?.end ?? 0) < fractionOfHeight
		) {
			layer += 1;
		}
		if (layer >= layers.length) {
			return [0.0, 0.0, 0.0];
		}
		return layers[layer].color;
	};

	const f32PerParticle = SIZEOF.particle / SIZEOF.f32;
	const particlesFloats = new Float32Array(
		PARTICLE_COUNT * f32PerParticle
	).fill(0.0);

	for (let x = 0; x < PARTICLE_DIMENSIONS[0]; x++) {
		for (let y = 0; y < PARTICLE_DIMENSIONS[1]; y++) {
			for (let z = 0; z < PARTICLE_DIMENSIONS[2]; z++) {
				const particleIdx =
					x * PARTICLE_DIMENSIONS[2] * PARTICLE_DIMENSIONS[1] +
					y * PARTICLE_DIMENSIONS[2] +
					z;
				const offset = particleIdx * f32PerParticle;

				const deviation = 0.4 * (Math.random() - 0.5);

				const position = {
					x:
						(particleBoundingBoxExtent[0] /
							PARTICLE_DIMENSIONS[0]) *
							(x + deviation) +
						PARTICLE_BOUNDING_BOX.min[0] +
						deviation,
					y:
						(particleBoundingBoxExtent[1] /
							PARTICLE_DIMENSIONS[1]) *
							(y + deviation) +
						PARTICLE_BOUNDING_BOX.min[1] +
						deviation,
					z:
						(particleBoundingBoxExtent[2] /
							PARTICLE_DIMENSIONS[2]) *
							(z + deviation) +
						PARTICLE_BOUNDING_BOX.min[2] +
						deviation,
				};

				// Offsets into GPU-side Particle type

				// position_world
				particlesFloats[offset] = position.x;
				particlesFloats[offset + 1] = position.y;
				particlesFloats[offset + 2] = position.z;

				const [r, g, b] = sampleColor(
					(y + deviation) / PARTICLE_DIMENSIONS[1]
				);
				// color
				particlesFloats[offset + 8] = r;
				particlesFloats[offset + 9] = g;
				particlesFloats[offset + 10] = b;

				// affine_velocity, velocity, and stress_cauchy all start 0

				// deformation_gradient, identity matrix
				particlesFloats[offset + 28] = 1.0;
				particlesFloats[offset + 28 + 4 + 1] = 1.0;
				particlesFloats[offset + 28 + 4 + 4 + 1] = 1.0;
			}
		}
	}

	const particleBufferHeaderSize = SIZEOF.vec4_f32;
	device.queue.writeBuffer(
		particles.particleBuffer,
		0,
		new Uint32Array([0, 0, 0, PARTICLE_COUNT])
	);
	device.queue.writeBuffer(
		particles.particleBuffer,
		particleBufferHeaderSize,
		particlesFloats
	);

	particles.meshDirty = true;
};
