import FourierWavesShaderPak from "../../../shaders/sky-sea/ocean/fourier_waves.wgsl";

import { UBO } from "../util/UBO.ts";
import { GlobalUBO } from "../GlobalUBO.ts";
import { DFFTResources } from "../util/FFT.ts";
import { RenderOutputTexture } from "../RenderOutputController.ts";
import {
	MipMapGenerationPassResources,
	MipMapGenerationTextureBindings,
} from "../util/MipMap.ts";
import { vec2, Vec2 } from "wgpu-matrix";
import { TimestampQueryInterval } from "../PerformanceTracker.ts";
import { Extent3D } from "../Common.ts";

// The dimension of the fourier grid, i.e., the sqrt of the number of unique waves for our discrete fourier transform
const GRAVITY = 9.8;
const WAVE_PERIOD_SECONDS = 100.0;

const GAUSSIAN_NOISE_FORMAT: GPUTextureFormat = "rg32float";

const INITIAL_AMPLITUDE_FORMAT: GPUTextureFormat = "rg32float";
const DISPLACEMENT_FORMAT: GPUTextureFormat = "rgba16float";
const TURBULENCE_JACOBIAN_FORMAT: GPUTextureFormat = "rgba16float";

const FFT_IO_TEXTURE_FORMAT: GPUTextureFormat = "rgba32float";

/**
 * Parameters for the generation of ocean surface waves.
 */
export interface FFTWavesSettings {
	/**
	 * The value of acceleration by gravity in units of meters per second
	 * squared. This is used since gravity is the dominating restorative force
	 * for so-called gravity waves, which tend to be all ocean waves larger than
	 * a couple centimeters.
	 */
	gravity: number;

	/**
	 * The wind speed in meters per second. This increases the energy of the
	 * waves, which increases wave height.
	 */
	windSpeedMetersPerSeconds: number;

	/**
	 * The distance in meters along which the wind has been blowing without
	 * significantly changing direction. This represents an accumulation of
	 * energy from wind, and higher values of fetch lead to a more "developed"
	 * ocean surface. With high fetch, even low wind speeds can create visible
	 * waves.
	 */
	windFetchMeters: number;

	/**
	 * A unit-less parameter on the interval [0,1]. Swell describes the wide,
	 * parallel waves of a resonant frequency that dominate the ocean across a
	 * long fetch. Higher values increase the height of these dominating waves.
	 */
	waveSwell: number;
}

const CASCADE_CAPACITY = 4;
const SIZEOF_CASCADE_UBO = 4;
interface CascadeUBO {
	wave_number_min_max: Vec2;
	wave_patch_extent_meters: number;
	padding0: number;
}

class FourierWavesUBO extends UBO {
	public readonly data: {
		fourier_grid_size: number;
		gravity: number;
		padding0: number;
		wave_period_seconds: number;

		wind_speed_meters_per_second: number;
		wind_fetch_meters: number;
		wave_swell: number;
		padding1: number;

		cascades: CascadeUBO[];
	} = {
		fourier_grid_size: 1,
		gravity: GRAVITY,
		padding0: 0.0,
		wave_period_seconds: WAVE_PERIOD_SECONDS,

		wind_speed_meters_per_second: 10.0,
		wind_fetch_meters: 10.0 * 1000.0,
		wave_swell: 0.3,
		padding1: 0,

		cascades: new Array<CascadeUBO>(4),
	};

	constructor(device: GPUDevice) {
		super(
			device,
			8 + CASCADE_CAPACITY * SIZEOF_CASCADE_UBO,
			"Fourier Waves UBO"
		);
	}

	protected override packed(): DataView<ArrayBuffer> {
		const buffer = new ArrayBuffer(this.buffer.size);
		const view = new DataView(buffer);
		const float32View = new Float32Array(buffer);

		view.setUint32(0, this.data.fourier_grid_size, true);
		view.setFloat32(4, this.data.gravity, true);
		view.setFloat32(8, this.data.padding0, true);
		view.setFloat32(12, this.data.wave_period_seconds, true);

		view.setFloat32(16, this.data.wind_speed_meters_per_second, true);
		view.setFloat32(20, this.data.wind_fetch_meters, true);
		view.setFloat32(24, this.data.wave_swell, true);
		view.setFloat32(28, this.data.padding1, true);

		const CASCADES_FLOAT32_OFFSET = 8;
		this.data.cascades.forEach((data, index) => {
			const baseOffset =
				CASCADES_FLOAT32_OFFSET + index * SIZEOF_CASCADE_UBO;
			float32View.set(data.wave_number_min_max, baseOffset);
			float32View[baseOffset + 2] = data.wave_patch_extent_meters;
			float32View[baseOffset + 3] = 0.0;
		});

		return view;
	}
}

