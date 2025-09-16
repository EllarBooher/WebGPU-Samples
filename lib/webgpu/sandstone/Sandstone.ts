import { RendererApp, RendererAppConstructor } from "../RendererApp";
import { GUI as LilGUI } from "lil-gui";
import ParticlesDebugPak from "../../shaders/sandstone/particles_debug.wgsl";
import ParticleMeshifyPak from "../../shaders/sandstone/particles_meshify.wgsl";
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
// Particle radius is purely for debug purposes, the particles have no size in the model.
const PARTICLE_RADIUS = 0.1;
const PARTICLE_GAP = 0.2;
const PARTICLE_COUNT = 64 * 64 * 64;
const GRID_DIMENSION = 64;
const EULER_ANGLES_X_SAFETY_MARGIN = 0.01;
const CAMERA_PARAMETER_BOUNDS = {
	distanceFromOrigin: [0.0, 100.0],
	eulerAnglesX: [
		-Math.PI / 2.0 + EULER_ANGLES_X_SAFETY_MARGIN,
		Math.PI / 2.0 - EULER_ANGLES_X_SAFETY_MARGIN,
	],
	eulerAnglesY: [-Math.PI, Math.PI],
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const buildSizeOf = () => {
	const f32 = 4;
	const vec4_f32 = 16;
	const mat3x3_f32 = 48;
	const particle = 2 * vec4_f32;
	const grid_point = vec4_f32;

	return {
		f32,
		vec4_f32,
		mat3x3_f32,
		particle,
		grid_point,
	};
};

const SIZEOF = Object.freeze(buildSizeOf());

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
	// Applied in order Y * X
	// X first, Y second
	eulerAnglesX: number;
	eulerAnglesY: number;
	distanceFromOrigin: number;
	// Needs to be updated each frame
	aspectRatio: number;
}
class CameraUBO extends UBO {
	/**
	 * The data that will be packed and laid out in proper byte order in
	 * {@link packed}, to be written to the GPU.
	 */
	public readonly data: CameraParameters = {
		eulerAnglesX: 0,
		eulerAnglesY: 0,
		distanceFromOrigin: 30.0,
		aspectRatio: 1,
	};

	constructor(device: GPUDevice) {
		const SIZEOF_CAMERA_UBO = 5 * 64;
		const BYTES_PER_FLOAT32 = 4;
		super(device, SIZEOF_CAMERA_UBO / BYTES_PER_FLOAT32, "Camera UBO");
	}

	protected override packed(): Float32Array {
		const vec2_zeroed = new Float32Array(2).fill(0.0);
		const mat2x4_zeroed = new Float32Array(4 * 2).fill(0.0);

		const rotationX = mat4.rotationX(this.data.eulerAnglesX);
		const rotationY = mat4.rotationY(this.data.eulerAnglesY);
		const rotation = mat4.mul(rotationY, rotationX);

		const position = vec4.add(
			vec4.transformMat4(
				vec4.create(0.0, 0.0, this.data.distanceFromOrigin, 1.0),
				rotation
			),
			vec4.create(6.4, 6.4, 6.4, 0.0)
		);

		const transform = mat4.mul(
			mat4.translation(vec4.create(...position)),
			mat4.mul(rotationY, rotationX)
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
			...vec2_zeroed,
			this.data.aspectRatio,
			focalLength,
			...mat2x4_zeroed,
			...proj,
			...transform,
		]);
	}
}

interface ParticlesDebugConfig {
	hideNonSurface: boolean;
}
class ParticlesDebugConfigUBO extends UBO {
	public readonly data: ParticlesDebugConfig = {
		hideNonSurface: false,
	};

	constructor(device: GPUDevice) {
		const SIZEOF = 4;
		const BYTES_PER_FLOAT32 = 4;
		super(device, SIZEOF / BYTES_PER_FLOAT32, "Camera UBO");
	}

	protected override packed(): Uint32Array {
		return new Uint32Array([this.data.hideNonSurface ? 1 : 0]);
	}
}

