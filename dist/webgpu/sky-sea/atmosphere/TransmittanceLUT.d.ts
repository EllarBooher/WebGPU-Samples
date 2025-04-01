import { Extent2D } from '../Common.ts';
import { GlobalUBO } from '../GlobalUBO.ts';
/**
 * Contains the resources for the creation of a lookup table for atmospheric
 * transmittance from point to upper edge of atmosphere, parameterized by
 * altitude and zenith angle of the querying ray. This LUT only needs to be
 * updated when the atmosphere parameters change.
 */
export declare class TransmittanceLUTPassResources {
    /**
     * The transmittance lookup table texture.
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
     * Initializes all resources related to the transmittance lookup table.
     * @param device - The WebGPU device to use.
     * @param dimensions - The dimensions to use for the LUT texture.
     * @param globalUBO - The global UBO to bind and use when
     * 	rendering the LUT.
     */
    constructor(device: GPUDevice, dimensions: Extent2D, globalUBO: GlobalUBO);
    /**
     * Records the population of the lookup table.
     * @param commandEncoder - The command encoder to record
     *  into.
     */
    record(commandEncoder: GPUCommandEncoder): void;
}
