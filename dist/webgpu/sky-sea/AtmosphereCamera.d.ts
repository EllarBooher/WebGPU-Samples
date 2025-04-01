import { GlobalUBO } from './GlobalUBO.ts';
import { Extent2D } from './Common.ts';
import { GBuffer } from './GBuffer.ts';
import { TimestampQueryInterval } from './PerformanceTracker.ts';
/**
 * Contains the resources for the composition of the atmosphere with an input
 * GBuffer. The GBuffer is interpreted as the ocean surface and shaded as such.
 * This includes reflections of the sky.
 */
export declare class AtmosphereCameraPassResources {
    private group0Layout;
    private group1Layout;
    private lutSampler;
    private group0;
    private group1;
    outputColor: GPUTexture;
    outputColorView: GPUTextureView;
    private pipeline;
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
    constructor(device: GPUDevice, gbufferReadGroupLayout: GPUBindGroupLayout, transmittanceLUT: GPUTextureView, multiscatterLUT: GPUTextureView, skyviewLUT: GPUTextureView, aerialPerspectiveLUT: GPUTextureView, filterableLUT: boolean, globalUBO: GlobalUBO);
    /**
     * Resizes all managed textures.
     * @see {@link (AtmosphereCameraPassResources:constructor)} for further
     *  descriptions of the parameters.
     * @param size - The new size to use. {@link outputColor} will be this size.
     * @param device - The WebGPU device to use.
     */
    resize(size: Extent2D, device: GPUDevice, transmittanceLUT: GPUTextureView, multiscatterLUT: GPUTextureView, skyviewLUT: GPUTextureView, aerialPerspectiveLUT: GPUTextureView): void;
    /**
     * Records the rendering of GBuffer scene composited with the atmosphere.
     * @param commandEncoder - The command encoder to record
     *  into.
     * @param timestampInterval - The
     *  interval to record timing information into.
     * @param gbuffer - The GBuffer to use as the input scene. See
     * 	shader source for how it is utilized.
     */
    record(commandEncoder: GPUCommandEncoder, timestampInterval: TimestampQueryInterval | undefined, gbuffer: GBuffer): void;
}
