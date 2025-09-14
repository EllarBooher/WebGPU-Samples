import { RendererApp, RendererAppConstructor } from "../RendererApp";
import { GUI as LilGUI } from "lil-gui";
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
	color: RenderOutputTexture;
	depth: RenderOutputTexture;
	destroy: () => void;
}

const COLOR_FORMAT: GPUTextureFormat = "rgba16float";
const DEPTH_FORMAT: GPUTextureFormat = "depth32float";
const PARTICLE_RADIUS = 0.1;
const PARTICLE_COUNT = 16 * 16 * 16;

const buildOutputColorResources = (
	device: GPUDevice,
	resolution: Extent2D,
	label: string
): OutputColorResources => {
	const texture = device.createTexture({
		size: resolution,
		format: COLOR_FORMAT,
		usage:
			GPUTextureUsage.STORAGE_BINDING |
			GPUTextureUsage.TEXTURE_BINDING |
			GPUTextureUsage.RENDER_ATTACHMENT,
		label: `${label} OutputColorResources.color`,
	});
	const depth = device.createTexture({
		size: resolution,
		format: DEPTH_FORMAT,
		usage:
			GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
		label: `${label} OutputColorResources.depth`,
	});

	return {
		color: new RenderOutputTexture(texture),
		depth: new RenderOutputTexture(depth),
		destroy: (): void => {
			texture.destroy();
			depth.destroy();
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
		translationX: 1.6,
		translationY: 1.6,
		translationZ: 6,
		eulerAnglesX: 0,
		eulerAnglesY: 0,
		eulerAnglesZ: 0,
		aspectRatio: 1,
	};

	constructor(device: GPUDevice) {
		const SIZEOF_CAMERA_UBO = 5 * 64;
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
		const far = 0.1;
		const near = 1000;

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
			...transform,
		]);
	}
}

interface Particles {
	// Centers of particles in world space
	centers: GPUBuffer;
	// Each particle has 4 vertices, for the quad when rendering a debug view
	vertices: GPUBuffer;
	// The small grid we project to when converting to a mesh
	projectedGrid: GPUBuffer;
}

const buildParticles = (device: GPUDevice): Particles => {
	const particles = new Float32Array(PARTICLE_COUNT * 4);
	for (let x = 0; x < 16; x++) {
		for (let y = 0; y < 16; y++) {
			for (let z = 0; z < 16; z++) {
				const particleIdx = x * 16 * 16 + y * 16 + z;
				particles[4 * particleIdx] =
					x * PARTICLE_RADIUS * 2.0 +
					0.5 * Math.random() * PARTICLE_RADIUS;
				particles[4 * particleIdx + 1] =
					y * PARTICLE_RADIUS * 2.0 +
					0.5 * Math.random() * PARTICLE_RADIUS;
				particles[4 * particleIdx + 2] =
					z * PARTICLE_RADIUS * 2.0 +
					0.5 * Math.random() * PARTICLE_RADIUS;
				particles[4 * particleIdx + 3] = 1;
			}
		}
	}

	const centers = device.createBuffer({
		usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
		size: particles.byteLength,
		label: "Sandstone Particles",
	});
	device.queue.writeBuffer(centers, 0, particles);

	const vertices = device.createBuffer({
		size: 16 * 4 * PARTICLE_COUNT,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
	});

	const projectedGrid = device.createBuffer({
		size: 16 * GRID_DIMENSION * GRID_DIMENSION * GRID_DIMENSION,
		usage: GPUBufferUsage.STORAGE,
	});

	return { centers, vertices, projectedGrid };
};