interface ParticlesBuffers {
	// Array of particle structs
	particles: GPUBuffer;
	// Each particle has 4 vertices, for the quad when rendering a debug view
	vertices: GPUBuffer;
	// The small grid we project to when converting to a mesh
	projectedGrid: GPUBuffer;
	// Flag that tracks if the particle normals / projectedGrid have been populated
	meshDirty: boolean;
}

const buildParticles = (device: GPUDevice): ParticlesBuffers => {
	const verticesBuffer = device.createBuffer({
		size: PARTICLE_COUNT * 4 * SIZEOF.vec4_f32,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
	});

	const projectedGridBuffer = device.createBuffer({
		size:
			SIZEOF.grid_point *
			GRID_DIMENSION *
			GRID_DIMENSION *
			GRID_DIMENSION,
		usage: GPUBufferUsage.STORAGE,
	});

	const f32PerParticle = SIZEOF.particle / SIZEOF.f32;
	const particles = new Float32Array(PARTICLE_COUNT * f32PerParticle).fill(
		0.0
	);
	for (let x = 0; x < 64; x++) {
		for (let y = 0; y < 64; y++) {
			for (let z = 0; z < 64; z++) {
				const particleIdx = x * 64 * 64 + y * 64 + z;

				particles[f32PerParticle * particleIdx] =
					PARTICLE_GAP * (x + (Math.random() - 0.5));
				particles[f32PerParticle * particleIdx + 1] =
					PARTICLE_GAP * (y + (Math.random() - 0.5));
				particles[f32PerParticle * particleIdx + 2] =
					PARTICLE_GAP * (z + (Math.random() - 0.5));
				particles[f32PerParticle * particleIdx + 3] = 1.0;
			}
		}
	}

	const particlesBuffer = device.createBuffer({
		size: PARTICLE_COUNT * SIZEOF.particle,
		usage:
			GPUBufferUsage.COPY_DST |
			GPUBufferUsage.STORAGE |
			GPUBufferUsage.COPY_SRC,
	});
	device.queue.writeBuffer(particlesBuffer, 0, particles);

	return {
		particles: particlesBuffer,
		vertices: verticesBuffer,
		projectedGrid: projectedGridBuffer,
		meshDirty: true,
	};
};

