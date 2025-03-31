import { Extent2D } from "../Common.ts";
import { GlobalUBO } from "../GlobalUBO.ts";
import SkyViewLUTPak from "../../../shaders/sky-sea/atmosphere/skyview_LUT.wgsl";
import { TimestampQueryInterval } from "../PerformanceTracker.ts";

const SKYVIEW_LUT_FORMAT: GPUTextureFormat = "rgba32float";

/**
 * Contains the resources for the creation of a lookup table for all atmospheric
 * scattering reaching a fixed position, calculated with no obstructions or
 * geometry.
 * - This is called the Sky View LUT since this gives the view of the
 *   unobstructed sky from a fixed position.
 * - The LUT is parameterized by azimuth and zenith of the outgoing view ray.
 */
export class SkyViewLUTPassResources {
	texture: GPUTexture;
	view: GPUTextureView;

	/*
	@group(0) @binding(0) var skyview_lut: texture_storage_2d<rgba32float, write>;
	@group(0) @binding(1) var lut_sampler: sampler;
	@group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
	@group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;

	@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
	*/
	group0: GPUBindGroup;
	group1: GPUBindGroup;

	pipeline: GPUComputePipeline;

	/**
	 * Initializes all resources related to the sky view lookup table.
	 * @param device - The WebGPU device to use.
	 * @param dimensions - The dimensions to use for the LUT texture.
	 * @param transmittanceLUT - A view into the transmittance
	 * 	LUT that will be used.
	 * @param multiscatterLUT - A view into the multiscatter
	 * 	LUT that will be used.
	 * @param filterableLUT - Whether or not the passed LUTs are
	 *  filterable by samples. This is a consideration since the LUTs are 32-bit
	 *  floats per channel, and filtering such textures is not supported on all
	 *  WebGPU instances.
	 * @param globalUBO - The global UBO to bind and use when
	 *  rendering the LUT.
	 */
	constructor(
		device: GPUDevice,
		dimensions: Extent2D,
		transmittanceLUT: GPUTextureView,
		multiscatterLUT: GPUTextureView,
		filterableLUT: boolean,
		globalUBO: GlobalUBO
	) {
		this.texture = device.createTexture({
			size: dimensions,
			dimension: "2d",
			format: SKYVIEW_LUT_FORMAT,
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING,
			label: "Skyview LUT",
		});
		this.view = this.texture.createView({ label: "Skyview LUT" });

		const bindGroup0Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					storageTexture: {
						access: "write-only",
						format: SKYVIEW_LUT_FORMAT,
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
			label: "Skyview LUT",
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
			label: "Skyview LUT Group 0",
		});

		const bindGroup1Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {},
				},
			],
			label: "Skyview LUT Group 1",
		});

		this.group1 = device.createBindGroup({
			layout: bindGroup1Layout,
			entries: [
				{
					binding: 0,
					resource: { buffer: globalUBO.buffer },
				},
			],
			label: "Skyview LUT Group 1",
		});

		const skyviewLUTShaderModule = device.createShaderModule({
			code: SkyViewLUTPak,
		});

		this.pipeline = device.createComputePipeline({
			compute: {
				module: skyviewLUTShaderModule,
				entryPoint: "computeSkyViewLuminance",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [bindGroup0Layout, bindGroup1Layout],
			}),
			label: "Skyview LUT",
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
		const skyviewLUTPassEncoder = commandEncoder.beginComputePass({
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
			label: "Skyview LUT",
		});
		skyviewLUTPassEncoder.setPipeline(this.pipeline);
		skyviewLUTPassEncoder.setBindGroup(0, this.group0);
		skyviewLUTPassEncoder.setBindGroup(1, this.group1);

		/*
		 * We trim lower half of skyview lut to save roughly half of the work.
		 * We render the ocean over the entirety and are at a lower altitude,
		 * so our use case is a bit specific.
		 */
		skyviewLUTPassEncoder.dispatchWorkgroups(
			Math.ceil(this.texture.width / 16),
			Math.ceil(this.texture.height / (16 * 1.9))
		);
		skyviewLUTPassEncoder.end();
	}
}
