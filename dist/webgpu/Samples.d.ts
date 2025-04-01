import { RendererAppConstructor } from './RendererApp';
export declare const SampleIDs: readonly ["hello-cube", "sky-sea"];
export type SampleID = (typeof SampleIDs)[number];
/**
 * A unique key identifying the default WebGPU sample.
 */
export declare const DefaultSampleID: SampleID;
/**
 * Information for displaying the sample.
 */
export interface SampleDisplayDescriptor {
    /**
     * A pretty-formatted name labelling the sample.
     */
    name: string;
    /**
     * A short description for the sample.
     */
    description: string;
}
export declare const SampleDisplayDescriptorByID: Map<"hello-cube" | "sky-sea", SampleDisplayDescriptor>;
/**
 * Information needed to interact with the sample as a code module.
 */
export interface SampleRuntimeDescriptor {
    /**
     * The name for the folder that contains the README.md and source for the
     * sample, at the same level as this module.
     */
    projectFolder: string;
    /**
     * A set of WebGPU limits that running the sample requires.
     */
    requiredLimits: ReadonlyMap<keyof GPUSupportedLimits, number>;
    /**
     * A set of WebGPU features that running the sample requires.
     */
    requiredFeatures: ReadonlySet<GPUFeatureName>;
    /**
     * A set of WebGPU features that improve the sample, but are individually
     * not required. They should be enabled if possible.
     */
    optionalFeatures: ReadonlySet<GPUFeatureName>;
    /**
     * A function that asynchronously loads the sample's renderer.
     */
    import: () => Promise<RendererAppConstructor>;
}
export declare const SampleInitDescriptorByID: Map<string, SampleRuntimeDescriptor>;
