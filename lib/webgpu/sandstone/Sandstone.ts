import { RendererApp, RendererAppConstructor } from "../RendererApp";
import ParticlesDebugPak from "../../shaders/sandstone/particles_debug.wgsl";
import { FullscreenQuadPassResources } from "../sky-sea/FullscreenQuad";
import { RenderOutputTexture } from "../sky-sea/RenderOutputController";
import { UBO } from "../sky-sea/util/UBO";
import { mat4, vec4 } from "wgpu-matrix";

interface Extent2D {
	width: number;
	height: number;
}

interface OutputColorResources {
	texture: RenderOutputTexture;
	destroy: () => void;
}

const FORMAT = "rgba16float";

const buildOutputColorResources = (
	device: GPUDevice,
	resolution: Extent2D,
	label: string
): OutputColorResources => {
	const texture = device.createTexture({
		size: resolution,
		format: FORMAT,
		usage:
			GPUTextureUsage.STORAGE_BINDING |
			GPUTextureUsage.TEXTURE_BINDING |
			GPUTextureUsage.RENDER_ATTACHMENT,
		label: `${label} OutputColorResources.texture`,
	});

	return {
		texture: new RenderOutputTexture(texture),
		destroy: (): void => {
			texture.destroy();
		},
	};
};

interface CameraParameters {
	translationX: number;
	translationY: number;
	translationZ: number;
	// Applied in order Y * X * Z
	// Z first, X second, Y third
	eulerAnglesX: number;
	eulerAnglesY: number;
	eulerAnglesZ: number;
	// Needs to be updated each frame
	aspectRatio: number;
}
class CameraUBO extends UBO {
	/**
	 * The data that will be packed and laid out in proper byte order in
	 * {@link packed}, to be written to the GPU.
	 */
	public readonly data: CameraParameters = {
		translationX: 0,
		translationY: 0,
		translationZ: 0,
		eulerAnglesX: 0,
		eulerAnglesY: 0,
		eulerAnglesZ: 0,
		aspectRatio: 1,
	};

	constructor(device: GPUDevice) {
		const SIZEOF_CAMERA_UBO = 256;
		const BYTES_PER_FLOAT32 = 4;
		super(device, SIZEOF_CAMERA_UBO / BYTES_PER_FLOAT32, "Camera UBO");
	}

	protected override packed(): Float32Array {
		const vec3_zeroed = new Float32Array(3).fill(0.0);
		const mat2x4_zeroed = new Float32Array(4 * 2).fill(0.0);

		const position = [
			this.data.translationX,
			this.data.translationY,
			this.data.translationZ,
			1,
		];
		const rotationX = mat4.rotationX(this.data.eulerAnglesX);
		const rotationY = mat4.rotationY(this.data.eulerAnglesY);
		const rotationZ = mat4.rotationZ(this.data.eulerAnglesZ);

		const transform = mat4.mul(
			mat4.translation(vec4.create(...position)),
			mat4.mul(rotationY, mat4.mul(rotationX, rotationZ))
		);
		const view = mat4.inverse(transform);
		const fov = (60 * Math.PI) / 180;
		const near = 0.1;
		const far = 1000;

		const proj = mat4.perspective(fov, this.data.aspectRatio, near, far);
		const projView = mat4.mul(proj, view);
		const focalLength = 1.0;

		return new Float32Array([
			...view,
			...projView,
			...position,
			...vec3_zeroed,
			focalLength,
			...mat2x4_zeroed,
			...proj,
		]);
	}
}

