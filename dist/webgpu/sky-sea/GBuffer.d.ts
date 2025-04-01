import { Extent2D } from './Common.ts';
import { RenderOutputTexture } from './RenderOutputController.ts';
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
export declare class GBuffer {
    private colorWithSurfaceWorldDepthInAlpha;
    readonly colorWithSurfaceWorldDepthInAlphaView: GPUTextureView;
    private normalWithSurfaceFoamStrengthInAlpha;
    readonly normalWithSurfaceFoamStrengthInAlphaView: GPUTextureView;
    private depth;
    readonly depthView: GPUTextureView;
    get extent(): Extent2D;
    get formats(): GBufferFormats;
    colorRenderables(): {
        colorWithSurfaceWorldDepthInAlpha: RenderOutputTexture;
        normalWithSurfaceFoamStrengthInAlpha: RenderOutputTexture;
    };
    /**
     * Contains all bindings for reading the GBuffer in a shader.
     * @see {@link GBuffer} for descriptions of the targets including formats.
     */
    readonly readGroupLayout: GPUBindGroupLayout;
    /**
     * @see {@link readGroupLayout}
     */
    readonly readGroup: GPUBindGroup;
    private writeGroupLayout;
    /**
     * Contains all bindings for writing to the GBuffer in a shader.
     * @see {@link GBuffer} for descriptions of the targets including formats.
     */
    readonly writeGroup: GPUBindGroup;
    /**
     * Instantiates all textures and bind groups for the GBuffer.
     * @param device - The WebGPU device to use.
     * @param dimensions - The dimensions in pixels to instantiate all the
     *  textures with.
     * @param old - A previous instance of `GBuffer` to potentially reuse
     *  resources or parameters from. This is useful to pass when the GBuffer is
     *  resized to match the presentation viewport's dimensions.
     */
    constructor(device: GPUDevice, dimensions: Extent2D, old?: GBuffer);
}
