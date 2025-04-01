import { GlobalUBO } from "../GlobalUBO.ts";
import AerialPerspectiveLUTPak from "../../../shaders/sky-sea/atmosphere/aerial_perspective_LUT.wgsl";
import { TimestampQueryInterval } from "../PerformanceTracker.ts";

const AERIAL_PERSPECTIVE_LUT_FORMAT: GPUTextureFormat = "rgba16float";

/**
 * Contains the resources for the creation of a lookup table for atmospheric
 * scattering reaching a fixed position, calculated with no obstructions or
 * geometry.
 * - The LUT is an array, where each layer represents an incremental increase in
 *   the distance that scattering is calculated over.
 * - The LUT is parameterized by azimuth and zenith of the outgoing view ray.
 */
export class AerialPerspectiveLUTPassResources {
	/**
	 * The aerial perspective lookup table texture.
	 */
	public readonly texture: GPUTexture;

	/**
	 * The view into {@link texture}.
	 */
	public readonly view: GPUTextureView;

	/*
	 * @group(0) @binding(0) var aerial_perspective_lut: texture_storage_3d<rgba16float, write>;
	 * @group(0) @binding(1) var lut_sampler: sampler;
	 * @group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
	 * @group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
	 *
	 * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
	 */
	private group0: GPUBindGroup;
	private group1: GPUBindGroup;

	private pipeline: GPUComputePipeline;

	/**
	 * Initializes all resources related to the aerial perspective lookup table.
	 * @param device - The WebGPU device to use.
	 * @param dimensions - The dimensions to use for the LUT. This increases the
	 *  fidelity and detail captured. Generally, a low value like 32 x 32 x 32
	 *  is good enough.
	 * @param transmittanceLUT - A view into the transmittance LUT that will be
	 *  used.
	 * @param multiscatterLUT - A view into the multiscatter LUT that will be
	 *  used.
	 * @param filterableLUT - Whether or not the passed LUTs are filterable by
	 *  samples. This is a consideration since the LUTs are 32-bit floats per
	 *  channel, and filtering such textures is not supported on all WebGPU
	 *  instances.
	 * @param globalUBO - The global UBO to bind and use when rendering the LUT.
	 */
	constructor(
		device: GPUDevice,
		dimensions: GPUExtent3DDictStrict,
		transmittanceLUT: GPUTextureView,
		multiscatterLUT: GPUTextureView,
		filterableLUT: boolean,
		globalUBO: GlobalUBO
	) {
		this.texture = device.createTexture({
			size: dimensions,
			dimension: "3d",
			format: AERIAL_PERSPECTIVE_LUT_FORMAT,
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING,
			label: "Aerial Perspective LUT",
		});
		this.view = this.texture.createView({
			label: this.texture.label,
			dimension: "3d",
		});

		const bindGroup0Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					storageTexture: {
						access: "write-only",
						viewDimension: "3d",
						format: AERIAL_PERSPECTIVE_LUT_FORMAT,
					},
				},
				{
					binding: 1,
					visibility: GPUShaderStage.COMPUTE,
					sampler: {
						type: filterableLUT ? "filtering" : "non-filtering",
					},
				},
				{
					binding: 2,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						sampleType: filterableLUT
							? "float"
							: "unfilterable-float",
					},
				},
				{
					binding: 3,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						sampleType: filterableLUT
							? "float"
							: "unfilterable-float",
					},
				},
			],
			label: "Aerial Perspective LUT",
		});

		this.group0 = device.createBindGroup({
			layout: bindGroup0Layout,
			entries: [
				{
					binding: 0,
					resource: this.view,
				},
				{
					binding: 1,
					resource: device.createSampler({
						magFilter: filterableLUT ? "linear" : "nearest",
						minFilter: filterableLUT ? "linear" : "nearest",
					}),
				},
				{
					binding: 2,
					resource: transmittanceLUT,
				},
				{
					binding: 3,
					resource: multiscatterLUT,
				},
			],
			label: "Aerial Perspective LUT Group 0",
		});

		const bindGroup1Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {},
				},
			],
			label: "Aerial Perspective LUT Group 1",
		});

		this.group1 = device.createBindGroup({
			layout: bindGroup1Layout,
			entries: [
				{
					binding: 0,
					resource: { buffer: globalUBO.buffer },
				},
			],
			label: "Aerial Perspective LUT Group 1",
		});

		const shaderModule = device.createShaderModule({
			code: AerialPerspectiveLUTPak,
		});

		this.pipeline = device.createComputePipeline({
			compute: {
				module: shaderModule,
				entryPoint: "computeAerialPerspective",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [bindGroup0Layout, bindGroup1Layout],
			}),
			label: "Aerial Perspective LUT",
		});
	}

	/**
	 * Records the population of the lookup table.
	 * @param commandEncoder - The command encoder to record
	 * 	into.
	 * @param timestampInterval - The
	 *  interval to record timing information into.
	 */
	record(
		commandEncoder: GPUCommandEncoder,
		timestampInterval: TimestampQueryInterval | undefined
	): void {
		const aerialPerspectiveLUTPassEncoder = commandEncoder.beginComputePass(
			{
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
				label: "Aerial Perspective LUT",
			}
		);
		aerialPerspectiveLUTPassEncoder.setPipeline(this.pipeline);
		aerialPerspectiveLUTPassEncoder.setBindGroup(0, this.group0);
		aerialPerspectiveLUTPassEncoder.setBindGroup(1, this.group1);
		aerialPerspectiveLUTPassEncoder.dispatchWorkgroups(
			Math.ceil(this.texture.width / 16),
			Math.ceil(this.texture.height / 16),
			Math.ceil(this.texture.depthOrArrayLayers / 1)
		);
		aerialPerspectiveLUTPassEncoder.end();
	}
}
