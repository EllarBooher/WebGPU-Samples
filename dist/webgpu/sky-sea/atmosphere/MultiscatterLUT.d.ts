import { Extent2D } from '../Common.ts';
import { GlobalUBO } from '../GlobalUBO.ts';
/**
 * Contains the resources for the creation of a lookup table for multi-scattered
 * spectral RGB inscattering luminance arriving at any given point in the
 * atmosphere. Multi-scattered means that the values in the table are the sum of
 * secondary inscattering, plus tertiary inscattering, and so on.
 */
export declare class MultiscatterLUTPassResources {
    /**
     * The multiscatter lookup table texture.
     */
    readonly texture: GPUTexture;
    /**
     * The view into {@link texture}.
     */
    readonly view: GPUTextureView;
    private pipeline;
    private group0;
    private group1;
    /**
     * Initializes all resources related to the multiscatter lookup table.
     * @param device - The WebGPU device to use.
     * @param dimensions - The dimensions of the LUT texture.
     * @param transmittanceLUT - The transmittance LUT to bind and read from.
     * @param filterableLUT - Whether or not the LUTs are filterable.
     * @param globalUBO - The global UBO to bind and read from.
     */
    constructor(device: GPUDevice, dimensions: Extent2D, transmittanceLUT: GPUTextureView, filterableLUT: boolean, globalUBO: GlobalUBO);
    record(commandEncoder: GPUCommandEncoder): void;
}
