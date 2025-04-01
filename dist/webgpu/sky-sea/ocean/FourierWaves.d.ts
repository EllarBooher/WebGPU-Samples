import { GlobalUBO } from '../GlobalUBO.ts';
import { RenderOutputTexture } from '../RenderOutputController.ts';
import { TimestampQueryInterval } from '../PerformanceTracker.ts';
/**
 * Parameters for the generation of ocean surface waves.
 */
export interface FFTWavesSettings {
    /**
     * The value of acceleration by gravity in units of meters per second
     * squared. This is used since gravity is the dominating restorative force
     * for so-called gravity waves, which tend to be all ocean waves larger than
     * a couple centimeters.
     */
    gravity: number;
    /**
     * The wind speed in meters per second. This increases the energy of the
     * waves, which increases wave height.
     */
    windSpeedMetersPerSeconds: number;
    /**
     * The distance in meters along which the wind has been blowing without
     * significantly changing direction. This represents an accumulation of
     * energy from wind, and higher values of fetch lead to a more "developed"
     * ocean surface. With high fetch, even low wind speeds can create visible
     * waves.
     */
    windFetchMeters: number;
    /**
     * A unit-less parameter on the interval [0,1]. Swell describes the wide,
     * parallel waves of a resonant frequency that dominate the ocean across a
     * long fetch. Higher values increase the height of these dominating waves.
     */
    waveSwell: number;
}
/**
 * Internal textures that can be exposed for rendering to the screen for
 * purposes of exploration, demonstration, or debug. See {@link TODO} for
 * explanations on what each texture represents.
 */
export interface FFTWaveSpectrumRenderables {
    gaussianNoise: RenderOutputTexture;
    initialAmplitude: RenderOutputTexture;
    packed_Dx_plus_iDy_Dz_iDxdz_Amplitude: RenderOutputTexture;
    packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude: RenderOutputTexture;
    turbulenceJacobian: RenderOutputTexture;
    Dx_Dy_Dz_Dxdz_Spatial: RenderOutputTexture;
    Dydx_Dydz_Dxdx_Dzdz_Spatial: RenderOutputTexture;
}
/**
 * The final spatial displacement/displacement derivative maps that can be
 * consumed to generate ocean surface vertices and normal maps.
 */
export declare class FFTWaveDisplacementMaps {
    private Dx_Dy_Dz_Dxdz_Spatial;
    private Dydx_Dydz_Dxdx_Dzdz_Spatial;
    private turbulenceJacobian;
    /**
     * The number of mip levels for every map in this collection.
     * @readonly
     */
    get mipLevelCount(): number;
    /**
     * Contains `(Dx,Dy,Dz,d/dz Dx)` packed in RGBA, where `(Dx,Dy,Dz)` is the
     * displacement of the ocean surface at the sampled point and `d/di` is the
     * partial derivative with respect to coordinate `i`. The dimension is
     * `2d-array`, and each array layer represents one cascade.
     * @readonly
     */
    readonly Dx_Dy_Dz_Dxdz_SpatialAllMips: GPUTextureView;
    /**
     * Contains `(d/dx Dy,d/dz Dy,d/dx Dx,d/dz Dz)` packed in RGBA, where
     * `(Dx,Dy,Dz)` is the displacement of the ocean surface at the sampled
     * point and `d/di` is the partial derivative with respect to coordinate
     * `i`. The dimension is `2d-array`, and each array layer represents one
     * cascade.
     */
    readonly Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips: GPUTextureView;
    /**
     * Contains (turbulence, jacobian, 0, 0) packed in RGBA. The jacobian is a
     * value derived from the surface derivatives. Turbulence is an arbitrary
     * derived value on the interval [0,1], where 1 represents a calm surface
     * and 0 represents a turbulent surface. Turbulence is accumulated between
     * frames and is a good source for how much foam to render at a position.
     * The elements of the javascript array are identically defined, but rotated
     * each frame.
     * @see {@link FFTWaveSpectrumResources.turbulenceMapIndex} for
     * which index is active.
     */
    readonly turbulenceJacobianOneMip: GPUTextureView[];
    constructor(Dx_Dy_Dz_Dxdz_Spatial: GPUTexture, Dydx_Dydz_Dxdx_Dzdz_Spatial: GPUTexture, turbulenceJacobian: GPUTexture[]);
}
/**
 * Produce a spectrum of ocean waves on a square grid, using the fourier
 * transform to transform from frequency to space, to produce displacement and
 * gradient maps that can be applied to an ocean surface mesh.
 */
export declare class FFTWaveSpectrumResources {
    private gridSize;
    private cascadeCount;
    /**
     * The extent used by every texture parameterized by the fourier grid.
     */
    private get textureGridSize();
    private initialAmplitudeKernel;
    private timeDependentAmplitudeKernel;
    private accumulateTurbulenceKernel;
    private dfftResources;
    private mipMapGenerator;
    private cascades;
    private Dx_Dy_Dz_Dxdz_SpatialArray;
    private Dydx_Dydz_Dxdx_Dzdz_SpatialArray;
    private turbulenceJacobianArrays;
    private turbulenceJacobianGroup1;
    private turbulenceJacobianIndex;
    /**
     * Gets the index of the turbulence-jacobian map that will be (or was)
     * written into this frame.
     * @readonly
     */
    get turbulenceMapIndex(): number;
    private Dx_Dy_Dz_Dxdz_SpatialArray_MipMapBindings;
    private Dydx_Dydz_Dxdx_Dzdz_SpatialArray_MipMapBindings;
    private waveSettings;
    private createCascades;
    /**
     * Instantiates all the cascades and resources.
     * @param device - The WebGPU device to use.
     * @param globalUBO - The global UBO that will be bound into
     * 	pipelines.
     */
    constructor(device: GPUDevice, globalUBO: GlobalUBO, log2GridSize: number);
    /**
     * @returns The views into all the FFT Wave textures, for read-only display
     *  purposes.
     */
    views(): FFTWaveSpectrumRenderables;
    /**
     * @returns The views into the displacement maps that are the output of the
     *  ocean spectrum.
     */
    displacementMaps(): FFTWaveDisplacementMaps;
    /**
     * Records the commands that fill the persistent displacement maps returned
     * by {@link displacementMaps}.
     * @param device - The WebGPU device to use.
     * @param commandEncoder - The command encoder to record into.
     * @param settings - The parameters for the wave spectrum, determine the
     *  shape and amplitude of the waves.
     * @param timestampInterval - The interval to record timing information
     *  into.
     */
    record(device: GPUDevice, commandEncoder: GPUCommandEncoder, settings: FFTWavesSettings, timestampInterval: TimestampQueryInterval | undefined): void;
}
