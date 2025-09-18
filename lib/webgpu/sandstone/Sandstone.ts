import { RendererApp, RendererAppConstructor } from "../RendererApp";
import * as LilGUI from "lil-gui";
import ParticlesDebugPak from "../../shaders/sandstone/particles_debug.wgsl";
import ParticleMeshifyPak from "../../shaders/sandstone/particles_meshify.wgsl";
import { FullscreenQuadPassResources } from "../sky-sea/FullscreenQuad";
import { RenderOutputTexture } from "../sky-sea/RenderOutputController";
import { UBO } from "../sky-sea/util/UBO";
import { CameraUBO } from "./Camera";
import { WorldAxesPipeline } from "./WorldAxes";
import { SIZEOF } from "./Sizeof";

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
// Add a bit of a gap so no particles are negative
const PARTICLE_BOUNDING_BOX = {
	min: [1.0, 1.0, 1.0],
	max: [31.0, 31.0, 31.0],
};
// Particle radius is purely for debug purposes, the particles have no size in the model.
const PARTICLE_RADIUS = 0.2;
const PARTICLE_DIMENSIONS = [64, 64, 64];
const PARTICLE_COUNT =
	PARTICLE_DIMENSIONS[0] * PARTICLE_DIMENSIONS[1] * PARTICLE_DIMENSIONS[2];
const GRID_DIMENSION = 64;
const EULER_ANGLES_X_SAFETY_MARGIN = 0.01;
const NEIGHBORHOOD_SIZE = 4;
const CAMERA_PARAMETER_BOUNDS = {
	distanceFromOrigin: [0.0, 100.0],
	eulerAnglesX: [
		-Math.PI / 2.0 + EULER_ANGLES_X_SAFETY_MARGIN,
		Math.PI / 2.0 - EULER_ANGLES_X_SAFETY_MARGIN,
	],
	eulerAnglesY: [-Math.PI, Math.PI],
};

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

interface ParticlesDebugConfig {
	drawSurfaceOnly: boolean;
	drawNormals: boolean;
}
class ParticlesDebugConfigUBO extends UBO {
	public readonly data: ParticlesDebugConfig = {
		drawSurfaceOnly: true,
		drawNormals: false,
	};

	constructor(device: GPUDevice) {
		const SIZEOF = 8;
		const BYTES_PER_FLOAT32 = 4;
		super(device, SIZEOF / BYTES_PER_FLOAT32, "Camera UBO");
	}

	protected override packed(): Uint32Array {
		return new Uint32Array([
			this.data.drawSurfaceOnly ? 1 : 0,
			this.data.drawNormals ? 1 : 0,
		]);
	}
}

interface Particles {
	/* ParticleBuffer in types.inc.wgsl */
	particleBuffer: GPUBuffer;
	/* A buffer to copy the particles header into, for querying particle stats such as surface particle count */
	particleHeaderHostBuffer: GPUBuffer;
	countSurface?: number;

	particleGraphBuffer: GPUBuffer;
	particleGraphBufferDebug: GPUBuffer;
	particleGraphPongBuffer: GPUBuffer;

	// Each particle has 4 vertices, for the quad when rendering a debug view
	vertices: GPUBuffer;
	// The small grid we project to when converting to a mesh
	projectedGrid: GPUBuffer;
	// Flag that tracks if the particle normals / projectedGrid have been populated
	meshDirty: boolean;
}

