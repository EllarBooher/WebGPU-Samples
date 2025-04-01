import { Extent2D } from "../Common.ts";
import { GlobalUBO } from "../GlobalUBO.ts";
import TransmittanceLUTPak from "../../../shaders/sky-sea/atmosphere/transmittance_LUT.wgsl";

const TRANSMITTANCE_LUT_FORMAT: GPUTextureFormat = "rgba32float";

/**
 * Contains the resources for the creation of a lookup table for atmospheric
 * transmittance from point to upper edge of atmosphere, parameterized by
 * altitude and zenith angle of the querying ray. This LUT only needs to be
 * updated when the atmosphere parameters change.
 */
export class TransmittanceLUTPassResources {
	/**
	 * The transmittance lookup table texture.
	 */
	public readonly texture: GPUTexture;

	/**
	 * The view into {@link texture}.
	 */
	public readonly view: GPUTextureView;

	/*
	 * @group(0) @binding(0) var transmittance_lut: texture_storage_2d<rgba32float, write>;
	 *
	 * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
	 */
	private pipeline: GPUComputePipeline;

	private group0: GPUBindGroup;
	private group1: GPUBindGroup;

	/**
	 * Initializes all resources related to the transmittance lookup table.
	 * @param device - The WebGPU device to use.
	 * @param dimensions - The dimensions to use for the LUT texture.
	 * @param globalUBO - The global UBO to bind and use when
	 * 	rendering the LUT.
	 */
	constructor(device: GPUDevice, dimensions: Extent2D, globalUBO: GlobalUBO) {
		this.texture = device.createTexture({
			size: dimensions,
			dimension: "2d",
			format: TRANSMITTANCE_LUT_FORMAT,
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING,
			label: "Transmittance LUT",
		});
		this.view = this.texture.createView({ label: "Transmittance LUT" });

		const bindGroup0Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					storageTexture: {
						access: "write-only",
						format: this.texture.format,
					},
				},
			],
			label: "Transmittance LUT Group 0",
		});
		const bindGroup1Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {},
				},
			],
			label: "Transmittance LUT Group 1",
		});
		const transmittanceLUTShaderModule = device.createShaderModule({
			code: TransmittanceLUTPak,
			label: "Transmittance LUT",
		});
		this.pipeline = device.createComputePipeline({
			compute: {
				module: transmittanceLUTShaderModule,
				entryPoint: "computeTransmittance",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [bindGroup0Layout, bindGroup1Layout],
			}),
			label: "Transmittance LUT",
		});

		this.group0 = device.createBindGroup({
			layout: this.pipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: this.view,
				},
			],
			label: "Transmittance LUT Group 0",
		});

		this.group1 = device.createBindGroup({
			layout: this.pipeline.getBindGroupLayout(1),
			entries: [
				{
					binding: 0,
					resource: { buffer: globalUBO.buffer },
				},
			],
			label: "Transmittance LUT Group 1",
		});
	}

	/**
	 * Records the population of the lookup table.
	 * @param commandEncoder - The command encoder to record
	 *  into.
	 */
	record(commandEncoder: GPUCommandEncoder): void {
		const passEncoder = commandEncoder.beginComputePass({
			label: "Transmittance LUT",
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
