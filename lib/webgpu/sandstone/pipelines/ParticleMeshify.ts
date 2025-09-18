import ParticleMeshifyPak from "../../../shaders/sandstone/particles_meshify.wgsl";
import { RenderOutputTexture } from "../../sky-sea/RenderOutputController";
import {
	GRID_DIMENSION,
	NEIGHBORHOOD_SIZE,
	PARTICLE_COUNT,
	Particles,
	PointNeighborhoodBuffer,
} from "../Particles";
import { SIZEOF } from "../Sizeof";

/**
 * A pipeline capable of recreating a mesh with normals from a cloud of particles.
 */
export interface ParticleMeshifyPipeline {
	pipeline_projectParticlesToGrid: GPUComputePipeline;
	pipeline_initGrid: GPUComputePipeline;
	pipeline_identifySurfaceParticles: GPUComputePipeline;
	pipeline_compactSurfaceParticles: GPUComputePipeline;
	pipeline_initParticleGraph: GPUComputePipeline;
	pipeline_computeGridNormals: GPUComputePipeline;
	pipeline_compactParticleGraph: GPUComputePipeline;
	pipeline_sortParticleGraphInitialChunks: GPUComputePipeline;
	pipeline_sortParticleGraphMerge: GPUComputePipeline;
	pipeline_drawParticleGraph: GPURenderPipeline;
	pipeline_render: GPURenderPipeline;
	groups: {
		camera: GPUBindGroup;
		particlesRead: GPUBindGroup;
		particlesReadWrite: GPUBindGroup;
		projectedGridRead: GPUBindGroup;
		projectedGridReadWrite: GPUBindGroup;
		particleGraphRead: GPUBindGroup;
		particleGraphReadWrite: GPUBindGroup;
		particleGraphPingPong: GPUBindGroup;
	};
	gridPointQuadIndexBuffer: GPUBuffer;
	lineIndexBuffer: GPUBuffer;
}

