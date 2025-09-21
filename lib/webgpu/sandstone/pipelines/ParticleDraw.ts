import { PARTICLE_COUNT, Particles } from "../Particles";
import ParticlesDebugPak from "../../../shaders/sandstone/particles_debug.wgsl";
import { RenderOutputTexture } from "../../sky-sea/RenderOutputController";
import { SIZEOF } from "../Sizeof";

// Particle radius is purely for debug purposes, the particles have no size in
// the physics model.
const PARTICLE_RADIUS = 0.2;

// Capable of drawing particles as spheres
interface ParticleDrawPipeline {
	pipeline_populateVertexBuffer: GPUComputePipeline;
	pipeline_renderParticles: GPURenderPipeline;
	pipeline_renderNormals: GPURenderPipeline;
	pipeline_renderTangentPlanes: GPURenderPipeline;
	group0: GPUBindGroup;
	group1Render: GPUBindGroup;
	group1Compute: GPUBindGroup;
	quadIndexBuffer: GPUBuffer;
	lineIndexBuffer: GPUBuffer;
	configUBO: GPUBuffer;
	/**
	 * Settings that can be modified externally and will be read at draw time.
	 */
	settings: {
		drawSurfaceOnly: boolean;
		drawStyle: ParticleDrawPipelineDrawStyle;
		debugParticleIdx: number;
	};
}

export const ParticleDrawPipelineDrawStyle = [
	"Spheres",
	"Spheres with Normals",
	"Tangent Planes",
] as const;
export type ParticleDrawPipelineDrawStyle =
	(typeof ParticleDrawPipelineDrawStyle)[number];

