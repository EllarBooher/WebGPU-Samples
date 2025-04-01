import { Mat4, Vec4, Vec3 } from 'wgpu-matrix';
import { UBO } from './util/UBO';
/**
 * The profile of light scattering and absorption for Rayleigh particles in a
 * medium. Its altitude-dependent density is modelled with a exponential
 * function `exp(-densityScale * altitude)`.
 */
export interface RayleighProfile {
    /**
     * Optical depth of scattered light per unit length.
     */
    scattering: Vec3;
    /**
     * Optical depth of absorbed light per unit length
     */
    absorption: Vec3;
    /**
     * The inner coefficient for the exponential-decay density function, with
     * units of length.
     */
    densityScale: number;
}
/**
 * @see {@link RayleighProfile}
 */
export type MieProfile = RayleighProfile;
/**
 * The profile of light scattering and absorption for Ozone in a medium. Its
 * altitude-dependent density is modelled with a hardcoded tent function.
 */
export interface OzoneProfile {
    /**
     * Optical depth of scattered light per unit length
     */
    scattering: Vec3;
    /**
     * Optical depth of absorbed light per unit length
     */
    absorption: Vec3;
}
/**
 * The parameters for the atmosphere and planet the scene is surrounded by.
 * Units are in megameters, since that is what the GPU atmosphere code uses.
 */
export interface Atmosphere {
    /**
     * The profile for Rayleigh particles.
     */
    rayleighMm: RayleighProfile;
    /**
     * The profile for Mie particles.
     */
    mieMm: MieProfile;
    /**
     * The profile for Ozone particles.
     */
    ozoneMm: OzoneProfile;
    /**
     * The uniform radius of the spherical planet, where the atmosphere begins.
     */
    planetRadiusMm: number;
    /**
     * The uniform radius of the atmosphere, the outer boundary of the
     * atmosphere. It is the sum of the planet's radius and the thickness of the
     * atmosphere.
     */
    atmosphereRadiusMm: number;
    /**
     * The albedo for the planet's surface. Unused.
     */
    groundAlbedo: Vec3;
}
/**
 * Parameters for a directional light illuminating the scene. Multiply `color`
 * and `strength` to get the RGB spectral luminance of light incident to the
 * scene.
 */
export interface CelestialLight {
    /**
     * The relative strengths of red, green, and blue light respectively.
     */
    color: Vec3;
    /**
     * The wavelength-independent magnitude of luminance/radiance for this
     * light.
     */
    strength: number;
    /**
     * The normalized direction of all rays emanating from this light source.
     */
    forward: Vec3;
    /**
     * The angle subtended by the light modelled as a disk (or distant sphere).
     * Due to the parallel light rays this angle is the same anywhere in the
     * scene.
     */
    angularRadius: number;
}
/**
 * The matrices and vectors for a perspective camera in the scene.
 */
export interface Camera {
    /**
     * Inverse of the perspective projection matrix.
     */
    invProj: Mat4;
    /**
     * Inverse of the view matrix.
     */
    invView: Mat4;
    /**
     * Precomputed product of the perspective projection and view matrix.
     */
    projView: Mat4;
    /**
     * The world-space position of the camera in the scene.
     */
    position: Vec4;
    /**
     * The world-space direction of the camera in the scene.
     */
    forward: Vec4;
}
/**
 * The timing information for a scene.
 */
export interface Time {
    /**
     * The total time that has elapsed, in seconds.
     */
    timeSeconds: number;
    /**
     * The time in seconds that has elapsed since the last frame.
     */
    deltaTimeSeconds: number;
}
/**
 * The backing data for {@link GlobalUBO}, closely matching its gpu
 * representation.
 */
export interface GlobalUBOData {
    /**
     * A camera that is used as the perspective for the generation of the
     *  screen-space warped ocean surface.
     */
    ocean_camera: Camera;
    /**
     * A second camera that is used for rendering the scene. Usually should
     *  match `ocean_camera`, but can be different for debug or demonstration
     *  purposes.
     */
    camera: Camera;
    /**
     * The parameters to define the participating medium of the sky in the
     *  scene.
     */
    atmosphere: Atmosphere;
    /**
     * The primary directional light used in the scene, coming from space.
     */
    light: CelestialLight;
    /**
     * The timing information for the scene, for a specific frame.
     */
    time: Time;
}
/**
 * A UBO containing various parameters integral to rendering. It is intended for
 * a single instance to be shared, with the same buffer bound to many pipelines.
 */
export declare class GlobalUBO extends UBO {
    /**
     * The data that will be packed and laid out in proper byte order in
     * {@link packed}, to be written to the GPU.
     */
    readonly data: GlobalUBOData;
    constructor(device: GPUDevice);
    protected packed(): Float32Array;
}
