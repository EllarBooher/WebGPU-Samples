import { GlobalUBO } from "./GlobalUBO.ts";
import AtmosphereCameraPak from "../../shaders/sky-sea/atmosphere_camera.wgsl";
import { Extent2D } from "./Common.ts";
import { GBuffer } from "./GBuffer.ts";
import { TimestampQueryInterval } from "./PerformanceTracker.ts";

const ATMOSPHERE_CAMERA_OUTPUT_TEXTURE_FORMAT: GPUTextureFormat = "rgba16float";

/**
 * Contains the resources for the composition of the atmosphere with an input
 * GBuffer. The GBuffer is interpreted as the ocean surface and shaded as such.
 * This includes reflections of the sky.
 */
export class AtmosphereCameraPassResources {
	/*
	 * @group(0) @binding(0) var output_color: texture_storage_2d<rgba32float, write>;
	 * @group(0) @binding(1) var lut_sampler: sampler;
	 * @group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
	 * @group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
	 * @group(0) @binding(4) var skyview_lut: texture_2d<f32>;
	 * @group(0) @binding(5) var aerial_perspective_lut: texture_3d<f32>;
	 *
	 * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
	 *
	 * @group(2) @binding(0) var gbuffer_color_with_surface_world_depth_in_alpha: texture_2d<f32>;
	 * @group(2) @binding(1) var gbuffer_normal_with_surface_jacobian_in_alpha: texture_2d<f32>;
	 */
	private group0Layout: GPUBindGroupLayout;
	private group1Layout: GPUBindGroupLayout;

	private lutSampler: GPUSampler;

	private group0: GPUBindGroup;
	private group1: GPUBindGroup;

	public outputColor: GPUTexture;
	public outputColorView: GPUTextureView;

	private pipeline: GPUComputePipeline;