// Capable of drawing particles as spheres
interface ParticleDebugPipeline {
	pipeline_populateVertexBuffer: GPUComputePipeline;
	pipeline_render: GPURenderPipeline;
	group0: GPUBindGroup;
	group1Render: GPUBindGroup;
	group1Compute: GPUBindGroup;
	particleQuadIndexBuffer: GPUBuffer;
}
const buildParticleDebugPipeline = (
	device: GPUDevice,
	particles: Particles,
	cameraUBO: CameraUBO
): ParticleDebugPipeline => {
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
	const pipeline_render = device.createRenderPipeline({
		vertex: { module: shaderModule, entryPoint: "vertexMain" },
		fragment: {
			targets: [{ format: "rgba16float" }],
			module: shaderModule,
			constants: {
				PARTICLE_RADIUS_SQUARED: PARTICLE_RADIUS * PARTICLE_RADIUS,
			},
			entryPoint: "fragmentMain",
		},
		depthStencil: {
			format: DEPTH_FORMAT,
			depthWriteEnabled: true,
			depthCompare: "greater",
		},
		primitive: { cullMode: "none" },
		layout: device.createPipelineLayout({
			bindGroupLayouts: [group0Layout, group1LayoutRender],
			label: "ParticleDebugPipeline render",
		}),
		label: "ParticleDebugPipeline render",
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

	const group0 = device.createBindGroup({
		entries: [
			{ binding: 0, resource: particles.centers },
			{ binding: 1, resource: cameraUBO.buffer },
		],
		layout: pipeline_render.getBindGroupLayout(0),
		label: "ParticleDebugPipeline 0",
	});
	const group1Render = device.createBindGroup({
		entries: [{ binding: 0, resource: particles.vertices }],
		layout: pipeline_render.getBindGroupLayout(1),
		label: "ParticleDebugPipeline render 1",
	});
	const group1Compute = device.createBindGroup({
		entries: [{ binding: 0, resource: particles.vertices }],
		layout: pipeline_populateVertexBuffer.getBindGroupLayout(1),
		label: "ParticleDebugPipeline compute 1",
	});

	const particleQuadIndices = new Uint32Array([0, 1, 2, 0, 2, 3]);
	const particleQuadIndexBuffer = device.createBuffer({
		size: particleQuadIndices.byteLength,
		usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(particleQuadIndexBuffer, 0, particleQuadIndices);

	return {
		pipeline_render,
		pipeline_populateVertexBuffer,
		group0,
		group1Render,
		group1Compute,
		particleQuadIndexBuffer,
	};
};

const drawParticleDebugPipeline = ({
	commandEncoder,
	color,
	depth,
	pipeline,
}: {
	commandEncoder: GPUCommandEncoder;
	color: RenderOutputTexture;
	depth: RenderOutputTexture;
	pipeline: ParticleDebugPipeline;
}): void => {
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
				loadOp: "clear",
				storeOp: "store",
				view: color.view,
				clearValue: { r: 0.0, g: 0.0, b: 0.2, a: 1.0 },
			},
		],
		depthStencilAttachment: {
			view: depth.view,
			depthStoreOp: "store",
			depthLoadOp: "clear",
			depthClearValue: 0.0,
		},
	});

	pass.setPipeline(pipeline.pipeline_render);
	pass.setIndexBuffer(pipeline.particleQuadIndexBuffer, "uint32");
	pass.setBindGroup(0, pipeline.group0);
	pass.setBindGroup(1, pipeline.group1Render);
	pass.drawIndexed(6, PARTICLE_COUNT);

	pass.end();
};

export const SandstoneAppConstructor: RendererAppConstructor = (
	device,
	_presentFormat
): RendererApp => {
	const resolution = { width: 128.0, height: 128.0 };
	const outputColor = buildOutputColorResources(
		device,
		resolution,
		"Sandstone"
	);

	const cameraUBO = new CameraUBO(device);
	cameraUBO.writeToGPU(device.queue);

	const pipelineParameters = {
		debugParticles: false,
	};

	const particles = buildParticles(device);

	const particleDebugPipeline = buildParticleDebugPipeline(
		device,
		particles,
		cameraUBO
	);

	const debugBufferDst = device.createBuffer({
		size: particles.vertices.size,
		usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
	});

	const permanentResources = {
		particleDebugPipeline,
		fullscreenQuad: new FullscreenQuadPassResources(device, COLOR_FORMAT),
		cameraUBO,
		debugBufferDst,
		particles,
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
			outputColor.color
		);
	};

	let done = false;
	const setupUI = (gui: LilGUI): void => {
		const cameraParameters = gui.addFolder("Camera").open();
		cameraParameters
			.add(cameraUBO.data, "translationX")
			.name("Camera X")
			.min(-10.0)
			.max(10.0);
		cameraParameters
			.add(cameraUBO.data, "translationY")
			.name("Camera Y")
			.min(-10.0)
			.max(10.0);
		cameraParameters
			.add(cameraUBO.data, "translationZ")
			.name("Camera Z")
			.min(-10.0)
			.max(10.0);

		const EULER_ANGLES_X_SAFETY_MARGIN = 0.01;
		cameraParameters
			.add(cameraUBO.data, "eulerAnglesX")
			.name("Camera Pitch")
			.min(-Math.PI / 2.0 + EULER_ANGLES_X_SAFETY_MARGIN)
			.max(Math.PI / 2.0 - EULER_ANGLES_X_SAFETY_MARGIN);
		cameraParameters
			.add(cameraUBO.data, "eulerAnglesY")
			.name("Camera Yaw")
			.min(-Math.PI)
			.max(Math.PI);

		const pipeline = gui.addFolder("Pipeline").open();
		pipeline
			.add(pipelineParameters, "debugParticles")
			.name("Debug Particles");
	};

	const draw = (presentTexture: GPUTexture): void => {
		cameraUBO.data.aspectRatio =
			presentTexture.width / presentTexture.height;
		cameraUBO.writeToGPU(device.queue);

		const main = device.createCommandEncoder({
			label: "Sandstone Main",
		});

		if (pipelineParameters.debugParticles) {
			drawParticleDebugPipeline({
				commandEncoder: main,
				color: transientResources.outputColor.color,
				depth: transientResources.outputColor.depth,
				pipeline: permanentResources.particleDebugPipeline,
			});
		} else {
			main.beginRenderPass({
				colorAttachments: [
					{
						view: transientResources.outputColor.color.view,
						loadOp: "clear",
						storeOp: "store",
						clearValue: { r: 0.4, g: 0.6, b: 0.9, a: 0 },
					},
				],
			}).end();
		}

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
				permanentResources.particles.vertices,
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
		presentationInterface: () => ({ device, format: COLOR_FORMAT }),
		draw,
		setupUI,
		destroy,
		handleResize,
	};
};
