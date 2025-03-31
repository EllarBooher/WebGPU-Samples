import { Vec2, vec2, Vec3, vec3 } from "wgpu-matrix";
import { UBO } from "../util/UBO";
import { GlobalUBO } from "../GlobalUBO";
import WaveSurfaceDisplacementPak from "../../../shaders/sky-sea/ocean/wave_surface_displacement.wgsl";
import { FFTWaveDisplacementMaps } from "./FourierWaves";
import { TimestampQueryInterval } from "../PerformanceTracker";
import { GBuffer, GBufferFormats } from "../GBuffer";

interface WaveCascade {
	patch_size_meters: number;
}

const CASCADE_CAPACITY = 4;
class WaveSurfaceDisplacementUBO extends UBO {
	public readonly data: {
		patch_world_half_extent: number;
		b_gerstner: boolean;
		b_displacement_map: boolean;
		vertex_size: number;

		gbuffer_extent: Vec2;
		foam_scale: number;
		foam_bias: number;

		padding0: Vec3;
		procedural_wave_count: number;

		cascades: WaveCascade[];
	} = {
		patch_world_half_extent: 50.0,
		b_gerstner: true,
		b_displacement_map: true,
		vertex_size: 1000,
		gbuffer_extent: vec2.create(1.0, 1.0),
		foam_scale: 1.0,
		foam_bias: 0.0,

		padding0: vec3.create(0.0, 0.0, 0.0),
		procedural_wave_count: 12,

		cascades: [
			{ patch_size_meters: 200.0 },
			{ patch_size_meters: 50.0 },
			{ patch_size_meters: 10.0 },
			{ patch_size_meters: 0.0 },
		],
	};

	constructor(device: GPUDevice) {
		const FLOAT_COUNT = 4 + 4 + 4 + 4 * CASCADE_CAPACITY;
		super(
			device,
			FLOAT_COUNT,
			"Wave Surface Displacement Patch World Half Extent UBO"
		);
	}

	protected override packed(): ArrayBuffer {
		const buffer = new ArrayBuffer(this.buffer.size);
		const view = new DataView(buffer);
		const float32 = new Float32Array(buffer);

		view.setFloat32(0, this.data.patch_world_half_extent, true);
		view.setUint32(4, this.data.b_gerstner ? 1 : 0, true);
		view.setUint32(8, this.data.b_displacement_map ? 1 : 0, true);
		view.setUint32(12, this.data.vertex_size, true);

		float32.set(this.data.gbuffer_extent, 4);
		view.setFloat32(24, this.data.foam_scale, true);
		view.setFloat32(28, this.data.foam_bias, true);

		float32.set(this.data.padding0, 8);
		view.setUint32(44, this.data.procedural_wave_count, true);

		const vec3Zeroed = vec3.create(0.0, 0.0, 0.0);

		for (let i = 0; i < CASCADE_CAPACITY; i++) {
			const f32Offset = 12 + i * 4;
			float32.set(vec3Zeroed, f32Offset);
			view.setFloat32(
				(f32Offset + 3) * 4,
				this.data.cascades[i].patch_size_meters,
				true
			);
		}

		return buffer;
	}
}

/**
 * Parameters that control the generation and appearance of the ocean surface.
 */
export interface WaveSurfaceSettings {
	/*
	 * Whether or not to enable gerstner waves. Valid for both the mapped and
	 * procedural wave sampling methods.
	 */
	gerstner: boolean;

	/*
	 * Whether or not to sample the already-bound displacement maps for the
	 * creation of the ocean surface.
	 */
	fft: boolean;

	/*
	 * A scaling factor applied to the generated foam. Multiplied after the
	 * bias.
	 */
	foamScale: number;

	/*
	 * A linear bias applied to the generated foam. Added before the scale.
	 */
	foamBias: number;
}

/**
 * This contains all of the resources for rendering the ocean surface into a
 * GBuffer.
 * - Mesh displacement and gradients can be sampled from maps or generated
 *   procedurally from sine or cosine waves. This is decided per-frame at draw
 *   time.
 * - Also produces foam, when texture maps are used for the displacement.
 */
export class WaveSurfaceDisplacementPassResources {
	private oceanSurfaceRasterizationPipeline: GPURenderPipeline;

	/*
	 * @group(0) @binding(0) var<uniform> u_settings: WaveSurfaceDisplacementUBO;
	 * @group(0) @binding(1) var<uniform> u_global: GlobalUBO;
	 */
	private group0: GPUBindGroup;