export const SandstoneAppConstructor: RendererAppConstructor = (
	device,
	_presentFormat
): RendererApp => {
	const group0Layout = device.createBindGroupLayout({
		entries: [
			{
				binding: 0,
				visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
				buffer: { type: "read-only-storage" },
			},
			{
				binding: 1,
				visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
				buffer: { type: "uniform" },
			},
		],
		label: `Sandstone Group0`,
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
		label: "Sandstone ParticlesDebugPak",
	});
	const pipeline_render = device.createRenderPipeline({
		vertex: { module: shaderModule, entryPoint: "vertexMain" },
		fragment: {
			targets: [{ format: "rgba16float" }],
			module: shaderModule,
			entryPoint: "fragmentMain",
		},
		primitive: { cullMode: "none" },
		layout: device.createPipelineLayout({
			bindGroupLayouts: [group0Layout, group1LayoutRender],
			label: "Sandstone render",
		}),
		label: "Sandstone render",
	});
	const pipeline_populateVertexBuffer = device.createComputePipeline({
		compute: { module: shaderModule, entryPoint: "populateVertexBuffer" },
		layout: device.createPipelineLayout({
			bindGroupLayouts: [group0Layout, group1LayoutCompute],
			label: "Sandstone compute",
		}),
		label: "Sandstone compute",
	});

	const resolution = { width: 128.0, height: 128.0 };
	const outputColor = buildOutputColorResources(
		device,
		resolution,
		"Sandstone"
	);

	const particles = new Float32Array([
		-4, -2, -5, 0, 0, 0, -5, 0, 0, 1, -5, 0, 2, 2, -5, 0,
	]);
	const particleBuffer = device.createBuffer({
		usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
		size: particles.byteLength,
		label: "Sandstone Particles",
	});
	device.queue.writeBuffer(particleBuffer, 0, particles);

	const cameraUBO = new CameraUBO(device);
	cameraUBO.writeToGPU(device.queue);

	const debugBufferDst = device.createBuffer({
		size: 16 * 4 * 20,
		usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
	});
	const debugBufferSrc = device.createBuffer({
		size: debugBufferDst.size,
		usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.STORAGE,
	});

	const group0 = device.createBindGroup({
		entries: [
			{ binding: 0, resource: particleBuffer },
			{ binding: 1, resource: cameraUBO.buffer },
		],
		layout: pipeline_render.getBindGroupLayout(0),
		label: "Sandstone 0",
	});
	const group1Render = device.createBindGroup({
		entries: [{ binding: 0, resource: debugBufferSrc }],
		layout: pipeline_render.getBindGroupLayout(1),
		label: "Sandstone render 1",
	});
	const group1Compute = device.createBindGroup({
		entries: [{ binding: 0, resource: debugBufferSrc }],
		layout: pipeline_populateVertexBuffer.getBindGroupLayout(1),
		label: "Sandstone compute 1",
	});

	const particleQuadIndices = new Uint32Array([0, 1, 2, 0, 2, 3]);
	const particleQuadIndexBuffer = device.createBuffer({
		size: particleQuadIndices.byteLength,
		usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(particleQuadIndexBuffer, 0, particleQuadIndices);

	const permanentResources = {
		shaderModule,
		pipeline_render,
		pipeline_populateVertexBuffer,
		particleQuadIndexBuffer,
		fullscreenQuad: new FullscreenQuadPassResources(device, FORMAT),
		particleBuffer,
		cameraUBO,
		group0,
		group1Render,
		group1Compute,
		debugBufferDst,
		debugBufferSrc,
	};

	const transientResources = {
		outputColor,
	};
	let trashcan: { frame: number; destroy: () => void }[] = [];
	let frame = 0;

	const handleResize = (newWidth: number, newHeight: number): void => {
		if (resolution.width === newWidth && resolution.height === newHeight) {
			return;
		}

		resolution.width = newWidth;
		resolution.height = newHeight;

		trashcan.push({
			frame,
			destroy: transientResources.outputColor.destroy,
		});
		const outputColor = buildOutputColorResources(
			device,
			resolution,
			`Sandstone frame:${frame}`
		);

		transientResources.outputColor = outputColor;
		permanentResources.fullscreenQuad.setOutput(
			device,
			"Scene",
			outputColor.texture
		);
	};

	let done = false;
	const draw = (presentTexture: GPUTexture): void => {
		cameraUBO.data.aspectRatio =
			presentTexture.width / presentTexture.height;
		cameraUBO.writeToGPU(device.queue);

		const main = device.createCommandEncoder({
			label: "Sandstone Main",
		});

		const compute = main.beginComputePass({
			label: "Sandstone populateVertexBuffer",
		});
		compute.setPipeline(permanentResources.pipeline_populateVertexBuffer);
		compute.setBindGroup(0, permanentResources.group0);
		compute.setBindGroup(1, permanentResources.group1Compute);
		compute.dispatchWorkgroups(1, 1, 1);

		compute.end();

		const pass = main.beginRenderPass({
			label: "Sandstone Render Pass",
			colorAttachments: [
				{
					loadOp: "clear",
					storeOp: "store",
					view: transientResources.outputColor.texture.view,
					clearValue: { r: 0.0, g: 0.0, b: 0.2, a: 1.0 },
				},
			],
		});

		pass.setPipeline(permanentResources.pipeline_render);
		pass.setIndexBuffer(
			permanentResources.particleQuadIndexBuffer,
			"uint32"
		);
		pass.setBindGroup(0, permanentResources.group0);
		pass.setBindGroup(1, permanentResources.group1Render);
		pass.drawIndexed(6, 4);

		pass.end();

		permanentResources.fullscreenQuad.record(
			device,
			main,
			presentTexture.createView(),
			"Scene",
			{
				arrayLayer: 0,
				channelMasks: { r: true, g: true, b: true },
				colorGain: { r: 1.0, g: 1.0, b: 1.0 },
				flip: false,
				mipLevel: 0,
				swapBARG: false,
			}
		);

		let copying = false;
		if (permanentResources.debugBufferDst.mapState === "unmapped") {
			copying = true;
			main.copyBufferToBuffer(
				permanentResources.debugBufferSrc,
				permanentResources.debugBufferDst
			);
		}

		const latestFinishedFrame = frame;
		device.queue.submit([main.finish()]);
		device.queue
			.onSubmittedWorkDone()
			.then(() => {
				const busy =
					!copying ||
					permanentResources.debugBufferDst.mapState !== "unmapped";
				if (busy || done) {
					return;
				}

				done = true;
				permanentResources.debugBufferDst
					.mapAsync(GPUMapMode.READ)
					.then(() => {
						const floats = new Float32Array(
							permanentResources.debugBufferDst.getMappedRange()
						);
						const log = (first: number): string => {
							return `vert (${floats[first]},${
								floats[first + 1]
							},${floats[first + 2]},${floats[first + 3]})`;
						};
						for (let particle = 0; particle < 4; particle += 1) {
							const firstIdx = particle * 16;
							const stride = 4;
							let str = "particle \n";
							str += log(firstIdx) + "\n";
							str += log(firstIdx + stride) + "\n";
							str += log(firstIdx + 2 * stride) + "\n";
							str += log(firstIdx + 3 * stride) + "\n";
							console.log(str);
						}
						permanentResources.debugBufferDst.unmap();
					})
					.catch((reason) => {
						console.error(reason);
					});
			})
			.then(() => {
				const newTrashcan = [];
				for (const trash of trashcan) {
					if (trash.frame >= latestFinishedFrame) {
						newTrashcan.push(trash);
						continue;
					}

					trash.destroy();
				}
				trashcan = newTrashcan;
			})
			.catch((reason) => {
				console.error(reason);
			});

		frame = frame + 1;
	};

	const destroy = (): void => {
		transientResources.outputColor.destroy();
		device.destroy();
	};

	return {
		quit: false,
		presentationInterface: () => ({ device, format: FORMAT }),
		draw,
		destroy,
		handleResize,
	};
};
