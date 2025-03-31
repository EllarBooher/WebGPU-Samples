import { Extent2D } from "../Common.ts";
import { GlobalUBO } from "../GlobalUBO.ts";
import MultiscatterLUTPak from "../../../shaders/sky-sea/atmosphere/multiscatter_LUT.wgsl";

const MULTISCATTER_LUT_FORMAT: GPUTextureFormat = "rgba32float";

/**
 * Contains the resources for the creation of a lookup table for multi-scattered
 * spectral RGB inscattering luminance arriving at any given point in the
 * atmosphere. Multi-scattered means that the values in the table are the sum of
 * secondary inscattering, plus tertiary inscattering, and so on.
 */
export class MultiscatterLUTPassResources {
	/**
	 * The multiscatter lookup table texture.
	 */
	public readonly texture: GPUTexture;

	/**
	 * The view into {@link texture}.
	 */
	public readonly view: GPUTextureView;

	/*
	 * @group(0) @binding(0) var multiscatter_lut: texture_storage_2d<rgba32float, write>;
	 * @group(0) @binding(1) var lut_sampler: sampler;
	 * @group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
	 *
	 * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
	 */
	private pipeline: GPUComputePipeline;

	private group0: GPUBindGroup;
	private group1: GPUBindGroup;

	/**
	 * Initializes all resources related to the multiscatter lookup table.
	 * @param device - The WebGPU device to use.
	 * @param dimensions - The dimensions of the LUT texture.
	 * @param transmittanceLUT - The transmittance LUT to bind and read from.
	 * @param filterableLUT - Whether or not the LUTs are filterable.
	 * @param globalUBO - The global UBO to bind and read from.
	 */
	constructor(
		device: GPUDevice,
		dimensions: Extent2D,
		transmittanceLUT: GPUTextureView,
		filterableLUT: boolean,
		globalUBO: GlobalUBO
	) {
		const label = "Multiscatter LUT";
		this.texture = device.createTexture({
			size: dimensions,
			dimension: "2d",
			format: MULTISCATTER_LUT_FORMAT,
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING,
			label: "Multiscatter LUT",
		});
		this.view = this.texture.createView({ label: label });

		const bindGroup0Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					storageTexture: {
						access: "write-only",
						format: MULTISCATTER_LUT_FORMAT,
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
			],
			label: "Multiscatter LUT Group 0",
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
			],
			label: "Multiscatter LUT Group 0",
		});

		const bindGroup1Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {},
				},
			],
			label: "Multiscatter LUT Group 1",
		});

		this.group1 = device.createBindGroup({
			layout: bindGroup1Layout,
			entries: [
				{
					binding: 0,
					resource: { buffer: globalUBO.buffer },
				},
			],
			label: "Multiscatter LUT Group 1",
		});

		const multiscatterLUTShaderModule = device.createShaderModule({
			code: MultiscatterLUTPak,
			label: label,
		});
		this.pipeline = device.createComputePipeline({
			compute: {
				module: multiscatterLUTShaderModule,
				entryPoint: "computeMultiscattering",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [bindGroup0Layout, bindGroup1Layout],
			}),
			label: "Multiscatter LUT",
		});
	}

	record(commandEncoder: GPUCommandEncoder): void {
		const passEncoder = commandEncoder.beginComputePass({
			label: "Multiscatter LUT",
		});
		passEncoder.setPipeline(this.pipeline);
		passEncoder.setBindGroup(0, this.group0);
		passEncoder.setBindGroup(1, this.group1);
		passEncoder.dispatchWorkgroups(
			Math.ceil(this.texture.width / 16),
			Math.ceil(this.texture.height / 16)
		);
		passEncoder.end();
	}
}
