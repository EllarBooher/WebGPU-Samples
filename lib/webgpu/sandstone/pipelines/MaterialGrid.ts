import MaterialGridPak from "../../../shaders/sandstone/particles_mls_mpm.wgsl";
import { Particles } from "../Particles";
import { SIZEOF } from "../Sizeof";

/**
 * Implements the MPM-MLS method, evolving the sandstone particles over time
 * with simulated internal forces.
 */
interface MaterialGridPipeline {
	pipelines: {
		transferParticleToGrid: GPUComputePipeline;
		transferGridToParticle: GPUComputePipeline;
	};
	groups: {
		transferParticleToGrid: GPUBindGroup;
		transferGridToParticle: GPUBindGroup;
	};
	materialGrid: GPUBuffer;
}

export const CONSTANTS = Object.freeze({
	/* Distance between adjacent grid points. */
	gridSpacingWorld: 0.5,
	/* Number of grid points along each axis. The grid is a cube, for now. */
	gridDimension: 32,
	gridCount: 32 * 32 * 32,
});

export const build = ({
	device,
	particles,
}: {
	device: GPUDevice;
	particles: Particles;
}): MaterialGridPipeline => {
	const LABEL = "MaterialGridPipeline ";

	const materialGrid = device.createBuffer({
		label: LABEL + "materialGrid",
		size: SIZEOF.mpmGridHeader + CONSTANTS.gridCount * SIZEOF.mpmGridPoint,
		usage: GPUBufferUsage.STORAGE,
	});

	const shaderModule = device.createShaderModule({
		label: LABEL,
		code: MaterialGridPak,
	});

	const pipelines = {
		transferParticleToGrid: device.createComputePipeline({
			label: LABEL + "transferParticleToGrid",
			compute: {
				module: shaderModule,
				entryPoint: "transferParticleToGrid",
			},
			layout: device.createPipelineLayout({
				label: LABEL + "transferParticleToGrid",
				bindGroupLayouts: [
					device.createBindGroupLayout({
						label: LABEL + "transferParticleToGrid",
						entries: [
							{
								binding: 0,
								visibility: GPUShaderStage.COMPUTE,
								buffer: { type: "read-only-storage" },
							},
							{
								binding: 1,
								visibility: GPUShaderStage.COMPUTE,
								buffer: { type: "storage" },
							},
						],
					}),
				],
			}),
		}),
		transferGridToParticle: device.createComputePipeline({
			label: LABEL + "transferGridToParticle",
			compute: {
				module: shaderModule,
				entryPoint: "transferGridToParticle",
			},
			layout: device.createPipelineLayout({
				label: LABEL + "transferGridToParticle",
				bindGroupLayouts: [
					device.createBindGroupLayout({
						label: LABEL + "transferGridToParticle",
						entries: [
							{
								binding: 0,
								visibility: GPUShaderStage.COMPUTE,
								buffer: { type: "storage" },
							},
							{
								binding: 1,
								visibility: GPUShaderStage.COMPUTE,
								buffer: { type: "read-only-storage" },
							},
						],
					}),
				],
			}),
		}),
	};

	const groups = {
		transferParticleToGrid: device.createBindGroup({
			label: LABEL + "transferParticleToGrid",
			entries: [
				{ binding: 0, resource: particles.particleBuffer },
				{ binding: 1, resource: materialGrid },
			],
			layout: pipelines.transferParticleToGrid.getBindGroupLayout(0),
		}),
		transferGridToParticle: device.createBindGroup({
			label: LABEL + "transferGridToParticle",
			entries: [
				{ binding: 0, resource: particles.particleBuffer },
				{ binding: 1, resource: materialGrid },
			],
			layout: pipelines.transferGridToParticle.getBindGroupLayout(0),
		}),
	};

	return {
		groups,
		pipelines,
		materialGrid,
	};
};
