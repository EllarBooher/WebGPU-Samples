const POSSIBLE_WEBGPU_FEATURES = new Set<GPUFeatureName>([
	"core-features-and-limits",
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
	"subgroups",
	"texture-formats-tier1",
	"texture-formats-tier2",
]);

export default POSSIBLE_WEBGPU_FEATURES;
