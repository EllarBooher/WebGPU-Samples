import WorldAxisPak from "../../shaders/sandstone/world_axis.wgsl";
import { RenderOutputTexture } from "../sky-sea/RenderOutputController";
import { CameraUBO } from "./Camera";
import { SIZEOF } from "./Sizeof";

const COUNT_AXES = 6;
const COUNT_VERTICES_PER_AXIS = 2;

export interface WorldAxesPipeline {
	pipeline_render: GPURenderPipeline;
	group0: GPUBindGroup;
	lineSegmentIndexBuffer: GPUBuffer;
}
export const WorldAxesPipeline = Object.freeze({
	build: ({
		device,
		cameraUBO,
		colorFormat,
		depthFormat,
	}: {
		device: GPUDevice;
		cameraUBO: CameraUBO;
		colorFormat: GPUTextureFormat;
		depthFormat: GPUTextureFormat;
	}): WorldAxesPipeline => {
		const label = "WorldAxesPipeline";
		const module = device.createShaderModule({ label, code: WorldAxisPak });
		const pipeline_render = device.createRenderPipeline({
			label,
			layout: device.createPipelineLayout({
				label,
				bindGroupLayouts: [
					device.createBindGroupLayout({
						label,
						entries: [
							{
								binding: 0,
								visibility: GPUShaderStage.VERTEX,
								buffer: { type: "uniform" },
							},
						],
					}),
				],
			}),
			vertex: { module, entryPoint: "drawWorldAxesVertex" },
			primitive: { topology: "line-list", cullMode: "none" },
			fragment: {
				module,
				entryPoint: "drawWorldAxesFragment",
				targets: [{ format: colorFormat }],
			},
			depthStencil: {
				format: depthFormat,
				depthWriteEnabled: true,
				depthCompare: "greater",
			},
		});

		const group0 = device.createBindGroup({
			label,
			entries: [{ binding: 0, resource: { buffer: cameraUBO.buffer } }],
			layout: pipeline_render.getBindGroupLayout(0),
		});

		const lineSegmentIndexBuffer = device.createBuffer({
			label,
			size: COUNT_VERTICES_PER_AXIS * SIZEOF.u32,
			usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(
			lineSegmentIndexBuffer,
			0,
			new Uint32Array([0, 1])
		);

		return {
			pipeline_render,
			group0,
			lineSegmentIndexBuffer,
		};
	},
	draw: ({
		commandEncoder,
		color,
		depth,
		pipeline,
	}: {
		commandEncoder: GPUCommandEncoder;
		color: RenderOutputTexture;
		depth: RenderOutputTexture;
		pipeline: WorldAxesPipeline;
	}): void => {
		const pass = commandEncoder.beginRenderPass({
			colorAttachments: [
				{ loadOp: "load", storeOp: "store", view: color.view },
			],
			depthStencilAttachment: {
				depthLoadOp: "load",
				depthStoreOp: "store",
				view: depth.view,
			},
		});
		pass.setBindGroup(0, pipeline.group0);
		pass.setIndexBuffer(pipeline.lineSegmentIndexBuffer, "uint32");
		pass.setPipeline(pipeline.pipeline_render);
		pass.drawIndexed(COUNT_VERTICES_PER_AXIS, COUNT_AXES);

		pass.end();
	},
});