	/*
	 * @group(1) @binding(0) var displacement_map_sampler: sampler;
	 * @group(1) @binding(1) var Dx_Dy_Dz_Dxdz_spatial: texture_2d<f32>;
	 * @group(1) @binding(2) var Dydx_Dydz_Dxdx_Dzdz_spatial: texture_2d<f32>;
	 * @group(1) @binding(3) var<uniform> u_waves: array<PlaneWave, WAVE_COUNT>;
	 */
	private group1: GPUBindGroup;

	/*
	 * @group(2) @binding(0) var turbulence_jacobian: texture_2d_array<f32>;
	 */
	private group2ByTurbulenceMapIndex: GPUBindGroup[];

	private settingsUBO: WaveSurfaceDisplacementUBO;

	private baseIndexCount: number;
	private indices: GPUBuffer;

	/**
	 * Initializes all resources.
	 * @param device - The WebGPU device to use.
	 * @param globalUBO - The GlobalUBO instance that will be bound
	 *  once and referenced in all recordings
	 * @param formats - The formats of the gbuffer to use as color
	 * 	attachments.
	 * @param displacementMaps - 2D array textures
	 *  that multiple cascades of ocean wave spectra.
	 */
	constructor(
		device: GPUDevice,
		globalUBO: GlobalUBO,
		formats: GBufferFormats,
		displacementMaps: FFTWaveDisplacementMaps
	) {
		// The number of vertices we use for the ocean surface mesh projected from screen space
		const VERTEX_SIZE = 1024;

		const INDEX_SIZE_BYTES = 4; /* u32 */
		const TRIANGLE_COUNT = 2 * (VERTEX_SIZE - 1) * (VERTEX_SIZE - 1);
		const INDEX_COUNT = 3 * TRIANGLE_COUNT;
		this.baseIndexCount = INDEX_COUNT;

		this.indices = device.createBuffer({
			size: INDEX_COUNT * INDEX_SIZE_BYTES,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX,
			label: "Wave Surface Displacement Indices",
		});

		// Could use instancing instead of duplicating the indices, since these are all a bunch of quads
		const indicesSource = new Uint32Array(INDEX_COUNT);
		let indicesSourceOffset = 0;
		for (let y = 0; y < VERTEX_SIZE - 1; y++) {
			for (let x = 0; x < VERTEX_SIZE - 1; x++) {
				// Looking at the grid from above we have 4 indices per cell of adjacent vertices
				// y 2 3
				// | 0 1
				// ----x

				const index0 = x + y * VERTEX_SIZE;
				const index1 = index0 + 1;
				const index2 = index0 + VERTEX_SIZE;
				const index3 = index2 + 1;

				const twoTriangleIndices = new Uint32Array([
					index0,
					index2,
					index1,
					index1,
					index2,
					index3,
				]);
				indicesSource.set(twoTriangleIndices, indicesSourceOffset);
				indicesSourceOffset += twoTriangleIndices.length;
			}
		}
		device.queue.writeBuffer(this.indices, 0, indicesSource);

		const WAVE_COUNT = 12;
		const WAVE_SIZE_FLOATS = 4;
		const WAVE_SIZE_BYTES = 4 * WAVE_SIZE_FLOATS;
		const waves = device.createBuffer({
			size: WAVE_COUNT * WAVE_SIZE_BYTES,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
			label: "Wave Surface Displacement Waves",
		});

		// We ensure that the waves can loop, and determine this loop period
		// To ensure this, the phase speeds must be an integer ratio
		// Our model uses the dispersion relationship for deep ocean waves:
		// c := wave speed
		// g := gravity = 9.8
		// k := wave number = wavelength / 2pi
		// T := period in seconds
		//
		// c = sqrt(g * k) = sqrt(g * wavelength / 2pi)
		// T = wavelength / c = sqrt(wavelength * 2pi / g)
		//
		// Thus we pick some base largest wavelength to determine the animation period
		// Then, all smaller periods must be T/n for some integer n.
		// So all smaller wavelengths are wavelength / n^2 for some integer n.
		//
		// Note: we do not actually need to render the largest wave, this just ensures that the periods work out.

		const gravity = 9.8;
		const animationPeriod = 60.0;
		// ~5615 meter wavelength
		const baseWavelength =
			(animationPeriod * animationPeriod * gravity) / (2.0 * Math.PI);

		// Mirrors GPU structure size and alignment
		interface PlaneWave {
			direction: Vec2;
			amplitude: number;
			wavelength: number;
		}

		// Arbitrarily picked wavelengths/directions/amplitudes
		// Loops may occur but I did not see any with these parameters
		const wavesSource = new Array<PlaneWave>(
			{
				direction: vec2.create(0.4, 2.0),
				amplitude: 0.25,
				wavelength: baseWavelength / (12.0 * 12.0),
			},
			{
				direction: vec2.create(0.6, 2.0),
				amplitude: 0.3,
				wavelength: baseWavelength / (14.0 * 14.0),
			},
			{
				direction: vec2.create(0.8, 2.0),
				amplitude: 0.35,
				wavelength: baseWavelength / (12.0 * 12.0),
			},
			{
				direction: vec2.create(1.0, 2.0),
				amplitude: 0.4,
				wavelength: baseWavelength / (16.0 * 16.0),
			},
			{
				direction: vec2.create(1.2, 2.0),
				amplitude: 0.45,
				wavelength: baseWavelength / (12.0 * 12.0),
			},
			{
				direction: vec2.create(1.4, 2.0),
				amplitude: 0.4,
				wavelength: baseWavelength / (14.0 * 14.0),
			},
			{
				direction: vec2.create(1.6, 2.0),
				amplitude: 0.35,
				wavelength: baseWavelength / (12.0 * 12.0),
			},
			{
				direction: vec2.create(1.8, 2.0),
				amplitude: 0.3,
				wavelength: baseWavelength / (16.0 * 16.0),
			},
			{
				direction: vec2.create(0.8, 1.5),
				amplitude: 0.02,
				wavelength: baseWavelength / (30.0 * 30.0),
			},
			{
				direction: vec2.create(1.1, 1.5),
				amplitude: 0.02,
				wavelength: baseWavelength / (30.0 * 30.0),
			},
			{
				direction: vec2.create(1.2, 1.5),
				amplitude: 0.02,
				wavelength: baseWavelength / (30.0 * 30.0),
			},
			{
				direction: vec2.create(1.3, 1.5),
				amplitude: 0.02,
				wavelength: baseWavelength / (30.0 * 30.0),
			}
		);
		const wavesFloats = new Float32Array(WAVE_COUNT * WAVE_SIZE_FLOATS);
		let wavesFloatsIndex = 0;
		wavesSource.forEach((value) => {
			wavesFloats.set(value.direction, wavesFloatsIndex);
			wavesFloats[wavesFloatsIndex + 2] = value.amplitude;
			wavesFloats[wavesFloatsIndex + 3] = value.wavelength;
			wavesFloatsIndex += 4;
		});
		device.queue.writeBuffer(waves, 0, wavesFloats);

		this.settingsUBO = new WaveSurfaceDisplacementUBO(device);
		this.settingsUBO.data.vertex_size = VERTEX_SIZE;
		this.settingsUBO.data.procedural_wave_count = wavesSource.length;

		const group1Layout = device.createBindGroupLayout({
			label: "Wave Surface Displacement Group 1 Compute (Displacement Map)",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					sampler: { type: "filtering" },
				},
				{
					binding: 1,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					texture: { sampleType: "float", viewDimension: "2d-array" },
				},
				{
					binding: 2,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					texture: { sampleType: "float", viewDimension: "2d-array" },
				},
				{
					binding: 3,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					buffer: { type: "read-only-storage" },
				},
			],
		});
		this.group1 = device.createBindGroup({
			label: "Wave Surface Displacement Group 1 Compute (Displacement Map)",
			layout: group1Layout,
			entries: [
				{
					binding: 0,
					resource: device.createSampler({
						label: "Wave Surface Displacement Group 1 Sampler",
						minFilter: "linear",
						magFilter: "linear",
						mipmapFilter: "linear",
						addressModeU: "repeat",
						addressModeV: "repeat",
						maxAnisotropy: 10.0,
					}),
				},
				{
					binding: 1,
					resource: displacementMaps.Dx_Dy_Dz_Dxdz_SpatialAllMips,
				},
				{
					binding: 2,
					resource:
						displacementMaps.Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips,
				},
				{
					binding: 3,
					resource: { buffer: waves },
				},
			],
		});

		const group2Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					texture: { sampleType: "float", viewDimension: "2d-array" },
				},
			],
		});

		this.group2ByTurbulenceMapIndex =
			displacementMaps.turbulenceJacobianOneMip.map((view, index) => {
				return device.createBindGroup({
					label: `Wave Surface Displacement Group 2 Compute (Turbulence) index ${index}`,
					layout: group2Layout,
					entries: [
						{
							binding: 0,
							resource: view,
						},
					],
				});
			});

		const group0Layout = device.createBindGroupLayout({
			entries: [
				{
					// settings
					binding: 0,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					buffer: { type: "uniform" },
				},
				{
					// global UBO
					binding: 1,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					buffer: { type: "uniform" },
				},
			],
			label: "Wave Surface Displacement Group 0",
		});

		this.group0 = device.createBindGroup({
			layout: group0Layout,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.settingsUBO.buffer,
					},
				},
				{
					binding: 1,
					resource: {
						buffer: globalUBO.buffer,
					},
				},
			],
			label: "Wave Surface Displacement Group 0",
		});

		const shaderModule = device.createShaderModule({
			code: WaveSurfaceDisplacementPak,
			label: "Wave Surface Displacement",
		});

		this.oceanSurfaceRasterizationPipeline = device.createRenderPipeline({
			layout: device.createPipelineLayout({
				bindGroupLayouts: [group0Layout, group1Layout, group2Layout],
			}),
			vertex: {
				module: shaderModule,
				entryPoint: "screenSpaceWarped",
			},
			fragment: {
				module: shaderModule,
				entryPoint: "rasterizationFragment",
				targets: [
					{
						format: formats.colorWithSurfaceWorldDepthInAlpha,
					},
					{
						format: formats.normalWithSurfaceFoamStrengthInAlpha,
					},
				],
			},
			primitive: {
				topology: "triangle-list",
				cullMode: "back",
				frontFace: "cw",
			},
			depthStencil: {
				format: formats.depth,
				depthWriteEnabled: true,
				depthCompare: "less",
			},
			label: "Wave Surface Displacement Surface Rasterization",
		});
	}

	/**
	 * Fills the provided color/depth attachments with the generated ocean
	 * surface.
	 * @param device - The WebGPU device to use.
	 * @param commandEncoder - The command encoder to record all passes into.
	 * @param timestampInterval - The interval to record timing information
	 *  into.
	 * @param turbulenceMapIndex - The index into which of the already-bound
	 *  turbulence maps to use for foam generation, if the option is enabled.
	 * @param settings - The settings to use.
	 * @param gbuffer - The gbuffer that will be filled with the rasterized
	 *  ocean surface.
	 */
	record(
		device: GPUDevice,
		commandEncoder: GPUCommandEncoder,
		timestampInterval: TimestampQueryInterval | undefined,
		turbulenceMapIndex: number,
		settings: WaveSurfaceSettings,
		gbuffer: GBuffer
	): void {
		this.settingsUBO.data.patch_world_half_extent = settings.fft
			? 100.0
			: 300.0;
		this.settingsUBO.data.b_gerstner = settings.gerstner;
		this.settingsUBO.data.b_displacement_map = settings.fft;
		this.settingsUBO.data.foam_bias = settings.foamBias;
		this.settingsUBO.data.gbuffer_extent = vec2.create(
			gbuffer.extent.width,
			gbuffer.extent.height
		);
		this.settingsUBO.data.foam_scale = settings.foamScale;
		this.settingsUBO.writeToGPU(device.queue);

		const surfaceRasterizationPassEncoder = commandEncoder.beginRenderPass({
			label: "Wave Surface Rasterization",
			colorAttachments: [
				{
					clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
					loadOp: "clear",
					storeOp: "store",
					view: gbuffer.colorWithSurfaceWorldDepthInAlphaView,
				},
				{
					clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
					loadOp: "clear",
					storeOp: "store",
					view: gbuffer.normalWithSurfaceFoamStrengthInAlphaView,
				},
			],
			depthStencilAttachment: {
				view: gbuffer.depthView,
				depthClearValue: 1.0,
				depthLoadOp: "clear",
				depthStoreOp: "store",
			},
			timestampWrites:
				timestampInterval !== undefined
					? {
							querySet: timestampInterval.querySet,
							beginningOfPassWriteIndex:
								timestampInterval.beginWriteIndex,
							endOfPassWriteIndex:
								timestampInterval.endWriteIndex,
					  }
					: undefined,
		});

		surfaceRasterizationPassEncoder.setPipeline(
			this.oceanSurfaceRasterizationPipeline
		);
		surfaceRasterizationPassEncoder.setBindGroup(0, this.group0);
		surfaceRasterizationPassEncoder.setBindGroup(1, this.group1);
		surfaceRasterizationPassEncoder.setBindGroup(
			2,
			this.group2ByTurbulenceMapIndex[turbulenceMapIndex]
		);
		surfaceRasterizationPassEncoder.setIndexBuffer(this.indices, "uint32");

		surfaceRasterizationPassEncoder.drawIndexed(this.baseIndexCount, 1);

		surfaceRasterizationPassEncoder.end();
	}
}
