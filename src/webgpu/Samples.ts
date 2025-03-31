import { RendererAppConstructor } from "./RendererApp";

/*
 * TODO: Move limit/feature info (required for initializing the app itself) into
 * the app module itself, behind the import. This way the parts of the website
 * that just display the links don't need to worry about the actual
 * initialization.
 */

/**
 * The display and initialization properties of a single WebGPU sample.
 */
export interface SampleEntry {
	/**
	 * A pretty-formatted name labelling the sample.
	 */
	name: string;

	/**
	 * A short description for the sample.
	 */
	description: string;

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

/**
 * The default WebGPU sample that should be loaded as a fallback.
 */
export const defaultSample: SampleEntry = {
	name: "Hello Cube",
	description: "Tests WebGPU functionality with a simple spinning cube.",
	projectFolder: "hello-cube",
	requiredLimits: new Map(),
	requiredFeatures: new Set(),
	optionalFeatures: new Set([
		"depth-clip-control",
		"depth32float-stencil8",
		"texture-compression-bc",
		"texture-compression-bc-sliced-3d",
		"texture-compression-etc2",
		"texture-compression-astc",
		"texture-compression-astc-sliced-3d",
		"timestamp-query",
		"indirect-first-instance",
		"shader-f16",
		"rg11b10ufloat-renderable",
		"bgra8unorm-storage",
		"float32-filterable",
		"float32-blendable",
		"clip-distances",
		"dual-source-blending",
	]),
	import: (): Promise<RendererAppConstructor> =>
		import("./hello-cube/HelloCube").then((value) => {
			return value.HelloCubeAppConstructor;
		}),
};
/**
 * A unique key identifying the default WebGPU sample.
 */
export const defaultSampleID = "hello-cube";

/**
 * WebGPU samples, indexed by a unique identifier.
 */
export const samplesByID = new Map<string, SampleEntry>([
	[defaultSampleID, defaultSample],
	[
		"sky-sea",
		{
			name: "Sky and Sea",
			description:
				"Real-time rendering of a dynamic sun over the open ocean, with various models for surface waves and raymarched atmospheric scattering.",
			projectFolder: "sky-sea",
			requiredLimits: new Map([["maxStorageTexturesPerShaderStage", 8]]),
			requiredFeatures: new Set(),
			optionalFeatures: new Set([
				"timestamp-query",
				"float32-filterable",
			]),
			import: (): Promise<RendererAppConstructor> =>
				import("./sky-sea/SkySea").then((value) => {
					return value.SkySeaAppConstructor;
				}),
		},
	],
]);