/*
 * Box-Muller transform two uniform random numbers to gaussian pair. The two
 * values returned are dependent, and should not be used directly as two
 * independent values
 */
function randGaussian2DBoxMuller(): [number, number] {
	// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform

	const u_0 = Math.random();
	const u_1 = Math.random();

	const amplitude = Math.sqrt(-2.0 * Math.log(u_0));
	const theta = 2.0 * Math.PI * u_1;

	const z_0 = amplitude * Math.cos(theta);
	const z_1 = amplitude * Math.sin(theta);

	return [z_0, z_1];
}

/**
 * Internal textures that can be exposed for rendering to the screen for
 * purposes of exploration, demonstration, or debug. See {@link TODO} for
 * explanations on what each texture represents.
 */
export interface FFTWaveSpectrumRenderables {
	gaussianNoise: RenderOutputTexture;
	initialAmplitude: RenderOutputTexture;
	packed_Dx_plus_iDy_Dz_iDxdz_Amplitude: RenderOutputTexture;
	packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude: RenderOutputTexture;
	turbulenceJacobian: RenderOutputTexture;
	Dx_Dy_Dz_Dxdz_Spatial: RenderOutputTexture;
	Dydx_Dydz_Dxdx_Dzdz_Spatial: RenderOutputTexture;
}

/**
 * The final spatial displacement/displacement derivative maps that can be
 * consumed to generate ocean surface vertices and normal maps.
 */
export class FFTWaveDisplacementMaps {
	private Dx_Dy_Dz_Dxdz_Spatial: GPUTexture;
	private Dydx_Dydz_Dxdx_Dzdz_Spatial: GPUTexture;
	private turbulenceJacobian: GPUTexture[];

	/**
	 * The number of mip levels for every map in this collection.
	 * @readonly
	 */
	get mipLevelCount(): number {
		return this.Dx_Dy_Dz_Dxdz_Spatial.mipLevelCount;
	}

	/**
	 * Contains `(Dx,Dy,Dz,d/dz Dx)` packed in RGBA, where `(Dx,Dy,Dz)` is the
	 * displacement of the ocean surface at the sampled point and `d/di` is the
	 * partial derivative with respect to coordinate `i`. The dimension is
	 * `2d-array`, and each array layer represents one cascade.
	 * @readonly
	 */
	readonly Dx_Dy_Dz_Dxdz_SpatialAllMips: GPUTextureView;
	/**
	 * Contains `(d/dx Dy,d/dz Dy,d/dx Dx,d/dz Dz)` packed in RGBA, where
	 * `(Dx,Dy,Dz)` is the displacement of the ocean surface at the sampled
	 * point and `d/di` is the partial derivative with respect to coordinate
	 * `i`. The dimension is `2d-array`, and each array layer represents one
	 * cascade.
	 */
	readonly Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips: GPUTextureView;
	/**
	 * Contains (turbulence, jacobian, 0, 0) packed in RGBA. The jacobian is a
	 * value derived from the surface derivatives. Turbulence is an arbitrary
	 * derived value on the interval [0,1], where 1 represents a calm surface
	 * and 0 represents a turbulent surface. Turbulence is accumulated between
	 * frames and is a good source for how much foam to render at a position.
	 * The elements of the javascript array are identically defined, but rotated
	 * each frame.
	 * @see {@link FFTWaveSpectrumResources.turbulenceMapIndex} for
	 * which index is active.
	 */
	readonly turbulenceJacobianOneMip: GPUTextureView[];

