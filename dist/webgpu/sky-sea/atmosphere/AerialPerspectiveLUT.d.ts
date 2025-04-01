import { GlobalUBO } from '../GlobalUBO.ts';
import { TimestampQueryInterval } from '../PerformanceTracker.ts';
/**
 * Contains the resources for the creation of a lookup table for atmospheric
 * scattering reaching a fixed position, calculated with no obstructions or
 * geometry.
 * - The LUT is an array, where each layer represents an incremental increase in
 *   the distance that scattering is calculated over.
 * - The LUT is parameterized by azimuth and zenith of the outgoing view ray.
 */
export declare class AerialPerspectiveLUTPassResources {
    /**
     * The aerial perspective lookup table texture.
     */
    readonly texture: GPUTexture;
    /**
     * The view into {@link texture}.
     */
    readonly view: GPUTextureView;
    private group0;
    private group1;
    private pipeline;
    /**
     * Initializes all resources related to the aerial perspective lookup table.
     * @param device - The WebGPU device to use.
     * @param dimensions - The dimensions to use for the LUT. This increases the
     *  fidelity and detail captured. Generally, a low value like 32 x 32 x 32
     *  is good enough.
     * @param transmittanceLUT - A view into the transmittance LUT that will be
     *  used.
     * @param multiscatterLUT - A view into the multiscatter LUT that will be
     *  used.
     * @param filterableLUT - Whether or not the passed LUTs are filterable by
     *  samples. This is a consideration since the LUTs are 32-bit floats per
     *  channel, and filtering such textures is not supported on all WebGPU
     *  instances.
     * @param globalUBO - The global UBO to bind and use when rendering the LUT.
     */
    constructor(device: GPUDevice, dimensions: GPUExtent3DDictStrict, transmittanceLUT: GPUTextureView, multiscatterLUT: GPUTextureView, filterableLUT: boolean, globalUBO: GlobalUBO);
    /**
     * Records the population of the lookup table.
     * @param commandEncoder - The command encoder to record
     * 	into.
     * @param timestampInterval - The
     *  interval to record timing information into.
     */
    record(commandEncoder: GPUCommandEncoder, timestampInterval: TimestampQueryInterval | undefined): void;
}