export const ParticleMeshifyPipeline = Object.freeze({
	build: (
		device: GPUDevice,
		colorFormat: GPUTextureFormat,
		depthFormat: GPUTextureFormat,
		particles: Particles,
		cameraUBO: GPUBuffer,
		debugNeighborhoodBuffer: PointNeighborhoodBuffer
	): ParticleMeshifyPipeline => {
		const layouts = {
			camera: device.createBindGroupLayout({
				entries: [
					{
						binding: 0,
						visibility:
							GPUShaderStage.COMPUTE | GPUShaderStage.VERTEX,
						buffer: { type: "uniform" },
					},
					{
						binding: 1,
						visibility: GPUShaderStage.COMPUTE,
						buffer: { type: "storage" },
					},
				],
				label: "ParticleMeshifyPipeline camera",
			}),
			readWriteStorage: device.createBindGroupLayout({
				entries: [
					{
						binding: 0,
						visibility: GPUShaderStage.COMPUTE,
						buffer: { type: "storage" },
					},
				],
				label: "ParticleMeshifyPipeline read-write storage",
			}),
			readOnlyStorage: device.createBindGroupLayout({
				entries: [
					{
						binding: 0,
						visibility:
							GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
						buffer: { type: "read-only-storage" },
					},
				],
				label: "ParticleMeshifyPipeline read-only storage",
			}),
			storagePingPong: device.createBindGroupLayout({
				entries: [
					{
						binding: 0,
						visibility: GPUShaderStage.COMPUTE,
						buffer: { type: "storage" },
					},
					{
						binding: 1,
						visibility: GPUShaderStage.COMPUTE,
						buffer: { type: "storage" },
					},
				],
				label: "ParticleMeshifyPipeline ping-pong",
			}),
		};

		const shaderModule = device.createShaderModule({
			code: ParticleMeshifyPak,
			label: "ParticleMeshifyPipeline ParticleMeshifyPak",
		});
		const pipeline_render = device.createRenderPipeline({
			vertex: { module: shaderModule, entryPoint: "vertexMain" },
			fragment: {
				targets: [{ format: colorFormat }],
				module: shaderModule,
				entryPoint: "fragmentMain",
			},
			depthStencil: {
				format: depthFormat,
				depthWriteEnabled: true,
				depthCompare: "greater",
			},
			primitive: { cullMode: "none" },
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readOnlyStorage,
					layouts.readOnlyStorage,
				],
				label: "ParticleMeshifyPipeline render",
			}),
			label: "ParticleMeshifyPipeline render",
		});
		const pipeline_projectParticlesToGrid = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "projectParticlesToGrid",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readOnlyStorage,
					layouts.readWriteStorage,
				],
				label: "ParticleMeshifyPipeline projectParticlesToGrid",
			}),
			label: "ParticleMeshifyPipeline projectParticlesToGrid",
		});
		const pipeline_initGrid = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "initGrid",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readOnlyStorage,
					layouts.readWriteStorage,
				],
				label: "ParticleMeshifyPipeline initGrid",
			}),
			label: "ParticleMeshifyPipeline initGrid",
		});
		const pipeline_identifySurfaceParticles = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "identifySurfaceParticles",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readWriteStorage,
					layouts.readOnlyStorage,
				],
				label: "ParticleMeshifyPipeline identifySurfaceParticles",
			}),
			label: "ParticleMeshifyPipeline identifySurfaceParticles",
		});
		const pipeline_compactSurfaceParticles = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "compactSurfaceParticles",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readWriteStorage,
					layouts.readOnlyStorage,
				],
				label: "ParticleMeshifyPipeline compactSurfaceParticles",
			}),
			label: "ParticleMeshifyPipeline compactSurfaceParticles",
		});
		const pipeline_initParticleGraph = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "initParticleGraph",
				constants: {
					PARTICLE_COUNT: PARTICLE_COUNT,
				},
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readOnlyStorage,
					layouts.readOnlyStorage,
					layouts.storagePingPong,
				],
				label: "ParticleMeshifyPipeline initParticleGraph",
			}),
			label: "ParticleMeshifyPipeline initParticleGraph",
		});
		const pipeline_computeGridNormals = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "computeGridNormals",
				constants: {
					PARTICLE_COUNT: PARTICLE_COUNT,
				},
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readWriteStorage,
					layouts.readOnlyStorage,
					layouts.readWriteStorage,
				],
				label: "ParticleMeshifyPipeline computeGridNormals",
			}),
			label: "ParticleMeshifyPipeline computeGridNormals",
		});
		const pipeline_compactParticleGraph = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "compactParticleGraph",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readOnlyStorage,
					layouts.readOnlyStorage,
					layouts.readWriteStorage,
				],
				label: "ParticleMeshifyPipeline compactParticleGraph",
			}),
			label: "ParticleMeshifyPipeline compactParticleGraph",
		});
		const pipeline_sortParticleGraphInitialChunks =
			device.createComputePipeline({
				compute: {
					module: shaderModule,
					entryPoint: "sortParticleGraphInitialChunks",
				},
				layout: device.createPipelineLayout({
					bindGroupLayouts: [
						layouts.camera,
						layouts.readOnlyStorage,
						layouts.readOnlyStorage,
						layouts.readWriteStorage,
					],
					label: "ParticleMeshifyPipeline sortParticleGraphInitialChunks",
				}),
				label: "ParticleMeshifyPipeline sortParticleGraphInitialChunks",
			});
		const pipeline_sortParticleGraphMerge = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "sortParticleGraphMerge",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readOnlyStorage,
					layouts.readOnlyStorage,
					layouts.storagePingPong,
				],
				label: "ParticleMeshifyPipeline sortParticleGraphMerge",
			}),
			label: "ParticleMeshifyPipeline sortParticleGraphMerge",
		});
		const pipeline_drawParticleGraph = device.createRenderPipeline({
			vertex: {
				module: shaderModule,
				entryPoint: "drawParticleGraphVertex",
			},
			fragment: {
				module: shaderModule,
				entryPoint: "drawParticleGraphFragment",
				targets: [{ format: colorFormat }],
			},
			depthStencil: {
				format: depthFormat,
				depthWriteEnabled: false,
				depthCompare: "greater",
			},
			primitive: {
				topology: "line-list",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					layouts.camera,
					layouts.readOnlyStorage,
					layouts.readOnlyStorage,
					layouts.readOnlyStorage,
				],
				label: "ParticleMeshifyPipeline drawParticleGraph",
			}),
			label: "ParticleMeshifyPipeline drawParticleGraph",
		});

		const groups = {
			camera: device.createBindGroup({
				entries: [
					{ binding: 0, resource: cameraUBO },
					{ binding: 1, resource: debugNeighborhoodBuffer.buffer },
				],
				layout: layouts.camera,
				label: "ParticleMeshifyPipeline camera",
			}),
			particlesRead: device.createBindGroup({
				entries: [{ binding: 0, resource: particles.particleBuffer }],
				layout: layouts.readOnlyStorage,
				label: "ParticleMeshifyPipeline particles read",
			}),
			particlesReadWrite: device.createBindGroup({
				entries: [{ binding: 0, resource: particles.particleBuffer }],
				layout: layouts.readWriteStorage,
				label: "ParticleMeshifyPipeline particles read-write",
			}),
			projectedGridRead: device.createBindGroup({
				entries: [{ binding: 0, resource: particles.projectedGrid }],
				layout: layouts.readOnlyStorage,
				label: "ParticleMeshifyPipeline projected_grid read",
			}),
			projectedGridReadWrite: device.createBindGroup({
				entries: [{ binding: 0, resource: particles.projectedGrid }],
				layout: layouts.readWriteStorage,
				label: "ParticleMeshifyPipeline projected_grid read-write",
			}),
			particleGraphRead: device.createBindGroup({
				entries: [
					{ binding: 0, resource: particles.particleGraphBuffer },
				],
				layout: layouts.readOnlyStorage,
				label: "ParticleMeshifyPipeline particle_graph read",
			}),
			particleGraphReadWrite: device.createBindGroup({
				entries: [
					{ binding: 0, resource: particles.particleGraphBuffer },
				],
				layout: layouts.readWriteStorage,
				label: "ParticleMeshifyPipeline particle_graph read-write",
			}),
			particleGraphPingPong: device.createBindGroup({
				entries: [
					{ binding: 0, resource: particles.particleGraphBuffer },
					{ binding: 1, resource: particles.particleGraphPongBuffer },
				],
				layout: layouts.storagePingPong,
				label: "ParticleMeshifyPipeline particle_graph ping-pong",
			}),
		};

		const gridPointQuadIndices = new Uint32Array([0, 1, 2, 0, 2, 3]);
		const gridPointQuadIndexBuffer = device.createBuffer({
			size: gridPointQuadIndices.byteLength,
			usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(
			gridPointQuadIndexBuffer,
			0,
			gridPointQuadIndices
		);

		const lineIndices = new Uint32Array([0, 1]);
		const lineIndexBuffer = device.createBuffer({
			size: lineIndices.byteLength,
			usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(lineIndexBuffer, 0, lineIndices);

		return {
			pipeline_render,
			pipeline_projectParticlesToGrid,
			pipeline_initGrid,
			pipeline_initParticleGraph,
			pipeline_computeGridNormals,
			pipeline_compactSurfaceParticles,
			pipeline_identifySurfaceParticles,
			pipeline_sortParticleGraphInitialChunks,
			pipeline_sortParticleGraphMerge,
			pipeline_compactParticleGraph,
			pipeline_drawParticleGraph,
			groups,
			gridPointQuadIndexBuffer,
			lineIndexBuffer,
		};
	},

	/**
	 * Expensive, call sparingly. Determines surface particles and builds their
	 * normals, then builds & sorts a graph from the union of the k-nearest
	 * neighborhoods.
	 *
	 * (the eventual goal is to implement a mesh reconstruction)
	 */
	computeMeshFromParticles: ({
		commandEncoder,
		pipeline,
	}: {
		commandEncoder: GPUCommandEncoder;
		pipeline: ParticleMeshifyPipeline;
	}): void => {
		const compute = commandEncoder.beginComputePass({
			label: "Sandstone populateVertexBuffer",
		});

		compute.setBindGroup(0, pipeline.groups.camera);

		compute.setBindGroup(1, pipeline.groups.particlesRead);
		compute.setBindGroup(2, pipeline.groups.projectedGridReadWrite);
		compute.setPipeline(pipeline.pipeline_initGrid);
		compute.dispatchWorkgroups(
			GRID_DIMENSION / 8,
			GRID_DIMENSION / 8,
			GRID_DIMENSION / 4
		);

		compute.setPipeline(pipeline.pipeline_projectParticlesToGrid);
		compute.dispatchWorkgroups(PARTICLE_COUNT / 256, 1, 1);

		compute.setBindGroup(1, pipeline.groups.particlesReadWrite);
		compute.setBindGroup(2, pipeline.groups.projectedGridRead);
		compute.setBindGroup(3, pipeline.groups.particleGraphReadWrite);

		compute.setPipeline(pipeline.pipeline_identifySurfaceParticles);
		compute.dispatchWorkgroups(PARTICLE_COUNT / 256, 1, 1);

		compute.setPipeline(pipeline.pipeline_compactSurfaceParticles);
		compute.dispatchWorkgroups(1, 1, 1);

		compute.setBindGroup(1, pipeline.groups.particlesRead);
		compute.setBindGroup(2, pipeline.groups.projectedGridRead);
		compute.setBindGroup(3, pipeline.groups.particleGraphPingPong);

		compute.setPipeline(pipeline.pipeline_initParticleGraph);
		compute.dispatchWorkgroups(
			(2 * PARTICLE_COUNT * NEIGHBORHOOD_SIZE) / 256,
			1,
			1
		);

		compute.setBindGroup(1, pipeline.groups.particlesReadWrite);
		compute.setBindGroup(2, pipeline.groups.projectedGridRead);
		compute.setBindGroup(3, pipeline.groups.particleGraphReadWrite);

		compute.setPipeline(pipeline.pipeline_computeGridNormals);
		compute.dispatchWorkgroups(PARTICLE_COUNT / 256, 1, 1);

		compute.setBindGroup(1, pipeline.groups.particlesRead);
		compute.setBindGroup(2, pipeline.groups.projectedGridRead);
		compute.setBindGroup(3, pipeline.groups.particleGraphReadWrite);

		compute.setPipeline(pipeline.pipeline_compactParticleGraph);
		compute.dispatchWorkgroups(1, 1, 1);

		compute.setBindGroup(1, pipeline.groups.particlesRead);
		compute.setBindGroup(2, pipeline.groups.projectedGridRead);
		compute.setBindGroup(3, pipeline.groups.particleGraphReadWrite);

		compute.setPipeline(pipeline.pipeline_sortParticleGraphInitialChunks);
		const potentialEdges = 2 * NEIGHBORHOOD_SIZE * 20000;
		const chunkCount = Math.floor((potentialEdges + 31) / 32);
		compute.dispatchWorkgroups(chunkCount / 256, 1, 1);

		compute.setBindGroup(1, pipeline.groups.particlesRead);
		compute.setBindGroup(2, pipeline.groups.projectedGridRead);
		compute.setBindGroup(3, pipeline.groups.particleGraphPingPong);
		compute.setPipeline(pipeline.pipeline_sortParticleGraphMerge);
		compute.dispatchWorkgroups(1, 1, 1);

		compute.end();
	},
	drawGrid: ({
		commandEncoder,
		color,
		depth,
		pipeline,
	}: {
		commandEncoder: GPUCommandEncoder;
		color: RenderOutputTexture;
		depth: RenderOutputTexture;
		pipeline: ParticleMeshifyPipeline;
	}): void => {
		const pass = commandEncoder.beginRenderPass({
			label: "Sandstone Render Pass",
			colorAttachments: [
				{
					loadOp: "load",
					storeOp: "store",
					view: color.view,
				},
			],
			depthStencilAttachment: {
				view: depth.view,
				depthStoreOp: "store",
				depthLoadOp: "load",
			},
		});

		pass.setPipeline(pipeline.pipeline_render);
		pass.setIndexBuffer(pipeline.gridPointQuadIndexBuffer, "uint32");
		pass.setBindGroup(0, pipeline.groups.camera);
		pass.setBindGroup(1, pipeline.groups.particlesRead);
		pass.setBindGroup(2, pipeline.groups.projectedGridRead);
		pass.drawIndexed(6, GRID_DIMENSION * GRID_DIMENSION * GRID_DIMENSION);

		pass.end();
	},
	drawParticleGraph: ({
		commandEncoder,
		color,
		depth,
		pipeline,
		particles,
	}: {
		commandEncoder: GPUCommandEncoder;
		color: RenderOutputTexture;
		depth: RenderOutputTexture;
		pipeline: ParticleMeshifyPipeline;
		particles: Particles;
	}): void => {
		const pass = commandEncoder.beginRenderPass({
			label: "Particle Graph",
			colorAttachments: [
				{
					loadOp: "load",
					storeOp: "store",
					view: color.view,
				},
			],
			depthStencilAttachment: {
				view: depth.view,
				depthStoreOp: "store",
				depthLoadOp: "load",
			},
		});

		pass.setPipeline(pipeline.pipeline_drawParticleGraph);
		pass.setIndexBuffer(pipeline.lineIndexBuffer, "uint32");
		pass.setBindGroup(0, pipeline.groups.camera);
		pass.setBindGroup(1, pipeline.groups.particlesRead);
		pass.setBindGroup(2, pipeline.groups.projectedGridRead);
		pass.setBindGroup(3, pipeline.groups.particleGraphRead);
		pass.drawIndexedIndirect(
			particles.particleGraphBuffer,
			SIZEOF.vec4_f32 + 12
		);

		pass.end();
	},
});
