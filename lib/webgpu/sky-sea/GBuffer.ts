import { Extent2D } from "./Common.ts";
import { RenderOutputTexture } from "./RenderOutputController.ts";

const GBUFFER_COLOR_FORMAT: GPUTextureFormat = "rgba16float";
const GBUFFER_COLOR_SAMPLE_TYPE: GPUTextureSampleType = "float";
const GBUFFER_DEPTH_FORMAT: GPUTextureFormat = "depth32float";

const GBUFFER_NORMAL_FORMAT: GPUTextureFormat = "rgba16float";
const GBUFFER_NORMAL_SAMPLE_TYPE: GPUTextureSampleType = "float";

export interface GBufferFormats {
	colorWithSurfaceWorldDepthInAlpha: GPUTextureFormat;
	normalWithSurfaceFoamStrengthInAlpha: GPUTextureFormat;
	depth: GPUTextureFormat;
}

/**
 * Stores color and depth textures in a GBuffer, in a format that is consumed by
 * render pipelines in the renderer. The textures by WebGPU format are:
 * - `rgba16float`  binding 0 (read/write groups) - Color with world-space
 *   distance to the texel packed into the alpha channel.
 * - `rgba16float`  binding 1 (read/write groups) - World-space normals with
 *   ocean-surface foam strength packed into the alpha channel.
 * - `depth32float` binding 2 (read group only)   - Framebuffer depth.
 */
export class GBuffer {
	private colorWithSurfaceWorldDepthInAlpha: GPUTexture;
	public readonly colorWithSurfaceWorldDepthInAlphaView: GPUTextureView;

	private normalWithSurfaceFoamStrengthInAlpha: GPUTexture;
	public readonly normalWithSurfaceFoamStrengthInAlphaView: GPUTextureView;

	// Depth used for graphics pipelines that render into the gbuffer
	private depth: GPUTexture;
	public readonly depthView: GPUTextureView;

	public get extent(): Extent2D {
		return {
			width: this.colorWithSurfaceWorldDepthInAlpha.width,
			height: this.colorWithSurfaceWorldDepthInAlpha.height,
		};
	}

	public get formats(): GBufferFormats {
		return {
			colorWithSurfaceWorldDepthInAlpha:
				this.colorWithSurfaceWorldDepthInAlpha.format,
			normalWithSurfaceFoamStrengthInAlpha:
				this.normalWithSurfaceFoamStrengthInAlpha.format,
			depth: this.depth.format,
		};
	}

	public colorRenderables(): {
		colorWithSurfaceWorldDepthInAlpha: RenderOutputTexture;
		normalWithSurfaceFoamStrengthInAlpha: RenderOutputTexture;
	} {
		return {
			colorWithSurfaceWorldDepthInAlpha: new RenderOutputTexture(
				this.colorWithSurfaceWorldDepthInAlpha
			),
			normalWithSurfaceFoamStrengthInAlpha: new RenderOutputTexture(
				this.normalWithSurfaceFoamStrengthInAlpha
			),
		};
	}

	/**
	 * Contains all bindings for reading the GBuffer in a shader.
	 * @see {@link GBuffer} for descriptions of the targets including formats.
	 */
	public readonly readGroupLayout: GPUBindGroupLayout;
	/**
	 * @see {@link readGroupLayout}
	 */
	public readonly readGroup: GPUBindGroup;

	private writeGroupLayout: GPUBindGroupLayout;

	/**
	 * Contains all bindings for writing to the GBuffer in a shader.
	 * @see {@link GBuffer} for descriptions of the targets including formats.
	 */
	public readonly writeGroup: GPUBindGroup;

	/**
	 * Instantiates all textures and bind groups for the GBuffer.
	 * @param device - The WebGPU device to use.
	 * @param dimensions - The dimensions in pixels to instantiate all the
	 *  textures with.
	 * @param old - A previous instance of `GBuffer` to potentially reuse
	 *  resources or parameters from. This is useful to pass when the GBuffer is
	 *  resized to match the presentation viewport's dimensions.
	 */
	constructor(device: GPUDevice, dimensions: Extent2D, old?: GBuffer) {
		this.colorWithSurfaceWorldDepthInAlpha = device.createTexture({
			size: dimensions,
			dimension: "2d",
			format: GBUFFER_COLOR_FORMAT,
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.RENDER_ATTACHMENT |
				GPUTextureUsage.TEXTURE_BINDING,
			label: "GBuffer ColorWithSurfaceWorldDepthInAlpha",
		});
		this.colorWithSurfaceWorldDepthInAlphaView =
			this.colorWithSurfaceWorldDepthInAlpha.createView({
				label: "GBuffer ColorWithSurfaceWorldDepthInAlpha",
			});

		this.normalWithSurfaceFoamStrengthInAlpha = device.createTexture({
			size: dimensions,
			dimension: "2d",
			format: GBUFFER_NORMAL_FORMAT,
			usage:
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.RENDER_ATTACHMENT |
				GPUTextureUsage.TEXTURE_BINDING,
			label: "GBuffer Normal",
		});
		this.normalWithSurfaceFoamStrengthInAlphaView =
			this.normalWithSurfaceFoamStrengthInAlpha.createView({
				label: "GBuffer Normal",
			});

		this.readGroupLayout =
			old?.readGroupLayout ??
			device.createBindGroupLayout({
				entries: [
					{
						binding: 0,
						visibility:
							GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
						texture: { sampleType: GBUFFER_COLOR_SAMPLE_TYPE },
					},
					{
						binding: 1,
						visibility:
							GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
						texture: { sampleType: GBUFFER_NORMAL_SAMPLE_TYPE },
					},
				],
				label: "GBuffer Read Group Layout",
			});
		this.readGroup = device.createBindGroup({
			layout: this.readGroupLayout,
			entries: [
				{
					binding: 0,
					resource: this.colorWithSurfaceWorldDepthInAlphaView,
				},
				{
					binding: 1,
					resource: this.normalWithSurfaceFoamStrengthInAlphaView,
				},
			],
			label: "GBuffer Read Group",
		});

		this.writeGroupLayout =
			old?.writeGroupLayout ??
			device.createBindGroupLayout({
				entries: [
					{
						binding: 0,
						visibility:
							GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
						storageTexture: {
							access: "write-only",
							format: GBUFFER_COLOR_FORMAT,
						},
					},
					{
						binding: 1,
						visibility:
							GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
						storageTexture: {
							access: "write-only",
							format: GBUFFER_NORMAL_FORMAT,
						},
					},
				],
				label: "GBuffer Write Group Layout",
			});
		this.writeGroup = device.createBindGroup({
			layout: this.writeGroupLayout,
			entries: [
				{
					binding: 0,
					resource: this.colorWithSurfaceWorldDepthInAlphaView,
				},
				{
					binding: 1,
					resource: this.normalWithSurfaceFoamStrengthInAlphaView,
				},
			],
			label: "GBuffer Write Group",
		});

		this.depth = device.createTexture({
			size: dimensions,
			dimension: "2d",
			format: GBUFFER_DEPTH_FORMAT,
			usage:
				GPUTextureUsage.RENDER_ATTACHMENT |
				GPUTextureUsage.TEXTURE_BINDING,
			label: "GBuffer Depth",
		});
		this.depthView = this.depth.createView({ label: "GBuffer Depth" });
	}
}
