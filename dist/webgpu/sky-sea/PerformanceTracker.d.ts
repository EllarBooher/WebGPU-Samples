import { GUI as LilGUI } from 'lil-gui';
/**
 * @see {@link QueryCategory} for the enum backed by this array.
 */
export declare const QueryCategories: readonly ["SkyviewLUT", "AerialPerspectiveLUT", "FFTWaves", "OceanSurface", "AtmosphereCamera", "FullscreenQuad"];
/**
 * Categories of rendering work that the renderer tracks the performance for by
 * querying the device for timestamps.
 */
export type QueryCategory = (typeof QueryCategories)[number];
/**
 * @see {@link FrametimeCategory} for the enum backed by this array.
 */
export declare const FrametimeCategories: readonly ["DrawToDraw", "SkyviewLUT", "AerialPerspectiveLUT", "FFTWaves", "OceanSurface", "AtmosphereCamera", "FullscreenQuad"];
/**
 * All categories of rendering work that the renderer tracks the compute and
 * graphics time for.
 */
export type FrametimeCategory = (typeof FrametimeCategories)[number];
/**
 * Stores indices into a device query set, for timing some interval or scope of
 * GPU work.
 */
export interface TimestampQueryInterval {
    /**
     * The query set that timestamps should be written into.
     */
    querySet: GPUQuerySet;
    /**
     * An index into the query set, where the timestamp for the beginning of the
     * work should be written.
     */
    beginWriteIndex: GPUSize32;
    /**
     * An index into the query set, where the timestamp for the end of the work
     * should be written.
     */
    endWriteIndex: GPUSize32;
}
/**
 * This manages storing the frametimes across various categories for a fixed
 * amount of past frames. The mechanism for updating times is querying the GPU
 * each frame for timestamps, then asynchronously mapping a host-device buffer.
 * This leads to frames being missed, so this object is only good for gathering
 * an average. `PerformanceTracker` is unsuitable if frametimes are
 * unpredictable and the timing of mapping the backing buffer coincidentally
 * leads to aliasing of the true frametime history.
 */
export declare class PerformanceTracker {
    private readonly queryBuffers;
    private readonly frametimeAverages;
    private readonly timestampIndexMapping;
    private timestampQueryIndex;
    private readonly uiDisplay;
    private initialized;
    get averageFPS(): number;
    destroy(): void;
    /**
     * Bind the frametime values and averageFPS to the passed UI, under a single
     * top-level folder.
     * @param gui - The GUI to bind to
     */
    setupUI(gui: LilGUI): void;
    /**
     * Begin each frame by calling this before any other methods. This also
     * records the host's frame-to-frame time.
     * @param deltaTimeMilliseconds - The time since last frame, to be
     *  recorded for displaying the overall average FPS.
     */
    beginFrame(deltaTimeMilliseconds: number): void;
    /**
     * Call this before recording each interval of GPU work you wish to time. If
     * timestamp querying is supported, this will return a query set and two
     * indices that should be passed to the WebGPU api when starting
     * render/compute passes. If the interval of work you wish to time spans
     * multiple passes, pass the begin index as the start of the first pass and
     * the end index as the end of the last pass.
     * @see {@link GPUComputePassTimestampWrites} or
     *  {@link GPURenderPassTimestampWrites} for how the returned value needs to
     *  be consumed by WebGPU.
     * @param category - The category that the GPU timestamps will be recorded
     *  under. Calling this twice for the same category will overwrite the old
     *  timestamps, and may lead to an overflow of the memory of the query set
     *  causing a crash in the WebGPU instance.
     * @returns Returns the device query set and indices that should be written
     *  into, or `undefined` if querying is not supported.
     */
    queueTimestampInterval(category: QueryCategory): TimestampQueryInterval | undefined;
    /**
     * Call this once all timed commands have been recorded. The encoder's
     * current recording point needs to be logically after all work being timed
     * so that there is no race-condition on the copied timestamps. This usually
     * means just putting all the work for each `PerformanceTracker` on the same
     * encoder.
     * @param commandEncoder - The command encoder to record
     * 	into.
     */
    preSubmitCommands(commandEncoder: GPUCommandEncoder): void;
    /**
     * Call this after executing all command buffers with commands that touch
     * the timing data that will be read by `PerformanceTracker`. This copies
     * all the timing and updates the bound UI.
     */
    postSubmitCommands(): void;
    constructor(device: GPUDevice);
}