	/**
	 * Initializes all resources related to the atmospheric camera pass. The
	 * texture will be initialized as one pixel by one pixel, call
	 * {@link resize} afterwards to set the size.
	 * @param device - The WebGPU device to use.
	 * @param gbufferReadGroupLayout - The layout of the GBuffer bind group that
	 *  will be provided at rendering time.
	 * @param transmittanceLUT - A view into the transmittance LUT that will be
	 *  used.
	 * @param multiscatterLUT - A view into the multiscatter LUT that will be
	 *  used.
	 * @param skyviewLUT - A view into the sky view LUT that will be used.
	 * @param aerialPerspectiveLUT - A view into the aerial perspective LUT that
	 *  will be used.
	 * @param filterableLUT - Whether or not the passed LUTs are filterable by
	 *  samples. This is a consideration since the LUTs are 32-bit floats per
	 *  channel, and filtering such textures is not supported on all WebGPU
	 *  instances.
	 * @param globalUBO - The global UBO to bind and use when rendering the LUT.
	 */
	constructor(
		device: GPUDevice,
		gbufferReadGroupLayout: GPUBindGroupLayout,
		transmittanceLUT: GPUTextureView,
		multiscatterLUT: GPUTextureView,
		skyviewLUT: GPUTextureView,
		aerialPerspectiveLUT: GPUTextureView,
		filterableLUT: boolean,
		globalUBO: GlobalUBO
	) {
		this.group0Layout = device.createBindGroupLayout({
			entries: [
				{
					// output texture
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					storageTexture: {
						format: ATMOSPHERE_CAMERA_OUTPUT_TEXTURE_FORMAT,
					},
				},
				{
					// sampler for the LUTs
					binding: 1,
					visibility: GPUShaderStage.COMPUTE,
					sampler: {
						type: filterableLUT ? "filtering" : "non-filtering",
					},
				},
				{
					// transmittance
					binding: 2,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						sampleType: filterableLUT
							? "float"
							: "unfilterable-float",
						viewDimension: "2d",
					},
				},
				{
					// multiscatter
					binding: 3,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						sampleType: filterableLUT
							? "float"
							: "unfilterable-float",
						viewDimension: "2d",
					},
				},
				{
					// skyview
					binding: 4,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						sampleType: filterableLUT
							? "float"
							: "unfilterable-float",
						viewDimension: "2d",
					},
				},
				{
					// aerial perspective
					binding: 5,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						sampleType: "float",
						viewDimension: "3d",
					},
				},
			],
			label: "Atmosphere Camera Group 0",
		});
		this.group1Layout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: {},
				},
			],
			label: "Atmosphere Camera Group 1",
		});

		this.outputColor = device.createTexture({
			format: ATMOSPHERE_CAMERA_OUTPUT_TEXTURE_FORMAT,
			size: { width: 1, height: 1 },
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING,
			label: "Atmosphere Camera Output Color",
		});
		this.outputColorView = this.outputColor.createView();

		this.lutSampler = device.createSampler({
			label: "Atmosphere Camera LUT Sampler",
			magFilter: filterableLUT ? "linear" : "nearest",
			minFilter: filterableLUT ? "linear" : "nearest",
		});

		this.group0 = device.createBindGroup({
			layout: this.group0Layout,
			entries: [
				{
					binding: 0,
					resource: this.outputColorView,
				},
				{
					binding: 1,
					resource: this.lutSampler,
				},
				{
					binding: 2,
					resource: transmittanceLUT,
				},
				{
					binding: 3,
					resource: multiscatterLUT,
				},
				{
					binding: 4,
					resource: skyviewLUT,
				},
				{
					binding: 5,
					resource: aerialPerspectiveLUT,
				},
			],
			label: "Atmosphere Camera Group 0",
		});

		this.group1 = device.createBindGroup({
			layout: this.group1Layout,
			entries: [
				{
					binding: 0,
					resource: { buffer: globalUBO.buffer },
				},
			],
			label: "Atmosphere Camera Group 1",
		});

		const atmosphereCameraShaderModule = device.createShaderModule({
			code: AtmosphereCameraPak,
			label: "Atmosphere Camera",
		});
		this.pipeline = device.createComputePipeline({
			compute: {
				module: atmosphereCameraShaderModule,
				entryPoint: "renderCompositedAtmosphere",
			},
			layout: device.createPipelineLayout({
				bindGroupLayouts: [
					this.group0Layout,
					this.group1Layout,
					gbufferReadGroupLayout,
				],
			}),
			label: "Atmosphere Camera",
		});
	}

	/**
	 * Resizes all managed textures.
	 * @see {@link (AtmosphereCameraPassResources:constructor)} for further
	 *  descriptions of the parameters.
	 * @param size - The new size to use. {@link outputColor} will be this size.
	 * @param device - The WebGPU device to use.
	 */
	resize(
		size: Extent2D,
		device: GPUDevice,
		transmittanceLUT: GPUTextureView,
		multiscatterLUT: GPUTextureView,
		skyviewLUT: GPUTextureView,
		aerialPerspectiveLUT: GPUTextureView
	): void {
		this.outputColor = device.createTexture({
			format: this.outputColor.format,
			size: size,
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING,
		});
		this.outputColorView = this.outputColor.createView();

		this.group0 = device.createBindGroup({
			layout: this.group0Layout,
			entries: [
				{
					binding: 0,
					resource: this.outputColorView,
				},
				{
					binding: 1,
					resource: this.lutSampler,
				},
				{
					binding: 2,
					resource: transmittanceLUT,
				},
				{
					binding: 3,
					resource: multiscatterLUT,
				},
				{
					binding: 4,
					resource: skyviewLUT,
				},
				{
					binding: 5,
					resource: aerialPerspectiveLUT,
				},
			],
			label: "Atmosphere Camera Group 0 Resized",
		});
	}

	/**
	 * Records the rendering of GBuffer scene composited with the atmosphere.
	 * @param commandEncoder - The command encoder to record
	 *  into.
	 * @param timestampInterval - The
	 *  interval to record timing information into.
	 * @param gbuffer - The GBuffer to use as the input scene. See
	 * 	shader source for how it is utilized.
	 */
	record(
		commandEncoder: GPUCommandEncoder,
		timestampInterval: TimestampQueryInterval | undefined,
		gbuffer: GBuffer
	): void {
		const atmosphereCameraPassEncoder = commandEncoder.beginComputePass({
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
			label: "Atmosphere Camera",
		});
		atmosphereCameraPassEncoder.setPipeline(this.pipeline);
		atmosphereCameraPassEncoder.setBindGroup(0, this.group0);
		atmosphereCameraPassEncoder.setBindGroup(1, this.group1);
		atmosphereCameraPassEncoder.setBindGroup(2, gbuffer.readGroup);
		atmosphereCameraPassEncoder.dispatchWorkgroups(
			Math.ceil(this.outputColor.width / 16),
			Math.ceil(this.outputColor.height / 16)
		);
		atmosphereCameraPassEncoder.end();
	}
}
