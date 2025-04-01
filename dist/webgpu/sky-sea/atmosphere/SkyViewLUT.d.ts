import { Extent2D } from '../Common.ts';
import { GlobalUBO } from '../GlobalUBO.ts';
import { TimestampQueryInterval } from '../PerformanceTracker.ts';
/**
 * Contains the resources for the creation of a lookup table for all atmospheric
 * scattering reaching a fixed position, calculated with no obstructions or
 * geometry.
 * - This is called the Sky View LUT since this gives the view of the
 *   unobstructed sky from a fixed position.
 * - The LUT is parameterized by azimuth and zenith of the outgoing view ray.
 */
export declare class SkyViewLUTPassResources {
    texture: GPUTexture;
    view: GPUTextureView;
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
    constructor(device: GPUDevice, dimensions: Extent2D, transmittanceLUT: GPUTextureView, multiscatterLUT: GPUTextureView, filterableLUT: boolean, globalUBO: GlobalUBO);
    /**
     * Records the population of the lookup table.
     * @param commandEncoder - The command encoder to record
     * 	into.
     * @param timestampInterval - The
     *  interval to record timing information into.
     */
    record(commandEncoder: GPUCommandEncoder, timestampInterval: TimestampQueryInterval | undefined): void;
}
