import MipMapPak from "../../../shaders/sky-sea/util/mipmap.wgsl";

// Currently the only supported texture format for mipmapping
const MIP_MAP_TEXTURE_FORMAT = "rgba16float";

// TODO: keep the bindings internal and hand out handles.

/**
 * External bindings used for filling the mipmaps of a single texture.
 * @see {@link MipMapGenerationPassResources}
 */
export interface MipMapGenerationTextureBindings {
	bindGroupsByMipLevel: GPUBindGroup[];
	level0Size: { width: number; height: number };
	arrayLevelCount: number;
}

/**
 * This contains the resources for generating mipmaps for 2D textures, including
 * texture arrays.
 */
export class MipMapGenerationPassResources {
	/*
	 * @group(0) @binding(0) var out_next_mip_level: texture_storage_2d<rgba16float, write>;
	 * @group(0) @binding(1) var in_previous_mip_level: texture_2d<f32>;
	 */
	private fillMipMapTextureInOutLayout: GPUBindGroupLayout;
	// private fillMipMapTextureBindGroups: GPUBindGroup[];

	// private baseSize: { width: number; height: number };

	// Workgroup size is (16,16,1)
	private fillMipMapKernel: GPUComputePipeline;
	// Workgroup size is (1,1,1)
	private fillMipMapSmallerKernel: GPUComputePipeline;

	/**
	 * Validates a texture for generating mipmaps, and throw an error upon any
	 * incompatibilities. This then generates the device bind groups that will
	 * be used to access the texture when writing mipmaps. The returned value
	 * can be kept and reused each time that mip-level 0 is updated to generate
	 * new mipmaps.
	 * @param device - The WebGPU device to use.
	 * @param texture - The texture to generate bindings for.
	 * @returns The bindings can be used for generating mipmaps.
	 */
	createBindGroups(
		device: GPUDevice,
		texture: GPUTexture
	): MipMapGenerationTextureBindings {
		if (texture.format != MIP_MAP_TEXTURE_FORMAT) {
			throw new RangeError(
				`Invalid source texture (label ${texture.label}) for MipMap generation`,
				{
					cause: `Source format is ${texture.format} when expected ${MIP_MAP_TEXTURE_FORMAT}`,
				}
			);
		}
		if (texture.dimension != "2d") {
			throw new RangeError(
				`Invalid source texture (label ${texture.label}) for MipMap generation`,
				{
					cause: `Source texture is not 2d`,
				}
			);
		}
		if (!(texture.usage & GPUTextureUsage.COPY_SRC)) {
			throw new RangeError(
				`Invalid source texture (label ${texture.label}) for MipMap generation`,
				{
					cause: `Source usage is missing required flag COPY_SRC`,
				}
			);
		}
		if (
			texture.width != texture.height ||
			!Number.isInteger(Math.log2(texture.width))
		) {
			throw new RangeError(
				`Invalid source texture (label ${texture.label}) for MipMap generation`,
				{
					cause: `Source dimensions of (${texture.width},${texture.height}) are invalid, texture must be square and power-of-2.`,
				}
			);
		}

		const maxMipMapCount = Math.log2(texture.width);

		return {
			level0Size: {
				width: texture.width,
				height: texture.height,
			},
			bindGroupsByMipLevel: [
				...new Array(
					Math.min(maxMipMapCount, texture.mipLevelCount) - 1
				).keys(),
			].map((_value, index) => {
				const nextMipLevel = index + 1;
				const previousMipLevel = index;
				return device.createBindGroup({
					label: `MipMap Generation for '${texture.label}' IO Bind Group '${previousMipLevel} => ${nextMipLevel}'`,
					layout: this.fillMipMapTextureInOutLayout,
					entries: [
						{
							binding: 0,
							resource: texture.createView({
								dimension: "2d-array",
								baseMipLevel: nextMipLevel,
								mipLevelCount: 1,
							}),
						},
						{
							binding: 1,
							resource: texture.createView({
								dimension: "2d-array",
								baseMipLevel: previousMipLevel,
								mipLevelCount: 1,
							}),
						},
					],
				});
			}),
			arrayLevelCount: texture.depthOrArrayLayers,
		};
	}

	constructor(device: GPUDevice) {
		this.fillMipMapTextureInOutLayout = device.createBindGroupLayout({
			label: "MipMap Generation fillMipMap Texture In-Out",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					storageTexture: {
						format: MIP_MAP_TEXTURE_FORMAT,
						viewDimension: "2d-array",
					},
				},
				{
					binding: 1,
					visibility: GPUShaderStage.COMPUTE,
					texture: {
						sampleType: "unfilterable-float",
						viewDimension: "2d-array",
					},
				},
			],
		});

		const shaderModule = device.createShaderModule({
			label: "sky-sea/mipmap.wgsl",
			code: MipMapPak,
		});

		const fillMipMapKernelLayout = device.createPipelineLayout({
			label: "MipMap Generation fillMipMap Kernel",
			bindGroupLayouts: [this.fillMipMapTextureInOutLayout],
		});

		this.fillMipMapKernel = device.createComputePipeline({
			label: "MipMap Generation fillMipMap Kernel",
			layout: fillMipMapKernelLayout,
			compute: {
				module: shaderModule,
				entryPoint: "fillMipMap",
			},
		});
		this.fillMipMapSmallerKernel = device.createComputePipeline({
			label: "MipMap Generation fillMipMapSmaller Kernel",
			layout: fillMipMapKernelLayout,
			compute: {
				module: shaderModule,
				entryPoint: "fillMipMapSmaller",
			},
		});
	}

	/**
	 * Record the commands that update mip-maps for a texture. This generates
	 * mip-map levels 1 through N from level 0, where N is the number of
	 * elements in {@link MipMapGenerationTextureBindings.bindGroupsByMipLevel}.
	 * This can be called repeatedly across frames to generate up-to-date
	 * mip-maps.
	 * @param fillMipMapsPass - A parent pass to record
	 *  commands into.
	 * @param target - The bindings for the
	 *  texture to access the mip levels of.
	 */
	recordUpdateMipMaps(
		fillMipMapsPass: GPUComputePassEncoder,
		target: MipMapGenerationTextureBindings
	): void {
		target.bindGroupsByMipLevel.forEach((bindGroup, index) => {
			fillMipMapsPass.setBindGroup(0, bindGroup);

			const previousMipScale = 1 << index;

			const threadCountX = target.level0Size.width / previousMipScale;
			const threadCountY = target.level0Size.height / previousMipScale;

			if (threadCountX >= 16 && threadCountY >= 16) {
				fillMipMapsPass.setPipeline(this.fillMipMapKernel);
				fillMipMapsPass.dispatchWorkgroups(
					threadCountX / 16,
					threadCountY / 16,
					target.arrayLevelCount
				);
			} else {
				fillMipMapsPass.setPipeline(this.fillMipMapSmallerKernel);
				fillMipMapsPass.dispatchWorkgroups(
					threadCountX,
					threadCountY,
					target.arrayLevelCount
				);
			}
		});
	}
}
