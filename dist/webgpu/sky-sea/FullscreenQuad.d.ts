import { RenderOutputTag, RenderOutputTexture, RenderOutputTransform } from './RenderOutputController';
import { TimestampQueryInterval } from './PerformanceTracker';
/**
 * Contains the resources for a graphics pass that draws a single quad with a
 * single texture mapped to it. Multiple textures can be bound, and selected at
 * draw time.
 * @see {@link RenderOutputTransform} for transformations that can be applied to
 * 	the sampled texture values.
 */
export declare class FullscreenQuadPassResources {
    private group0Layout;
    private group0LayoutArray;
    private group0Layout3D;
    private group0ByOutputTexture;
    private group0Sampler;
    private ubo;
    private fullscreenQuadIndexBuffer;
    private group1;
    private pipeline;
    private pipelineArray;
    private pipeline3D;
    /**
     * The view format of the texture that will be passed to draw.
     * @see {@link record} for the function that takes in the view of this
     *  format.
     */
    readonly attachmentFormat: GPUTextureFormat;
    /**
     * Generate and save bind groups for a given tag, so it can be read at
     * draw time.
     * @param device - The WebGPU device to use.
     * @param tag - The tag that can be passed
     * 	at draw time to use this texture for sampling.
     * @param texture - The texture to generate bindings
     * 	for.
     */
    setOutput(device: GPUDevice, tag: RenderOutputTag, texture: RenderOutputTexture): void;
    /**
     * Enumerates properties of bound textures by tag. Useful for reflecting in
     * UI without references to the underlying textures.
     * @returns Returns an iterable of all the properties and tag of each
     *  texture that is bound. Tag will be unique across all elements.
     */
    getAllTextureProperties(): Iterable<{
        tag: RenderOutputTag;
        mipLevelCount: number;
        depthOrArrayLayerCount: number;
    }>;
    /**
     * Instantiates all resources.
     * @param device - The WebGPU device to use.
     * @param attachmentFormat - The texture format that will be used for the
     *  render pipelines attachments. This must match the format of the texture
     *  view used as the attachment at draw time.
     */
    constructor(device: GPUDevice, attachmentFormat: GPUTextureFormat);
    /**
     * Record the rendering of a fullscreen quad, sampling the texture that
     * has been bound to the requested tag.
     * @see {@link setOutput} for how to bind the texture that will used here.
     * @param device - The WebGPU device to use.
     * @param commandEncoder - The command encoder to record
     * 	into.
     * @param presentView - The texture view to use as the
     * 	output attachment.
     * @param tag - The tag selecting the bound
     * 	texture to use.
     * @param transform - The transformation to apply to
     * 	the sampled texture values in the fragment stage.
     * @param timestamps - The interval to record
     * 	timing information into.
     */
    record(device: GPUDevice, commandEncoder: GPUCommandEncoder, presentView: GPUTextureView, tag: RenderOutputTag, transform: RenderOutputTransform, timestamps?: TimestampQueryInterval): void;
}
