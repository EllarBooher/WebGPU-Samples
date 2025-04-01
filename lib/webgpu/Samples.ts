import { RendererAppConstructor } from "./RendererApp";

export const SampleIDs = ["hello-cube", "sky-sea"] as const;
export type SampleID = (typeof SampleIDs)[number];

/**
 * A unique key identifying the default WebGPU sample.
 */
export const DefaultSampleID: SampleID = "hello-cube";

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
export const SampleDisplayDescriptorByID = new Map<
	SampleID,
	SampleDisplayDescriptor
>([
	[
		DefaultSampleID,
		{
			name: "Hello Cube",
			description:
				"Tests WebGPU functionality with a simple spinning cube.",
		},
	],
	[
		"sky-sea",
		{
			name: "Sky and Sea",
			description:
				"Real-time rendering of a dynamic sun over the open ocean, with various models for surface waves and raymarched atmospheric scattering.",
		},
	],
]);

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
export const SampleInitDescriptorByID = new Map<
	string,
	SampleRuntimeDescriptor
>([
	[
		DefaultSampleID,
		{
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
		},
	],
	[
		"sky-sea",
		{
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
