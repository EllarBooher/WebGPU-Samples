import { GlobalUBO } from '../GlobalUBO';
import { FFTWaveDisplacementMaps } from './FourierWaves';
import { TimestampQueryInterval } from '../PerformanceTracker';
import { GBuffer, GBufferFormats } from '../GBuffer';
/**
 * Parameters that control the generation and appearance of the ocean surface.
 */
export interface WaveSurfaceSettings {
    gerstner: boolean;
    fft: boolean;
    foamScale: number;
    foamBias: number;
}
/**
 * This contains all of the resources for rendering the ocean surface into a
 * GBuffer.
 * - Mesh displacement and gradients can be sampled from maps or generated
 *   procedurally from sine or cosine waves. This is decided per-frame at draw
 *   time.
 * - Also produces foam, when texture maps are used for the displacement.
 */
export declare class WaveSurfaceDisplacementPassResources {
    private oceanSurfaceRasterizationPipeline;
    private group0;
    private group1;
    private group2ByTurbulenceMapIndex;
    private settingsUBO;
    private baseIndexCount;
    private indices;
    /**
     * Initializes all resources.
     * @param device - The WebGPU device to use.
     * @param globalUBO - The GlobalUBO instance that will be bound
     *  once and referenced in all recordings
     * @param formats - The formats of the gbuffer to use as color
     * 	attachments.
     * @param displacementMaps - 2D array textures
     *  that multiple cascades of ocean wave spectra.
     */
    constructor(device: GPUDevice, globalUBO: GlobalUBO, formats: GBufferFormats, displacementMaps: FFTWaveDisplacementMaps);
    /**
     * Fills the provided color/depth attachments with the generated ocean
     * surface.
     * @param device - The WebGPU device to use.
     * @param commandEncoder - The command encoder to record all passes into.
     * @param timestampInterval - The interval to record timing information
     *  into.
     * @param turbulenceMapIndex - The index into which of the already-bound
     *  turbulence maps to use for foam generation, if the option is enabled.
     * @param settings - The settings to use.
     * @param gbuffer - The gbuffer that will be filled with the rasterized
     *  ocean surface.
     */
    record(device: GPUDevice, commandEncoder: GPUCommandEncoder, timestampInterval: TimestampQueryInterval | undefined, turbulenceMapIndex: number, settings: WaveSurfaceSettings, gbuffer: GBuffer): void;
}