const buildParticles = (device: GPUDevice): Particles => {
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

	const edgeCount = NEIGHBORHOOD_SIZE * PARTICLE_COUNT * 2;
	const particleGraphBufferHeaderSize =
		SIZEOF.vec4_f32 + SIZEOF.drawIndexedIndirectParameters;
	const particleGraphBuffer = device.createBuffer({
		size: particleGraphBufferHeaderSize + edgeCount * SIZEOF.vec2_u32,
		usage:
			GPUBufferUsage.STORAGE |
			GPUBufferUsage.INDIRECT |
			GPUBufferUsage.COPY_SRC,
	});
	const particleGraphBufferDebug = device.createBuffer({
		size: particleGraphBuffer.size,
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
	};
};

const writeParticles = (device: GPUDevice, particles: Particles): void => {
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
	const randomPositions = new Float32Array(
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

				randomPositions[offset] = position.x;
				randomPositions[offset + 1] = position.y;
				randomPositions[offset + 2] = position.z;
				randomPositions[offset + 3] = 1.0;

				const [r, g, b] = sampleColor(
					(y + deviation) / PARTICLE_DIMENSIONS[1]
				);
				randomPositions[offset + 8] = r;
				randomPositions[offset + 9] = g;
				randomPositions[offset + 10] = b;
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
		randomPositions
	);

	particles.meshDirty = true;
};

interface PointNeighborhoodBuffer {
	buffer: GPUBuffer;
}
const PointNeighborhoodBuffer = {
	build: (device: GPUDevice): PointNeighborhoodBuffer => {
		const buffer = device.createBuffer({
			usage:
				GPUBufferUsage.COPY_DST |
				GPUBufferUsage.STORAGE |
				GPUBufferUsage.UNIFORM,
			size: SIZEOF.pointNeighborhood,
			label: "Point Neighborhood",
		});
		return { buffer };
	},
	writeToGPU: ({
		device,
		neighborhood,
		particleIndex,
	}: {
		device: GPUDevice;
		neighborhood: PointNeighborhoodBuffer;
		particleIndex: number;
	}): void => {
		const bytes = new ArrayBuffer(neighborhood.buffer.size / SIZEOF.f32);

		const floats = new Float32Array(bytes);
		floats.fill(0.0);

		const uints = new Uint32Array(bytes);
		uints[3] = particleIndex;

		device.queue.writeBuffer(neighborhood.buffer, 0, bytes);
	},
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
	particles: Particles,
	cameraUBO: CameraUBO,
	particlesDebugConfigUBO: ParticlesDebugConfigUBO,
	debugNeighborhoodBuffer: PointNeighborhoodBuffer
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
				visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
				buffer: { type: "uniform" },
			},
			{
				binding: 3,
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
			{ binding: 0, resource: particles.particleBuffer },
			{ binding: 1, resource: cameraUBO.buffer },
			{ binding: 2, resource: particlesDebugConfigUBO.buffer },
			{ binding: 3, resource: debugNeighborhoodBuffer.buffer },
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
	drawNormals,
}: {
	commandEncoder: GPUCommandEncoder;
	color: RenderOutputTexture;
	depth: RenderOutputTexture;
	pipeline: ParticleDebugPipeline;
	drawNormals: boolean;
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

	pass.setIndexBuffer(pipeline.quadIndexBuffer, "uint32");
	pass.setPipeline(pipeline.pipeline_renderParticles);
	pass.drawIndexed(6, PARTICLE_COUNT);

	if (drawNormals) {
		pass.setIndexBuffer(pipeline.lineIndexBuffer, "uint32");
		pass.setPipeline(pipeline.pipeline_renderNormals);
		pass.drawIndexed(2, PARTICLE_COUNT);
	}

	pass.end();
};

// Pipeline that snaps particles to a grid then converts to a mesh with normals
interface ParticleMeshifyPipeline {
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
const buildParticleMeshifyPipeline = (
	device: GPUDevice,
	particles: Particles,
	cameraUBO: CameraUBO,
	debugNeighborhoodBuffer: PointNeighborhoodBuffer
): ParticleMeshifyPipeline => {
	const layouts = {
		camera: device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE | GPUShaderStage.VERTEX,
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
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
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
			targets: [{ format: COLOR_FORMAT }],
		},
		depthStencil: {
			format: DEPTH_FORMAT,
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
				{ binding: 0, resource: cameraUBO.buffer },
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
			entries: [{ binding: 0, resource: particles.particleGraphBuffer }],
			layout: layouts.readOnlyStorage,
			label: "ParticleMeshifyPipeline particle_graph read",
		}),
		particleGraphReadWrite: device.createBindGroup({
			entries: [{ binding: 0, resource: particles.particleGraphBuffer }],
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
	device.queue.writeBuffer(gridPointQuadIndexBuffer, 0, gridPointQuadIndices);

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
};
const drawParticleGraph = ({
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
};

/**
 * Uses clear values to draw flat values into a color & depth target, with no pipelines.
 */
const drawBackground = ({
	commandEncoder,
	color,
	depth,
	clearValueColor,
}: {
	commandEncoder: GPUCommandEncoder;
	color: RenderOutputTexture;
	depth: RenderOutputTexture;
	clearValueColor: GPUColor;
}): void => {
	const DEPTH_CLEAR_VALUE = 0.0;
	commandEncoder
		.beginRenderPass({
			label: "Draw Background",
			colorAttachments: [
				{
					loadOp: "clear",
					storeOp: "store",
					view: color.view,
					clearValue: clearValueColor,
				},
			],
			depthStencilAttachment: {
				view: depth.view,
				depthClearValue: DEPTH_CLEAR_VALUE,
				depthLoadOp: "clear",
				depthStoreOp: "store",
			},
		})
		.end();
};

const RenderOutputCategory = [
	"Debug Particles",
	"Meshify Particles",
	"Particle Graph",
] as const;
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

	const debugNeighborhood = PointNeighborhoodBuffer.build(device);
	PointNeighborhoodBuffer.writeToGPU({
		device,
		neighborhood: debugNeighborhood,
		particleIndex: 0,
	});

	const pipelineParameters: {
		output: RenderOutputCategory;
		debugParticleIdx: number;
	} = {
		output: "Debug Particles",
		debugParticleIdx: 0,
	};

	const particles = buildParticles(device);
	writeParticles(device, particles);

	const particleDebugPipeline = buildParticleDebugPipeline(
		device,
		particles,
		cameraUBO,
		particlesDebugConfigUBO,
		debugNeighborhood
	);
	const particleMeshifyPipeline = buildParticleMeshifyPipeline(
		device,
		particles,
		cameraUBO,
		debugNeighborhood
	);

	const permanentResources = {
		particleDebugPipeline,
		particleMeshifyPipeline,
		worldAxesPipeline: WorldAxesPipeline.build({
			device,
			cameraUBO,
			colorFormat: COLOR_FORMAT,
			depthFormat: DEPTH_FORMAT,
		}),
		fullscreenQuad: new FullscreenQuadPassResources(device, COLOR_FORMAT),
		cameraUBO,
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

	let debugParticleController: LilGUI.Controller | undefined = undefined;

	const setupUI = (gui: LilGUI.GUI): void => {
		const folders = {
			camera: gui.addFolder("Camera").open(),
			pipeline: gui.addFolder("Pipeline").open(),
			particles: gui.addFolder("Particles").open(),
		};

		const label = document.createElement("p");
		label.innerHTML =
			"Mouse Scroll wheel controls camera zoom. Keyboard keys augment this when held: <br/><br/> Control : Controls camera yaw <br/> Shift : Controls camera pitch <br/> Alt : Decreases scroll sensitivity";
		label.style = "margin: 8px";
		folders.camera.domElement.appendChild(label);
		folders.camera
			.add(cameraUBO.data, "distanceFromOrigin")
			.name("Camera Radius")
			.min(CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[0])
			.max(CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1])
			.listen();

		folders.camera
			.add(cameraUBO.data, "eulerAnglesX")
			.name("Camera Pitch")
			.min(CAMERA_PARAMETER_BOUNDS.eulerAnglesX[0])
			.max(CAMERA_PARAMETER_BOUNDS.eulerAnglesX[1])
			.listen();
		folders.camera
			.add(cameraUBO.data, "eulerAnglesY")
			.name("Camera Yaw")
			.min(CAMERA_PARAMETER_BOUNDS.eulerAnglesY[0])
			.max(CAMERA_PARAMETER_BOUNDS.eulerAnglesY[1])
			.listen();

		folders.camera.add(uiFunctions, "resetCamera").name("Reset Camera");

		folders.pipeline
			.add(pipelineParameters, "output")
			.options(RenderOutputCategory)
			.name("Debug Particles");
		folders.pipeline
			.add(particlesDebugConfigUBO.data, "drawSurfaceOnly")
			.name("Draw Surface Only");
		folders.pipeline
			.add(particlesDebugConfigUBO.data, "drawNormals")
			.name("Draw Normals");
		debugParticleController = folders.pipeline
			.add(pipelineParameters, "debugParticleIdx")
			.name("Debug Particle Index")
			.min(0)
			.max(PARTICLE_COUNT)
			.step(1)
			.listen()
			.onFinishChange(() => {
				permanentResources.particles.meshDirty = true;
			});

		folders.particles.add(
			{
				"Randomize Particles": () =>
					writeParticles(device, permanentResources.particles),
			},
			"Randomize Particles"
		);
	};

	let particleHeaderReadState:
		| "ready-to-copy"
		| "ready-to-map"
		| "up-to-date" = "up-to-date";

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
			PointNeighborhoodBuffer.writeToGPU({
				device,
				neighborhood: debugNeighborhood,
				particleIndex: pipelineParameters.debugParticleIdx,
			});

			computeParticleMesh({
				commandEncoder: main,
				pipeline: permanentResources.particleMeshifyPipeline,
			});

			if (
				permanentResources.particles.particleGraphBufferDebug
					.mapState === "unmapped"
			) {
				copying = true;
				main.copyBufferToBuffer(
					permanentResources.particles.particleGraphBuffer,
					permanentResources.particles.particleGraphBufferDebug
				);
			}

			permanentResources.particles.meshDirty = false;

			particleHeaderReadState = "ready-to-copy";
			permanentResources.particles.countSurface = undefined;
			debugParticleController?.disable();
			debugParticleController?.min(0);
			debugParticleController?.max(0);

			done = false;
		}

		if (
			particleHeaderReadState === "ready-to-copy" &&
			permanentResources.particles.particleHeaderHostBuffer.mapState ===
				"unmapped"
		) {
			particleHeaderReadState = "ready-to-map";
			main.copyBufferToBuffer(
				permanentResources.particles.particleBuffer,
				permanentResources.particles.particleHeaderHostBuffer,
				permanentResources.particles.particleHeaderHostBuffer.size
			);
		}

		const clearColor = (
			{
				"Debug Particles": [0.4, 0.6, 1.0, 1.0],
				"Meshify Particles": [0.05, 0.1, 0.05, 1.0],
				"Particle Graph": [0.1, 0.1, 0.1, 1.0],
			} as const
		)[pipelineParameters.output];

		drawBackground({
			commandEncoder: main,
			color: transientResources.outputColor.color,
			depth: transientResources.outputColor.depth,
			clearValueColor: clearColor,
		});
		WorldAxesPipeline.draw({
			commandEncoder: main,
			color: transientResources.outputColor.color,
			depth: transientResources.outputColor.depth,
			pipeline: permanentResources.worldAxesPipeline,
		});

		switch (pipelineParameters.output) {
			case "Debug Particles": {
				drawParticleDebugPipeline({
					commandEncoder: main,
					color: transientResources.outputColor.color,
					depth: transientResources.outputColor.depth,
					pipeline: permanentResources.particleDebugPipeline,
					drawNormals: particlesDebugConfigUBO.data.drawNormals,
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
			case "Particle Graph": {
				drawParticleGraph({
					commandEncoder: main,
					color: transientResources.outputColor.color,
					depth: transientResources.outputColor.depth,
					pipeline: permanentResources.particleMeshifyPipeline,
					particles: permanentResources.particles,
				});
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
					permanentResources.particles.particleGraphBufferDebug
						.mapState !== "unmapped";
				if (busy || done) {
					return;
				}

				done = true;
				permanentResources.particles.particleGraphBufferDebug
					.mapAsync(GPUMapMode.READ)
					.then(() => {
						// offset past header
						const mappedRange =
							permanentResources.particles.particleGraphBufferDebug.getMappedRange();
						const floats = new Float32Array(mappedRange);
						const u32s = new Uint32Array(mappedRange);
						const log = {
							vec4f32: (first: number): string => {
								return `vec4 (${floats[first]},${
									floats[first + 1]
								},${floats[first + 2]},${floats[first + 3]})\n`;
							},
							vec3f32: (first: number): string => {
								return `vec3 (${floats[first]},${
									floats[first + 1]
								},${floats[first + 2]})\n`;
							},
							u32: (first: number): string => {
								return `u32 (${u32s[first]})\n`;
							},
						};
						console.log("particle graph");
						console.log("    padding0 " + log.vec3f32(0));
						console.log("    edge_count " + log.u32(3));
						console.log("    indirect draw");
						console.log("        padding0       " + log.vec3f32(4));
						console.log("        index_count    " + log.u32(7));
						console.log("        instance_count " + log.u32(8));
						console.log("        first_index    " + log.u32(9));
						console.log("        base_vertex    " + log.u32(10));
						console.log("        first_instance " + log.u32(11));
						permanentResources.particles.particleGraphBufferDebug.unmap();
					})
					.catch((reason) => {
						console.error(reason);
					});
			})
			.then(() => {
				if (
					particleHeaderReadState !== "ready-to-map" ||
					permanentResources.particles.particleHeaderHostBuffer
						.mapState !== "unmapped"
				) {
					return;
				}
				permanentResources.particles.particleHeaderHostBuffer
					.mapAsync(GPUMapMode.READ)
					.then(() => {
						const mappedRange =
							permanentResources.particles.particleHeaderHostBuffer.getMappedRange();
						const u32s = new Uint32Array(mappedRange);

						permanentResources.particles.countSurface = u32s[2];
						const [min, max] = [
							0,
							permanentResources.particles.countSurface,
						];
						debugParticleController?.disable(false);
						debugParticleController?.min(min);
						debugParticleController?.max(max - 1);
						debugParticleController?.setValue(
							Math.max(
								Math.min(
									pipelineParameters.debugParticleIdx,
									max
								),
								min
							)
						);

						permanentResources.particles.particleHeaderHostBuffer.unmap();
					})
					.catch((reason) => {
						console.error(reason);
					})
					.finally(() => {
						particleHeaderReadState = "up-to-date";
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
