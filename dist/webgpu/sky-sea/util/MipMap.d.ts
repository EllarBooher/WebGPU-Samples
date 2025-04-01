/**
 * External bindings used for filling the mipmaps of a single texture.
 * @see {@link MipMapGenerationPassResources}
 */
export interface MipMapGenerationTextureBindings {
    bindGroupsByMipLevel: GPUBindGroup[];
    level0Size: {
        width: number;
        height: number;
    };
    arrayLevelCount: number;
}
/**
 * This contains the resources for generating mipmaps for 2D textures, including
 * texture arrays.
 */
export declare class MipMapGenerationPassResources {
    private fillMipMapTextureInOutLayout;
    private fillMipMapKernel;
    private fillMipMapSmallerKernel;
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
    createBindGroups(device: GPUDevice, texture: GPUTexture): MipMapGenerationTextureBindings;
    constructor(device: GPUDevice);
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
    recordUpdateMipMaps(fillMipMapsPass: GPUComputePassEncoder, target: MipMapGenerationTextureBindings): void;
}
