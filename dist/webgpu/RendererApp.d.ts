import { GUI } from 'lil-gui';
/**
 * A WebGPU renderer that can render to a given texture. Also handles possible
 * resizing of its render target (such as an HTML canvas), and binding to a GUI
 * backend (just lil-gui for now).
 */
export interface RendererApp {
    quit: boolean;
    presentationInterface(): GPUCanvasConfiguration;
    setLowPerformanceMode?: (isLowPerf: boolean) => void;
    handleResize?: (newWidth: number, newHeight: number) => void;
    draw: (presentTexture: GPUTexture, aspectRatio: number, timeMilliseconds: number, deltaTimeMilliseconds: number) => void;
    setupUI?: (gui: GUI) => void;
    destroy(): void;
}
/**
 * A function signature for the constructor that fully initializes a WebGPU
 * sample renderer apps.
 * @param device - The device that is used for the allocation of all resources
 *  and dispatch of rendering commands.
 * @param canvasFormat - The format of the canvas texture that will be passed in
 *  {@link RendererApp.draw}. Rendering is not guaranteed to work if the format
 *  does not match.
 * @returns The instantiated renderer, ready for binding UI and recording frame
 * draws
 */
export type RendererAppConstructor = (device: GPUDevice, canvasFormat: GPUTextureFormat) => RendererApp;
/**
 * Initializes a WebGPU sample renderer app with the given limits.
 *
 * @param gpu - The GPU to request the adapter and device from.
 * @param requiredFeatures - Each feature is guaranteed to be enabled, and the
 *  promise rejects if any of these features are unsupported.
 * @param optionalFeatures - Each feature will be enabled if supported. Any
 *  unsupported features will be omitted, and it is the duty of the renderer to
 *  check which features ended up enabled.
 * @param requiredLimits - The exact limits and no better provided will be
 *  enabled. The promise rejects if any of these limits cannot be supported.
 * @param import - The (asynchronous importer of the constructor for the) app to
 *  be initialized
 * @param onUncapturedError - A handler to be attached to
 *  {@link GPUDevice.onuncapturederror} of the created device, which produces
 *  error events.
 * @returns A promise resolving to the fully initialized app. Can reject.
 */
export declare function initializeApp(props: {
    gpu: GPU;
    requiredLimits: ReadonlyMap<keyof GPUSupportedLimits, number>;
    requiredFeatures: ReadonlySet<GPUFeatureName>;
    optionalFeatures: ReadonlySet<GPUFeatureName>;
    import: () => Promise<RendererAppConstructor>;
    onUncapturedError: (e: GPUUncapturedErrorEvent) => void;
}): Promise<RendererApp>;