	constructor(
		Dx_Dy_Dz_Dxdz_Spatial: GPUTexture,
		Dydx_Dydz_Dxdx_Dzdz_Spatial: GPUTexture,
		turbulenceJacobian: GPUTexture[]
	) {
		if (
			Dx_Dy_Dz_Dxdz_Spatial.mipLevelCount !=
			Dydx_Dydz_Dxdx_Dzdz_Spatial.mipLevelCount
		) {
			console.warn(
				`FFT Wave Displacement maps do not have identical mip levels. ${Dx_Dy_Dz_Dxdz_Spatial.mipLevelCount} vs ${Dydx_Dydz_Dxdx_Dzdz_Spatial.mipLevelCount}`
			);
		}

		this.Dx_Dy_Dz_Dxdz_Spatial = Dx_Dy_Dz_Dxdz_Spatial;
		this.Dydx_Dydz_Dxdx_Dzdz_Spatial = Dydx_Dydz_Dxdx_Dzdz_Spatial;
		this.turbulenceJacobian = turbulenceJacobian;

		this.Dx_Dy_Dz_Dxdz_SpatialAllMips =
			this.Dx_Dy_Dz_Dxdz_Spatial.createView({
				label: `FFT Wave DisplacementMaps for ${this.Dx_Dy_Dz_Dxdz_Spatial.label}`,
			});
		this.Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips =
			this.Dydx_Dydz_Dxdx_Dzdz_Spatial.createView({
				label: `FFT Wave DisplacementMaps for ${this.Dydx_Dydz_Dxdx_Dzdz_Spatial.label}`,
			});
		this.turbulenceJacobianOneMip = this.turbulenceJacobian.map(
			(texture, index) =>
				texture.createView({
					label: `FFT Wave DisplacementMaps for ${this.turbulenceJacobian[index].label} index ${index}`,
				})
		);
	}
}

interface FFTWaveCascades {
	gaussianNoiseArray: GPUTexture;
	initialAmplitudeArray: GPUTexture;

	waveSettings: FourierWavesUBO;

	/*
	 * @group(0) @binding(0) var out_initial_amplitude: texture_storage_2d_array<rg32float, write>;
	 * @group(0) @binding(1) var in_gaussian_random_pairs: texture_2d_array<f32>;
	 *
	 * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
	 * @group(1) @binding(1) var<uniform> u_fourier_waves: FourierWavesUBO;
	 */
	initialAmplitudeGroup0: GPUBindGroup;
	initialAmplitudeGroup1: GPUBindGroup;

	/*
	 * Since we know the result is a real value, we can pack two fourier
	 * transforms into the space of one by multiplying one by i, the imaginary
	 * unit.
	 * Ordered such that the real-valued results are in the component-order consumed by the ocean surface displacement passes.
	 */
	packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray: GPUTexture;
	packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray: GPUTexture;

	/*
	 * @group(0) @binding(0) var out_packed_Dx_plus_iDy_Dz_iDxdz_amplitude: texture_storage_2d_array<rgba32float, write>;
	 * @group(0) @binding(1) var out_packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_amplitude: texture_storage_2d_array<rgba32float, write>;
	 * @group(0) @binding(2) var in_initial_amplitude: texture_2d_array<f32>;
	 *
	 * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
	 * @group(1) @binding(1) var<uniform> u_fourier_waves: FourierWavesUBO;
	 */
	timeDependentAmplitudeGroup0: GPUBindGroup;
	timeDependentAmplitudeGroup1: GPUBindGroup;
}

interface TurbulenceJacobianEntry {
	textureArray: GPUTexture;
	bindGroup: GPUBindGroup;
	mipMapBindings: MipMapGenerationTextureBindings;
}

/**
 * Produce a spectrum of ocean waves on a square grid, using the fourier
 * transform to transform from frequency to space, to produce displacement and
 * gradient maps that can be applied to an ocean surface mesh.
 */
export class FFTWaveSpectrumResources {
	/*
	 * We produce a discrete spectrum of waves, for which the various values
	 * will be stored in square textures. This dimension determines the diameter
	 * of that square, so the total number of frequencies we produce. Our
	 * spectrum is discrete so we can apply an IDFT algorithm to determine the
	 * displacement when rendering the sums of these waves. (x,z) position in
	 * this grid uniquely identifies a wave with wave vector k = (k_x,k_z)
	 */
	private gridSize: number;
	private cascadeCount: number;

	/**
	 * The extent used by every texture parameterized by the fourier grid.
	 */
	private get textureGridSize(): Extent3D {
		return {
			width: this.gridSize,
			height: this.gridSize,
			depthOrArrayLayers: this.cascadeCount,
		};
	}

	private initialAmplitudeKernel: GPUComputePipeline;
	private timeDependentAmplitudeKernel: GPUComputePipeline;
	private accumulateTurbulenceKernel: GPUComputePipeline;

	private dfftResources: DFFTResources;

	private mipMapGenerator: MipMapGenerationPassResources;

	private cascades: FFTWaveCascades;

	/*
	 * Final output maps that store the results of the FFT.
	 * Is mipmapped and has array layers, one layer for each cascade.
	 */
	private Dx_Dy_Dz_Dxdz_SpatialArray: GPUTexture;
	private Dydx_Dydz_Dxdx_Dzdz_SpatialArray: GPUTexture;