export const ParticleDrawPipeline = Object.freeze({
	build: ({
		device,
		colorFormat,
		depthFormat,
		particles,
		cameraUBO,
	}: {
		device: GPUDevice;
		colorFormat: GPUTextureFormat;
		depthFormat: GPUTextureFormat;
		particles: Particles;
		cameraUBO: GPUBuffer;
	}): ParticleDrawPipeline => {
		const configUBO = device.createBuffer({
			size: 3 * SIZEOF.u32,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: "ParticleDrawPipeline configUBO",
		});

		const group0Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
					buffer: { type: "read-only-storage" },
				},
				{
					binding: 1,
					visibility:
						GPUShaderStage.VERTEX |
						GPUShaderStage.COMPUTE |
						GPUShaderStage.FRAGMENT,
					buffer: { type: "uniform" },
				},
				{
					binding: 2,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					buffer: { type: "uniform" },
				},
			],
			label: `ParticleDebugPipeline Group0`,
		});
		const group1LayoutCompute = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "storage" },
				},
			],
		});
		const group1LayoutRender = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX,
					buffer: { type: "read-only-storage" },
				},
			],
		});

		const shaderModule = device.createShaderModule({
			code: ParticlesDebugPak,
			label: "ParticleDebugPipeline ParticlesDebugPak",
		});
		const pipeline_renderParticles = device.createRenderPipeline({
			vertex: { module: shaderModule, entryPoint: "drawParticlesVertex" },
			fragment: {
				targets: [{ format: colorFormat }],
				module: shaderModule,
				constants: {
					PARTICLE_RADIUS_SQUARED: PARTICLE_RADIUS * PARTICLE_RADIUS,
				},
				entryPoint: "drawParticlesFragment",
			},
			depthStencil: {
				format: depthFormat,
				depthWriteEnabled: true,
				depthCompare: "greater",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [group0Layout, group1LayoutRender],
				label: "ParticleDebugPipeline pipeline_render",
			}),
			label: "ParticleDebugPipeline pipeline_render",
		});
		const pipeline_populateVertexBuffer = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "populateVertexBuffer",
				constants: {
					PARTICLE_RADIUS_SQUARED: PARTICLE_RADIUS * PARTICLE_RADIUS,
				},
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [group0Layout, group1LayoutCompute],
				label: "ParticleDebugPipeline compute",
			}),
			label: "ParticleDebugPipeline compute",
		});
		const pipeline_renderNormals = device.createRenderPipeline({
			fragment: {
				module: shaderModule,
				entryPoint: "drawNormalsFragment",
				targets: [{ format: colorFormat }],
			},
			vertex: {
				module: shaderModule,
				entryPoint: "drawNormalsVertex",
			},
			depthStencil: {
				format: depthFormat,
				depthWriteEnabled: true,
				depthCompare: "greater",
			},
			primitive: { topology: "line-list" },
			layout: device.createPipelineLayout({
				bindGroupLayouts: [group0Layout, group1LayoutRender],
				label: "ParticleDebugPipeline pipeline_renderNormals",
			}),
			label: "ParticleDebugPipeline pipeline_renderNormals",
		});
		const pipeline_renderTangentPlanes = device.createRenderPipeline({
			fragment: {
				module: shaderModule,
				targets: [{ format: colorFormat }],
				entryPoint: "drawTangentPlanesFragment",
			},
			vertex: {
				module: shaderModule,
				entryPoint: "drawTangentPlanesVertex",
			},
			depthStencil: {
				format: depthFormat,
				depthWriteEnabled: true,
				depthCompare: "greater",
			},
			primitive: {
				topology: "triangle-list",
				cullMode: "none",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [group0Layout, group1LayoutRender],
				label: "ParticleDebugPipeline pipeline_renderTangentPlanes",
			}),
			label: "ParticleDebugPipeline pipeline_renderTangentPlanes",
		});

		const group0 = device.createBindGroup({
			entries: [
				{ binding: 0, resource: particles.particleBuffer },
				{ binding: 1, resource: cameraUBO },
				{ binding: 2, resource: configUBO },
			],
			layout: pipeline_renderParticles.getBindGroupLayout(0),
			label: "ParticleDebugPipeline 0",
		});
		const group1Render = device.createBindGroup({
			entries: [{ binding: 0, resource: particles.vertices }],
			layout: pipeline_renderParticles.getBindGroupLayout(1),
			label: "ParticleDebugPipeline render 1",
		});
		const group1Compute = device.createBindGroup({
			entries: [{ binding: 0, resource: particles.vertices }],
			layout: pipeline_populateVertexBuffer.getBindGroupLayout(1),
			label: "ParticleDebugPipeline compute 1",
		});

		const quadIndices = new Uint32Array([0, 1, 2, 0, 2, 3]);
		const quadIndexBuffer = device.createBuffer({
			size: quadIndices.byteLength,
			usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(quadIndexBuffer, 0, quadIndices);

		const lineIndices = new Uint32Array([0, 1]);
		const lineIndexBuffer = device.createBuffer({
			size: lineIndices.byteLength,
			usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(lineIndexBuffer, 0, lineIndices);

		return {
			pipeline_renderParticles,
			pipeline_renderNormals,
			pipeline_populateVertexBuffer,
			pipeline_renderTangentPlanes,
			group0,
			group1Render,
			group1Compute,
			quadIndexBuffer,
			lineIndexBuffer,
			configUBO,
			settings: {
				drawStyle: "Spheres",
				drawSurfaceOnly: true,
				debugParticleIdx: 0,
			},
		};
	},
	draw: ({
		commandEncoder,
		queue,
		color,
		depth,
		pipeline,
		surfaceParticlesCount,
	}: {
		commandEncoder: GPUCommandEncoder;
		queue: GPUQueue;
		color: RenderOutputTexture;
		depth: RenderOutputTexture;
		pipeline: ParticleDrawPipeline;
		surfaceParticlesCount: number;
	}): void => {
		const drawNormals =
			pipeline.settings.drawStyle == "Spheres with Normals";
		queue.writeBuffer(
			pipeline.configUBO,
			0,
			new Uint32Array([
				pipeline.settings.drawSurfaceOnly ? 1 : 0,
				drawNormals ? 1 : 0,
				pipeline.settings.debugParticleIdx,
			])
		);

		const compute = commandEncoder.beginComputePass({
			label: "Sandstone populateVertexBuffer",
		});

		compute.setPipeline(pipeline.pipeline_populateVertexBuffer);
		compute.setBindGroup(0, pipeline.group0);
		compute.setBindGroup(1, pipeline.group1Compute);
		compute.dispatchWorkgroups(PARTICLE_COUNT / 256, 1, 1);

		compute.end();

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
				depthLoadOp: "load",
				depthStoreOp: "store",
			},
		});

		pass.setBindGroup(0, pipeline.group0);
		pass.setBindGroup(1, pipeline.group1Render);

		switch (pipeline.settings.drawStyle) {
			case "Spheres": {
				pass.setIndexBuffer(pipeline.quadIndexBuffer, "uint32");
				pass.setPipeline(pipeline.pipeline_renderParticles);
				pass.drawIndexed(6, PARTICLE_COUNT);
				break;
			}
			case "Spheres with Normals": {
				pass.setIndexBuffer(pipeline.quadIndexBuffer, "uint32");
				pass.setPipeline(pipeline.pipeline_renderParticles);
				pass.drawIndexed(6, PARTICLE_COUNT);

				pass.setIndexBuffer(pipeline.lineIndexBuffer, "uint32");
				pass.setPipeline(pipeline.pipeline_renderNormals);
				pass.drawIndexed(2, PARTICLE_COUNT);
				break;
			}
			case "Tangent Planes": {
				pass.setIndexBuffer(pipeline.quadIndexBuffer, "uint32");
				pass.setPipeline(pipeline.pipeline_renderTangentPlanes);
				pass.drawIndexed(6, surfaceParticlesCount);
				break;
			}
		}

		pass.end();
	},
});
