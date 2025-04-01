import { GUI as LilGUI } from 'lil-gui';
import { Extent3D } from './Common';
/**
 * @see {@link RenderOutputTag} for the enum this array backs.
 */
export declare const RenderOutputTags: readonly ["Scene", "GBufferColor", "GBufferNormal", "AtmosphereTransmittanceLUT", "AtmosphereMultiscatterLUT", "AtmosphereSkyviewLUT", "AtmosphereAerialPerspectiveLUT", "FFTWaveSpectrumGaussianNoise", "FFTWaveInitialAmplitude", "FFTWaveDx_plus_iDy_Dz_iDxdz_Amplitude", "FFTWaveDydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude", "FFTWaveTurbulenceJacobian", "FFTWaveDx_Dy_Dz_Dxdz_Spatial", "FFTWaveDydx_Dydz_Dxdx_Dzdz_Spatial"];
/**
 * Identifiers for render output targets supported by the renderer.
 */
export type RenderOutputTag = (typeof RenderOutputTags)[number];
/**
 * Stores a view to a texture, alongside information like the depth, mip levels,
 * and dimension, for binding to a pipeline that renders it to the screen.
 */
export declare class RenderOutputTexture {
    private texture;
    readonly view: GPUTextureView;
    readonly viewDimension: GPUTextureViewDimension;
    /**
     * The number of mip levels in the texture.
     * @readonly
     */
    get mipLevelCount(): number;
    /**
     * The extent of the texture.
     * @readonly
     */
    get extent(): Extent3D;
    /**
     * Uses the passed texture to create a view, while storing the texture
     * object so that the properties can be queried later. The resulting view
     * will have dimension "1d", "2d", "2d-array", or "3d" and will match the
     * texture.
     * @param texture - The texture to store and create a view of.
     */
    constructor(texture: GPUTexture);
}
/**
 * The parameters for transforming an instance of `{@link RenderOutputTexture}`
 * while sampling it for presentation.
 */
export declare class RenderOutputTransform {
    flip: boolean;
    colorGain: {
        r: number;
        g: number;
        b: number;
    };
    channelMasks: {
        r: boolean;
        g: boolean;
        b: boolean;
    };
    swapBARG: boolean;
    mipLevel: number;
    arrayLayer: number;
}
/**
 * This manages the selection from a list of possible targets that can be
 * presented as the final output of the renderer, alongside persisting
 * transformations to use when rendering that target. See
 * {@link RenderOutputTags} for the possible outputs, and
 * {@link RenderOutputTransform} for the properties that are transformed during
 * rendering.
 */
export declare class RenderOutputController {
    private options;
    private textureProperties;
    private controllers;
    /**
     * @returns The target and transform of the currently selected render
     * output.
     */
    current(): {
        tag: RenderOutputTag;
        transform: RenderOutputTransform;
    };
    private updateVariableControllerBounds;
    /**
     * Set the per-texture data for a given render output, restricting what
     * values can be set in the UI, such as not accessing out-of-bounds mipmap
     * levels.
     * @param tag - The render output to tweak the parameters for.
     * @param mipLevelCount - The upper bound of what mip level can be set in
     *  the UI.
     * @param depthOrArrayLayerCount - The upper bound of what array layer (or
     *  depth) can be set in the UI.
     */
    setTextureProperties(props: {
        tag: RenderOutputTag;
        mipLevelCount: number;
        depthOrArrayLayerCount: number;
    }): void;
    private setOutput;
    private setUniformColorScale;
    /**
     * Adds this controller to the UI.
     * @param gui - The root level GUI to attach to.
     */
    setupUI(gui: LilGUI): void;
    constructor();
}