	/*
	 * Array layer N contains the jacobian computed from layers 1 through N.
	 * Each layer is a cascade, so it is done this way in case we only sample the lower cascades.
	 * We do not want the turbulence from higher cascades to affect the lower cascades.
	 *
	 * We need two storage textures since we cannot natively have read_write storage. They are swapped out each frame.
	 */

	private turbulenceJacobianArrays: TurbulenceJacobianEntry[];
	private turbulenceJacobianGroup1: GPUBindGroup;
	private turbulenceJacobianIndex = 0;

	/**
	 * Gets the index of the turbulence-jacobian map that will be (or was)
	 * written into this frame.
	 * @readonly
	 */
	public get turbulenceMapIndex(): number {
		return this.turbulenceJacobianIndex;
	}

	private Dx_Dy_Dz_Dxdz_SpatialArray_MipMapBindings: MipMapGenerationTextureBindings;
	private Dydx_Dydz_Dxdx_Dzdz_SpatialArray_MipMapBindings: MipMapGenerationTextureBindings;

	private waveSettings: FFTWavesSettings;

	private createCascades(
		device: GPUDevice,
		globalUBO: GlobalUBO,
		fourierGridSize: number,
		cascadeParameters: {
			patchExtentMeters: number;
			waveNumberMinMax: [number, number];
		}[]
	): FFTWaveCascades {
		const textureExtent = this.textureGridSize;
		const textureTexelCount =
			textureExtent.width *
			textureExtent.height *
			textureExtent.depthOrArrayLayers;

		const gaussianNoiseArray = device.createTexture({
			label: "FFT Wave Gaussian Noise",
			format: GAUSSIAN_NOISE_FORMAT,
			size: textureExtent,
			usage:
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING,
		});

		const FLOAT32_PER_GAUSSIAN_NOISE_TEXEL = 2;
		const BYTES_PER_TEXEL = 8;
		const randomNumbers = new Float32Array(
			textureTexelCount * FLOAT32_PER_GAUSSIAN_NOISE_TEXEL
		);
		for (let i = 0; i < randomNumbers.length; i++) {
			randomNumbers[i] = randGaussian2DBoxMuller()[0];
		}

		device.queue.writeTexture(
			{ texture: gaussianNoiseArray },
			randomNumbers,
			{
				bytesPerRow: BYTES_PER_TEXEL * textureExtent.width,
				rowsPerImage: textureExtent.height,
			},
			textureExtent
		);

		const waveSettings = new FourierWavesUBO(device);
		waveSettings.data.fourier_grid_size = fourierGridSize;
		cascadeParameters.forEach((value, index) => {
			waveSettings.data.cascades[index] = {
				wave_number_min_max: vec2.create(...value.waveNumberMinMax),
				wave_patch_extent_meters: value.patchExtentMeters,
				padding0: 0.0,
			};
		});
		waveSettings.writeToGPU(device.queue);

		const initialAmplitudeArray = device.createTexture({
			label: "FFT Wave Fourier Amplitude h_0(k)",
			format: INITIAL_AMPLITUDE_FORMAT,
			size: textureExtent,
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING,
		});

		const initialAmplitudeGroup0 = device.createBindGroup({
			label: "FFT Wave Initial Amplitude h_0(k) Group 0",
			layout: this.initialAmplitudeKernel.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: initialAmplitudeArray.createView(),
				},
				{
					binding: 1,
					resource: gaussianNoiseArray.createView(),
				},
			],
		});

		const initialAmplitudeGroup1 = device.createBindGroup({
			label: "FFT Wave Initial Amplitude h_0(k) Group 1",
			layout: this.initialAmplitudeKernel.getBindGroupLayout(1),
			entries: [
				{
					binding: 0,
					resource: { buffer: globalUBO.buffer },
				},
				{
					binding: 1,
					resource: { buffer: waveSettings.buffer },
				},
			],
		});

		const packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray = device.createTexture(
			{
				label: "FFT Wave Packed (Dx + iDy, Dz + iDxdz) Amplitude",
				format: FFT_IO_TEXTURE_FORMAT,
				size: textureExtent,
				usage:
					GPUTextureUsage.STORAGE_BINDING |
					GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.COPY_SRC,
			}
		);
		const packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray =
			device.createTexture({
				label: "FFT Wave Packed (Dydx + iDydz, Dxdx + iDzdz) Amplitude",
				format: packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray.format,
				size: textureExtent,
				usage: packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray.usage,
			});

		const timeDependentAmplitudeGroup0 = device.createBindGroup({
			label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 0",
			layout: this.timeDependentAmplitudeKernel.getBindGroupLayout(0),
			entries: [
				{
					binding: 2,
					resource:
						packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray.createView(),
				},
				{
					binding: 3,
					resource:
						packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray.createView(),
				},
				{
					binding: 4,
					resource: initialAmplitudeArray.createView(),
				},
			],
		});

		const timeDependentAmplitudeGroup1 = device.createBindGroup({
			label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 1",
			layout: this.timeDependentAmplitudeKernel.getBindGroupLayout(1),
			entries: [
				{
					binding: 0,
					resource: { buffer: globalUBO.buffer },
				},
				{
					binding: 1,
					resource: { buffer: waveSettings.buffer },
				},
			],
		});

		return {
			gaussianNoiseArray: gaussianNoiseArray,
			initialAmplitudeArray: initialAmplitudeArray,
			waveSettings: waveSettings,
			initialAmplitudeGroup0: initialAmplitudeGroup0,
			initialAmplitudeGroup1: initialAmplitudeGroup1,
			packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray:
				packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray,
			packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray:
				packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray,
			timeDependentAmplitudeGroup0: timeDependentAmplitudeGroup0,
			timeDependentAmplitudeGroup1: timeDependentAmplitudeGroup1,
		};
	}

	/**
	 * Instantiates all the cascades and resources.
	 * @param device - The WebGPU device to use.
	 * @param globalUBO - The global UBO that will be bound into
	 * 	pipelines.
	 */
	constructor(device: GPUDevice, globalUBO: GlobalUBO, log2GridSize: number) {
		this.gridSize = Math.pow(2, log2GridSize);

		const initialAmplitudeGroup0Layout = device.createBindGroupLayout({
			label: "FFT Wave Initial Amplitude h_0(k) Group 0",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					storageTexture: {
						format: INITIAL_AMPLITUDE_FORMAT,
						viewDimension: "2d-array",
						access: "write-only",
					},
				},
				{
					binding: 1,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						sampleType: "unfilterable-float",
						viewDimension: "2d-array",
					},
				},
			],
		});

		const initialAmplitudeGroup1Layout = device.createBindGroupLayout({
			label: "FFT Wave Initial Amplitude h_0(k) Group 1",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {
						type: "uniform",
					},
				},
				{
					binding: 1,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {
						type: "uniform",
					},
				},
			],
		});

		const shaderModule = device.createShaderModule({
			label: "FFT Wave",
			code: FourierWavesShaderPak,
		});

		this.initialAmplitudeKernel = device.createComputePipeline({
			label: "FFT Wave Initial Amplitude h_0(k)",
			layout: device.createPipelineLayout({
				label: "FFT Wave Initial Amplitude h_0(k)",
				bindGroupLayouts: [
					initialAmplitudeGroup0Layout,
					initialAmplitudeGroup1Layout,
				],
			}),
			compute: {
				module: shaderModule,
				entryPoint: "computeInitialAmplitude",
			},
		});

		this.mipMapGenerator = new MipMapGenerationPassResources(device);

		const timeDependentAmplitudeGroup0Layout = device.createBindGroupLayout(
			{
				label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 0",
				entries: [
					{
						binding: 2,
						visibility: GPUShaderStage.COMPUTE,
						storageTexture: {
							format: FFT_IO_TEXTURE_FORMAT,
							viewDimension: "2d-array",
							access: "write-only",
						},
					},
					{
						binding: 3,
						visibility: GPUShaderStage.COMPUTE,
						storageTexture: {
							format: FFT_IO_TEXTURE_FORMAT,
							viewDimension: "2d-array",
							access: "write-only",
						},
					},
					{
						binding: 4,
						visibility: GPUShaderStage.COMPUTE,
						texture: {
							sampleType: "unfilterable-float",
							viewDimension: "2d-array",
						},
					},
				],
			}
		);

		const timeDependentAmplitudeGroup1Layout = device.createBindGroupLayout(
			{
				label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 1",
				entries: [
					{
						binding: 0,
						visibility: GPUShaderStage.COMPUTE,
						buffer: { type: "uniform" },
					},
					{
						binding: 1,
						visibility: GPUShaderStage.COMPUTE,
						buffer: { type: "uniform" },
					},
				],
			}
		);

		this.timeDependentAmplitudeKernel = device.createComputePipeline({
			label: "FFT Wave Time Dependent Fourier Amplitude h(k,t)",
			layout: device.createPipelineLayout({
				label: "FFT Wave Time Dependent Fourier Amplitude h(k,t)",
				bindGroupLayouts: [
					timeDependentAmplitudeGroup0Layout,
					timeDependentAmplitudeGroup1Layout,
				],
			}),
			compute: {
				module: shaderModule,
				entryPoint: "computeTimeDependentAmplitude",
			},
		});

		const accumulateTurbulenceGroup0Layout = device.createBindGroupLayout({
			label: "FFT Wave Accumulate Turbulence Group 0",
			entries: [
				{
					binding: 5,
					visibility: GPUShaderStage.COMPUTE,
					storageTexture: {
						viewDimension: "2d-array",
						format: TURBULENCE_JACOBIAN_FORMAT,
					},
				},
				{
					binding: 6,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						viewDimension: "2d-array",
						sampleType: "unfilterable-float",
					},
				},
				{
					binding: 7,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						viewDimension: "2d-array",
						sampleType: "unfilterable-float",
					},
				},
				{
					binding: 8,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						viewDimension: "2d-array",
						sampleType: "unfilterable-float",
					},
				},
			],
		});

		const accumulateTurbulenceGroup1Layout = device.createBindGroupLayout({
			label: "FFT Wave Accumulate Turbulence Group 1",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "uniform" },
				},
			],
		});

		this.accumulateTurbulenceKernel = device.createComputePipeline({
			label: "FFT Wave Accumulate Turbulence",
			layout: device.createPipelineLayout({
				label: "FFT Wave Accumulate Turbulence",
				bindGroupLayouts: [
					accumulateTurbulenceGroup0Layout,
					accumulateTurbulenceGroup1Layout,
				],
			}),
			compute: {
				module: shaderModule,
				entryPoint: "accumulateTurbulence",
			},
		});

		function nyquistWaveNumber(spatialSampleDistance: number): number {
			const wavelength = 2.0 * spatialSampleDistance;
			return (2.0 * Math.PI) / wavelength;
		}

		const WAVE_PATCH_SIZES = [200.0, 50.0, 10.0];
		const WAVE_NUMBER_FENCE_POSTS: number[] = [
			0.001,
			...WAVE_PATCH_SIZES.map((value) =>
				nyquistWaveNumber(value / this.gridSize)
			),
			1000.0,
		];

		const CASCADE_PARAMETERS: {
			patchExtentMeters: number;
			waveNumberMinMax: [number, number];
		}[] = WAVE_PATCH_SIZES.map((value, index) => {
			return {
				patchExtentMeters: value,
				waveNumberMinMax: [
					WAVE_NUMBER_FENCE_POSTS[index],
					WAVE_NUMBER_FENCE_POSTS[index + 1],
				],
			};
		});

		this.cascadeCount = CASCADE_PARAMETERS.length;

		this.dfftResources = new DFFTResources(
			device,
			log2GridSize,
			this.cascadeCount
		);

		this.Dx_Dy_Dz_Dxdz_SpatialArray = device.createTexture({
			label: "FFT Wave Final Displacement Array",
			format: DISPLACEMENT_FORMAT,
			dimension: "2d",
			size: this.textureGridSize,
			mipLevelCount: log2GridSize,
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_SRC |
				GPUTextureUsage.COPY_DST,
		});
		this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray = device.createTexture({
			label: "FFT Wave Final Derivatives Array",
			format: this.Dx_Dy_Dz_Dxdz_SpatialArray.format,
			size: this.textureGridSize,
			mipLevelCount: this.Dx_Dy_Dz_Dxdz_SpatialArray.mipLevelCount,
			usage: this.Dx_Dy_Dz_Dxdz_SpatialArray.usage,
		});

		this.cascades = this.createCascades(
			device,
			globalUBO,
			this.gridSize,
			CASCADE_PARAMETERS
		);

		// We need to fill rgba16float buffer with 1.0, there may be a better way
		const ONE_IN_FLOAT16_AS_UINT = 15360;
		const textureTexelCount =
			this.textureGridSize.width *
			this.textureGridSize.height *
			this.textureGridSize.depthOrArrayLayers;

		const turbulenceJacobianInitialBuffer = new Uint16Array(
			textureTexelCount * 4
		).fill(ONE_IN_FLOAT16_AS_UINT);

		this.turbulenceJacobianArrays = [0, 0]
			.map((_value, index) => {
				return device.createTexture({
					label: `FFT Wave (Turbulence,Jacobian) Array ${index}`,
					format: TURBULENCE_JACOBIAN_FORMAT,
					size: this.textureGridSize,
					mipLevelCount: log2GridSize,
					usage:
						GPUTextureUsage.STORAGE_BINDING | // write to
						GPUTextureUsage.TEXTURE_BINDING | // read from to accumulate turbulence
						GPUTextureUsage.COPY_SRC | // mip map generation
						GPUTextureUsage.COPY_DST, // initialize/wipe turbulence to 1.0
				});
			})
			.reduce<TurbulenceJacobianEntry[]>(
				(accumulatedEntries, texture, index, textures) => {
					device.queue.writeTexture(
						{ texture: texture },
						turbulenceJacobianInitialBuffer,
						{
							bytesPerRow:
								this.Dx_Dy_Dz_Dxdz_SpatialArray.width * 8,
							rowsPerImage:
								this.Dx_Dy_Dz_Dxdz_SpatialArray.height,
						},
						this.textureGridSize
					);

					const bindGroup = device.createBindGroup({
						layout: this.accumulateTurbulenceKernel.getBindGroupLayout(
							0
						),
						entries: [
							{
								binding: 5,
								resource: texture.createView({
									mipLevelCount: 1,
								}),
							},
							{
								binding: 6,
								resource: textures[
									(index + 1) % textures.length
								].createView({}),
							},
							{
								binding: 7,
								resource:
									this.Dx_Dy_Dz_Dxdz_SpatialArray.createView(
										{}
									),
							},
							{
								binding: 8,
								resource:
									this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray.createView(
										{}
									),
							},
						],
					});

					return accumulatedEntries.concat({
						textureArray: texture,
						bindGroup: bindGroup,
						mipMapBindings: this.mipMapGenerator.createBindGroups(
							device,
							texture
						),
					});
				},
				[]
			);
		this.turbulenceJacobianGroup1 = device.createBindGroup({
			label: "FFT Wave Accumulate Turbulence Group 1",
			layout: this.accumulateTurbulenceKernel.getBindGroupLayout(1),
			entries: [
				{
					binding: 0,
					resource: { buffer: globalUBO.buffer },
				},
			],
		});

		this.Dx_Dy_Dz_Dxdz_SpatialArray_MipMapBindings =
			this.mipMapGenerator.createBindGroups(
				device,
				this.Dx_Dy_Dz_Dxdz_SpatialArray
			);
		this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray_MipMapBindings =
			this.mipMapGenerator.createBindGroups(
				device,
				this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray
			);

		this.waveSettings = {
			gravity: 0.0,
			waveSwell: 0.0,
			windFetchMeters: 0.0,
			windSpeedMetersPerSeconds: 0.0,
		};
	}

	/**
	 * @returns The views into all the FFT Wave textures, for read-only display
	 *  purposes.
	 */
	views(): FFTWaveSpectrumRenderables {
		return {
			gaussianNoise: new RenderOutputTexture(
				this.cascades.gaussianNoiseArray
			),
			initialAmplitude: new RenderOutputTexture(
				this.cascades.initialAmplitudeArray
			),
			packed_Dx_plus_iDy_Dz_iDxdz_Amplitude: new RenderOutputTexture(
				this.cascades.packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray
			),
			packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude:
				new RenderOutputTexture(
					this.cascades.packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray
				),
			turbulenceJacobian: new RenderOutputTexture(
				this.turbulenceJacobianArrays[0].textureArray
			),
			Dx_Dy_Dz_Dxdz_Spatial: new RenderOutputTexture(
				this.Dx_Dy_Dz_Dxdz_SpatialArray
			),
			Dydx_Dydz_Dxdx_Dzdz_Spatial: new RenderOutputTexture(
				this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray
			),
		};
	}

	/**
	 * @returns The views into the displacement maps that are the output of the
	 *  ocean spectrum.
	 */
	displacementMaps(): FFTWaveDisplacementMaps {
		return new FFTWaveDisplacementMaps(
			this.Dx_Dy_Dz_Dxdz_SpatialArray,
			this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray,
			this.turbulenceJacobianArrays.map((value) => value.textureArray)
		);
	}

	/**
	 * Records the commands that fill the persistent displacement maps returned
	 * by {@link displacementMaps}.
	 * @param device - The WebGPU device to use.
	 * @param commandEncoder - The command encoder to record into.
	 * @param settings - The parameters for the wave spectrum, determine the
	 *  shape and amplitude of the waves.
	 * @param timestampInterval - The interval to record timing information
	 *  into.
	 */
	record(
		device: GPUDevice,
		commandEncoder: GPUCommandEncoder,
		settings: FFTWavesSettings,
		timestampInterval: TimestampQueryInterval | undefined
	): void {
		const settingsChanged =
			settings.gravity != this.waveSettings.gravity ||
			settings.waveSwell != this.waveSettings.waveSwell ||
			settings.windSpeedMetersPerSeconds !=
				this.waveSettings.windSpeedMetersPerSeconds ||
			settings.windFetchMeters != this.waveSettings.windFetchMeters;

		if (settingsChanged) {
			this.waveSettings = structuredClone(settings);

			const passEncoder = commandEncoder.beginComputePass({
				label: "FFT Wave Initial Amplitude",
			});

			const settingsUBO = this.cascades.waveSettings;

			settingsUBO.data.wave_swell = this.waveSettings.waveSwell;
			settingsUBO.data.wind_fetch_meters =
				this.waveSettings.windFetchMeters;
			settingsUBO.data.wind_speed_meters_per_second =
				this.waveSettings.windSpeedMetersPerSeconds;
			settingsUBO.data.gravity = this.waveSettings.gravity;

			settingsUBO.writeToGPU(device.queue);

			passEncoder.setPipeline(this.initialAmplitudeKernel);
			passEncoder.setBindGroup(0, this.cascades.initialAmplitudeGroup0);
			passEncoder.setBindGroup(1, this.cascades.initialAmplitudeGroup1);

			const dispatchSize = this.textureGridSize;

			passEncoder.dispatchWorkgroups(
				dispatchSize.width / 16,
				dispatchSize.height / 16,
				dispatchSize.depthOrArrayLayers / 1
			);

			passEncoder.end();
		}

		{
			const realizePassEncoder = commandEncoder.beginComputePass({
				label: "FFT Wave Fourier Amplitude Realization",
				timestampWrites:
					timestampInterval !== undefined
						? {
								querySet: timestampInterval.querySet,
								beginningOfPassWriteIndex:
									timestampInterval.beginWriteIndex,
						  }
						: undefined,
			});

			realizePassEncoder.setPipeline(this.timeDependentAmplitudeKernel);
			realizePassEncoder.setBindGroup(
				0,
				this.cascades.timeDependentAmplitudeGroup0
			);
			realizePassEncoder.setBindGroup(
				1,
				this.cascades.timeDependentAmplitudeGroup1
			);

			const dispatchSize = this.textureGridSize;

			realizePassEncoder.dispatchWorkgroups(
				dispatchSize.width / 16,
				dispatchSize.height / 16,
				dispatchSize.depthOrArrayLayers / 1
			);

			realizePassEncoder.end();
		}

		this.dfftResources.recordPerform(
			device,
			commandEncoder,
			this.cascades.packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray,
			this.Dx_Dy_Dz_Dxdz_SpatialArray,
			true,
			undefined
		);
		this.dfftResources.recordPerform(
			device,
			commandEncoder,
			this.cascades.packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray,
			this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray,
			true,
			undefined
		);

		const accumulateTurbulencePass = commandEncoder.beginComputePass({
			label: "Turbulence Accumulation",
		});
		accumulateTurbulencePass.setPipeline(this.accumulateTurbulenceKernel);
		accumulateTurbulencePass.setBindGroup(
			0,
			this.turbulenceJacobianArrays[this.turbulenceJacobianIndex]
				.bindGroup
		);
		accumulateTurbulencePass.setBindGroup(1, this.turbulenceJacobianGroup1);

		accumulateTurbulencePass.dispatchWorkgroups(
			this.gridSize / 16,
			this.gridSize / 16,
			this.cascadeCount / 1
		);

		accumulateTurbulencePass.end();

		const fillMipMapsPass = commandEncoder.beginComputePass({
			label: `MipMap Generation`,
			timestampWrites:
				timestampInterval !== undefined
					? {
							querySet: timestampInterval.querySet,
							endOfPassWriteIndex:
								timestampInterval.endWriteIndex,
					  }
					: undefined,
		});

		this.mipMapGenerator.recordUpdateMipMaps(
			fillMipMapsPass,
			this.Dx_Dy_Dz_Dxdz_SpatialArray_MipMapBindings
		);
		this.mipMapGenerator.recordUpdateMipMaps(
			fillMipMapsPass,
			this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray_MipMapBindings
		);

		this.mipMapGenerator.recordUpdateMipMaps(
			fillMipMapsPass,
			this.turbulenceJacobianArrays[this.turbulenceJacobianIndex]
				.mipMapBindings
		);
		this.turbulenceJacobianIndex += 1;
		this.turbulenceJacobianIndex %= this.turbulenceJacobianArrays.length;

		fillMipMapsPass.end();
	}
}