// Capable of drawing particles as spheres
interface ParticleDebugPipeline {
	pipeline_populateVertexBuffer: GPUComputePipeline;
	pipeline_renderParticles: GPURenderPipeline;
	pipeline_renderNormals: GPURenderPipeline;
	group0: GPUBindGroup;
	group1Render: GPUBindGroup;
	group1Compute: GPUBindGroup;
	quadIndexBuffer: GPUBuffer;
	lineIndexBuffer: GPUBuffer;
}
const buildParticleDebugPipeline = (
	device: GPUDevice,
	particles: ParticlesBuffers,
	cameraUBO: CameraUBO,
	particlesDebugConfigUBO: ParticlesDebugConfigUBO
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
			{
				binding: 2,
				visibility: GPUShaderStage.VERTEX,
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
			targets: [{ format: COLOR_FORMAT }],
			module: shaderModule,
			constants: {
				PARTICLE_RADIUS_SQUARED: PARTICLE_RADIUS * PARTICLE_RADIUS,
			},
			entryPoint: "drawParticlesFragment",
		},
		depthStencil: {
			format: DEPTH_FORMAT,
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
			targets: [{ format: COLOR_FORMAT }],
		},
		vertex: {
			module: shaderModule,
			entryPoint: "drawNormalsVertex",
		},
		depthStencil: {
			format: DEPTH_FORMAT,
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

	const group0 = device.createBindGroup({
		entries: [
			{ binding: 0, resource: particles.particles },
			{ binding: 1, resource: cameraUBO.buffer },
			{ binding: 2, resource: particlesDebugConfigUBO.buffer },
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
		group0,
		group1Render,
		group1Compute,
		quadIndexBuffer,
		lineIndexBuffer,
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

	pass.setBindGroup(0, pipeline.group0);
	pass.setBindGroup(1, pipeline.group1Render);

	pass.setIndexBuffer(pipeline.quadIndexBuffer, "uint32");
	pass.setPipeline(pipeline.pipeline_renderParticles);
	pass.drawIndexed(6, PARTICLE_COUNT);

	pass.setIndexBuffer(pipeline.lineIndexBuffer, "uint32");
	pass.setPipeline(pipeline.pipeline_renderNormals);
	pass.drawIndexed(2, PARTICLE_COUNT);

	pass.end();
};

// Pipeline that snaps particles to a grid then converts to a mesh with normals
interface ParticleMeshifyPipeline {
	pipeline_projectParticlesToGrid: GPUComputePipeline;
	pipeline_initGrid: GPUComputePipeline;
	pipeline_identifySurfaceParticles: GPUComputePipeline;
	pipeline_computeGridNormals: GPUComputePipeline;
	pipeline_render: GPURenderPipeline;
	groups: {
		camera: GPUBindGroup;
		particlesRead: GPUBindGroup;
		particlesReadWrite: GPUBindGroup;
		projectedGridRead: GPUBindGroup;
		projectedGridReadWrite: GPUBindGroup;
	};
	gridPointQuadIndexBuffer: GPUBuffer;
}
const buildParticleMeshifyPipeline = (
	device: GPUDevice,
	particles: ParticlesBuffers,
	cameraUBO: CameraUBO
): ParticleMeshifyPipeline => {
	const layouts = {
		camera: device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE | GPUShaderStage.VERTEX,
					buffer: { type: "uniform" },
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
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
					buffer: { type: "read-only-storage" },
				},
			],
			label: "ParticleMeshifyPipeline read-only storage",
		}),
	};

	const shaderModule = device.createShaderModule({
		code: ParticleMeshifyPak,
		label: "ParticleMeshifyPipeline ParticleMeshifyPak",
	});
	const pipeline_render = device.createRenderPipeline({
		vertex: { module: shaderModule, entryPoint: "vertexMain" },
		fragment: {
			targets: [{ format: COLOR_FORMAT }],
			module: shaderModule,
			entryPoint: "fragmentMain",
		},
		depthStencil: {
			format: DEPTH_FORMAT,
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
			],
			label: "ParticleMeshifyPipeline computeGridNormals",
		}),
		label: "ParticleMeshifyPipeline computeGridNormals",
	});

	const groups = {
		camera: device.createBindGroup({
			entries: [{ binding: 0, resource: cameraUBO.buffer }],
			layout: layouts.camera,
			label: "ParticleMeshifyPipeline camera",
		}),
		particlesRead: device.createBindGroup({
			entries: [{ binding: 0, resource: particles.particles }],
			layout: layouts.readOnlyStorage,
			label: "ParticleMeshifyPipeline particles read",
		}),
		particlesReadWrite: device.createBindGroup({
			entries: [{ binding: 0, resource: particles.particles }],
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
	};

	const gridPointQuadIndices = new Uint32Array([0, 1, 2, 0, 2, 3]);
	const gridPointQuadIndexBuffer = device.createBuffer({
		size: gridPointQuadIndices.byteLength,
		usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(gridPointQuadIndexBuffer, 0, gridPointQuadIndices);

	return {
		pipeline_render,
		pipeline_projectParticlesToGrid,
		pipeline_initGrid,
		pipeline_computeGridNormals,
		pipeline_identifySurfaceParticles,
		groups,
		gridPointQuadIndexBuffer,
	};
};
/**
 * Expensive, call sparingly. Determines surface particles and builds their
 * normals.
 */
const computeParticleMesh = ({
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
	compute.setPipeline(pipeline.pipeline_identifySurfaceParticles);
	compute.dispatchWorkgroups(PARTICLE_COUNT / 256, 1, 1);

	compute.setPipeline(pipeline.pipeline_computeGridNormals);
	compute.dispatchWorkgroups(PARTICLE_COUNT / 256, 1, 1);

	compute.end();
};
const drawParticleMeshifyProjectedGrid = ({
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
				loadOp: "clear",
				storeOp: "store",
				view: color.view,
				clearValue: { r: 0.0, g: 0.2, b: 0.0, a: 1.0 },
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
	pass.setIndexBuffer(pipeline.gridPointQuadIndexBuffer, "uint32");
	pass.setBindGroup(0, pipeline.groups.camera);
	pass.setBindGroup(1, pipeline.groups.particlesRead);
	pass.setBindGroup(2, pipeline.groups.projectedGridRead);
	pass.drawIndexed(6, GRID_DIMENSION * GRID_DIMENSION * GRID_DIMENSION);

	pass.end();
};

const RenderOutputCategory = ["Debug Particles", "Meshify Particles"] as const;
type RenderOutputCategory = (typeof RenderOutputCategory)[number];

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
	const particlesDebugConfigUBO = new ParticlesDebugConfigUBO(device);
	particlesDebugConfigUBO.writeToGPU(device.queue);

	const pipelineParameters: {
		output: RenderOutputCategory;
	} = {
		output: "Debug Particles",
	};

	const particles = buildParticles(device);

	const particleDebugPipeline = buildParticleDebugPipeline(
		device,
		particles,
		cameraUBO,
		particlesDebugConfigUBO
	);
	const particleMeshifyPipeline = buildParticleMeshifyPipeline(
		device,
		particles,
		cameraUBO
	);

	const debugBufferDst = device.createBuffer({
		size: particles.particles.size,
		usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
	});

	const permanentResources = {
		particleDebugPipeline,
		particleMeshifyPipeline,
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

	const uiFunctions = {
		resetCamera: (): void => {
			cameraUBO.data.eulerAnglesX = -0.5;
			cameraUBO.data.eulerAnglesY = 0.5;
			cameraUBO.data.distanceFromOrigin = 25.0;
		},
	};
	uiFunctions.resetCamera();

	const setupUI = (gui: LilGUI): void => {
		const label = document.createElement("p");
		label.innerHTML =
			"Mouse Scroll wheel controls camera zoom. Keyboard keys augment this when held: <br/><br/> Control : Controls camera yaw <br/> Shift : Controls camera pitch <br/> Alt : Decreases scroll sensitivity";
		label.style = "margin: 8px";
		const cameraParameters = gui.addFolder("Camera").open();
		cameraParameters.domElement.appendChild(label);
		cameraParameters
			.add(cameraUBO.data, "distanceFromOrigin")
			.name("Camera Radius")
			.min(CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[0])
			.max(CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1])
			.listen();

		cameraParameters
			.add(cameraUBO.data, "eulerAnglesX")
			.name("Camera Pitch")
			.min(CAMERA_PARAMETER_BOUNDS.eulerAnglesX[0])
			.max(CAMERA_PARAMETER_BOUNDS.eulerAnglesX[1])
			.listen();
		cameraParameters
			.add(cameraUBO.data, "eulerAnglesY")
			.name("Camera Yaw")
			.min(CAMERA_PARAMETER_BOUNDS.eulerAnglesY[0])
			.max(CAMERA_PARAMETER_BOUNDS.eulerAnglesY[1])
			.listen();

		cameraParameters.add(uiFunctions, "resetCamera").name("Reset Camera");

		const pipeline = gui.addFolder("Pipeline").open();
		pipeline
			.add(pipelineParameters, "output")
			.options(["Debug Particles", "Meshify Particles"])
			.name("Debug Particles");
		pipeline
			.add(particlesDebugConfigUBO.data, "hideNonSurface")
			.name("Hide Sub-surface Particles");
	};

	const draw = (presentTexture: GPUTexture): void => {
		cameraUBO.data.aspectRatio =
			presentTexture.width / presentTexture.height;
		cameraUBO.writeToGPU(device.queue);
		particlesDebugConfigUBO.writeToGPU(device.queue);

		const main = device.createCommandEncoder({
			label: "Sandstone Main",
		});

		let copying = false;

		if (permanentResources.particles.meshDirty) {
			computeParticleMesh({
				commandEncoder: main,
				pipeline: permanentResources.particleMeshifyPipeline,
			});
			permanentResources.particles.meshDirty = false;

			if (permanentResources.debugBufferDst.mapState === "unmapped") {
				copying = true;
				main.copyBufferToBuffer(
					permanentResources.particles.particles,
					permanentResources.debugBufferDst
				);
			}
		}

		switch (pipelineParameters.output) {
			case "Debug Particles": {
				drawParticleDebugPipeline({
					commandEncoder: main,
					color: transientResources.outputColor.color,
					depth: transientResources.outputColor.depth,
					pipeline: permanentResources.particleDebugPipeline,
				});
				break;
			}
			case "Meshify Particles": {
				drawParticleMeshifyProjectedGrid({
					commandEncoder: main,
					color: transientResources.outputColor.color,
					depth: transientResources.outputColor.depth,
					pipeline: permanentResources.particleMeshifyPipeline,
				});
				break;
			}
			default: {
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
				break;
			}
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
						const mappedRange =
							permanentResources.debugBufferDst.getMappedRange();
						const floats = new Float32Array(mappedRange);
						const u32s = new Uint32Array(mappedRange);
						const logVec4F32 = (first: number): string => {
							return `vec4 (${floats[first]},${
								floats[first + 1]
							},${floats[first + 2]},${floats[first + 3]})\n`;
						};
						const logVec3F32 = (first: number): string => {
							return `vec3 (${floats[first]},${
								floats[first + 1]
							},${floats[first + 2]})\n`;
						};
						const logU32 = (first: number): string => {
							return `u32 (${u32s[first]})\n`;
						};
						for (
							let particleIdx = 0;
							particleIdx < 2;
							particleIdx += 1
						) {
							const firstIdx =
								(particleIdx * SIZEOF.particle) / SIZEOF.f32;
							let str = "particle \n";
							str += "    " + logVec3F32(firstIdx); // position_world
							str += "    " + logU32(firstIdx + 3); // is_surface
							str += "    " + logVec4F32(firstIdx + 4); // normal_world
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
		handleWheel: ({ delta, shift, ctrl, alt }): void => {
			const sensAlt = alt ? 0.2 : 1;
			const sensDistance = 1 / 10;
			const sensEulerX = 1 / 500;
			const sensEulerY = 1 / 400;

			if (shift === ctrl) {
				const [min, max] = CAMERA_PARAMETER_BOUNDS.distanceFromOrigin;
				cameraUBO.data.distanceFromOrigin +=
					sensAlt * sensDistance * delta;
				cameraUBO.data.distanceFromOrigin = Math.max(
					Math.min(max, cameraUBO.data.distanceFromOrigin),
					min
				);
			} else if (shift) {
				const [min, max] = CAMERA_PARAMETER_BOUNDS.eulerAnglesX;
				const value =
					cameraUBO.data.eulerAnglesX + sensAlt * sensEulerX * delta;
				cameraUBO.data.eulerAnglesX = Math.max(
					Math.min(value, max),
					min
				);
			} else if (ctrl) {
				const [min, max] = CAMERA_PARAMETER_BOUNDS.eulerAnglesY;
				let value =
					cameraUBO.data.eulerAnglesY + sensAlt * sensEulerY * delta;

				if (value > max) {
					value -= Math.ceil(value / (max - min)) * (max - min);
				} else if (value < min) {
					value +=
						Math.ceil(Math.abs(value / (max - min))) * (max - min);
				}

				cameraUBO.data.eulerAnglesY = Math.max(
					Math.min(max, value),
					min
				);
			}
		},
		setupUI,
		destroy,
		handleResize,
	};
};
