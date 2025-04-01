#include types.inc.wgsl
#include util/raycast.inc.wgsl

@group(0) @binding(0) var multiscatter_lut: texture_storage_2d<rgba32float, write>;
@group(0) @binding(1) var lut_sampler: sampler;
@group(0) @binding(2) var transmittance_lut: texture_2d<f32>;

@group(1) @binding(0) var<uniform> u_global: GlobalUBO;

#include atmosphere/atmosphere_common.inc.wgsl
#include atmosphere/atmosphere_raymarch.inc.wgsl ISOTROPIC_PHASE LIGHT_ILLUMINANCE_IS_ONE HIGH_SAMPLE_COUNT

// See 'atmosphere_common.inc.wgsl' for sources on what this method is based on.

// This shader builds a 2D multiscattering LUT, where each position stores the light from second and higher order
// scattering in a large neighborhood.
//
// We can reasonably assume 2nd order scattering is the same for a sufficiently large neighborhood around a sample.
// Thus, it is reasonable to assume 2nd order scattering is globally uniform from the view of a sample point. Hillaire
// notes a correlation between 2nd order scattering and all other orders, meaning we should be able to reasonably
// estimate all scattering orders from just the 2nd with a complexity of O(1), independent of the number of orders we
// wish to estimate.
//
// So:
// 1) We compute the second order scattered luminance L_2ndOrder at a point. This is computed with the same scattering
// rendering equation ((1) from Hillaire 2020), except we use an isotropic/uniform phase function. 2) We compute a
// multiscattering transfer factor (f_ms in Hillaire 2020). It is a global and unitless measure of the fraction of
// scattered energy reaching this point, and is only useful when assuming n-th order scattering reaching each point is
// uniform.
//
// Thus, L_(n+1)thOrder = f_ms * L_nthOrder, and we compute the total multiscattering luminance:
// L_2ndOrder + L_3rdOrder + L_4thOrder + ... = L_2ndOrder(1 + f_ms + f_ms ^ 2 + ...) = L_2ndOrder / (1 - f_ms)
// Care is taken to ensure that f_ms remains in the radius of convergence.
// This value can then be sampled in later integrals, to give us a better estimate of scattered luminance.
// Compare equations (1) and (11) in Hillaire.
//
// This table needs to only be recomputed if the atmosphere parameters change:
// it is global for the planet and independent of sun direction or view position.
// Note it DOES depend on the size of the sun
//
// We are able to store the multiscattering in a 2D map because the atmospheric medium (aerosols, ozone, gasses like
// nitrogen) is distributed based only on altitude and the planet is a sphere.
//
// For a given sample position x and light direction v (v towards light, NOT incident)
// u := 0.5 + 0.5 * cos(sunZenith)
// u = 0.5 + 0.5 * x.v / (|x| * |v|)
//
// Planet radius R_bot and atmosphere radius R_top
// v := clamp((|x| - R_bot)/(R_top - R_bot), 0, 1)

@compute @workgroup_size(16, 16, 1)
fn computeMultiscattering(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let texel_coord = vec2<u32>(global_id.xy);
    let size = textureDimensions(multiscatter_lut);
    if texel_coord.x >= size.x || texel_coord.y >= size.y {
        return;
    }
    var atmosphere: Atmosphere = u_global.atmosphere;

    let offset = vec2<f32>(0.5, 0.5);
    let uv = (vec2<f32>(texel_coord) + offset) / vec2<f32>(size);

    let r_mu_light = multiscatterLUT_UV_to_RMu(&atmosphere, uv, textureDimensions(multiscatter_lut));

    let origin = vec3<f32>(0.0, r_mu_light.x, 0.0);

    let cos_sun_zenith: f32 = clamp(r_mu_light.y, -1.0, 1.0);
    let sin_sun_zenith: f32 = safeSqrt(1.0 - cos_sun_zenith * cos_sun_zenith);

    // SunZenith is relative to origin
    // As established, scattering is symmetrical around up axis, so just pick an azimuth = 0 for sun
    // PORTING NOTE: should y be negative? I'm getting flipped around with the coordinates
    let sun_direction = vec3<f32>(0.0, cos_sun_zenith, sin_sun_zenith);

    // TODO: remove this
    var light: CelestialLight = u_global.light;
    light.forward = -sun_direction;

    // Unmarked units are in megameters (10^6 meters or 1000 km)

    // We evaluate scattering luminance and transfer in all directions from our sample point.
    // So we sample a finite amount of uniformly distributed directions.

    var luminance_second_order = vec3<f32>(0.0);
    var multiscattering_transfer = vec3<f32>(0.0);

    // There is an accumulated constant bias in sample directions, but it is quite small and does not matter for the
    // small sample counts we shall be using
    // TODO: mitigate the artifacts that seem to occur due to how we are sampling the directions. For some reason
    // prime/odd numbers seem to avoid bands that occur at higher altitudes, that is independent of sun angle.
    const SAMPLE_COUNT_SQRT = 5u;
    const SAMPLE_COUNT = SAMPLE_COUNT_SQRT * SAMPLE_COUNT_SQRT;
    for (var sample_index = 0u; sample_index < SAMPLE_COUNT; sample_index++) {
        // 0, 0, 0, 0, 1, 1, 1, 1, ...
        let azimuthal_index = f32(sample_index) / f32(SAMPLE_COUNT_SQRT);

        // 0, 1, 2, 3, 0, 1, 2, 3, ...
        let zenith_index = f32(sample_index % SAMPLE_COUNT_SQRT) + 0.5;
        // let zenith_index = 0;

        let azimuth = 2.0 * PI * f32(azimuthal_index) / f32(SAMPLE_COUNT_SQRT);

        let cos_azimuth = cos(azimuth);
        let sin_azimuth = sin(azimuth);

        // sin_zenith is always positive since zenith ranges from 0 to pi
        let cos_zenith = clamp(
            2.0 * f32(zenith_index) / f32(SAMPLE_COUNT_SQRT) - 1.0,
            -1.0, 1.0
        );
        let sin_zenith = sqrt(1.0 - cos_zenith * cos_zenith);

        // Uniformly distributed on unit sphere direction
        let direction = vec3<f32>(sin_azimuth * sin_zenith, cos_zenith, cos_azimuth * sin_zenith);

		let atmosphere_raycast = raycastAtmosphere(&atmosphere, origin, direction);

        let include_ground = true;
        let scattering = computeLuminanceScatteringIntegral(
            &atmosphere,
            &light,
            lut_sampler,
            transmittance_lut,
			origin + direction * atmosphere_raycast.t_min,
			direction,
			include_ground,
			atmosphere_raycast.intersects_ground,
			atmosphere_raycast.t_max - atmosphere_raycast.t_min
        );
        // let scattering = ScatteringResult(vec3<f32>(0.0), vec3<f32>(0.0));

        // dw in equations (5) and (7) in Hillaire 2020
    	const SPHERE_SOLID_ANGLE = 4.0 * PI;
        let sample_solid_angle = SPHERE_SOLID_ANGLE / f32(SAMPLE_COUNT);

        // Equations (6) and (8)
        luminance_second_order += scattering.luminance * sample_solid_angle;
        multiscattering_transfer += scattering.multiscattering_transfer * sample_solid_angle;
    }

    // Equations (5) and (7)
    let inscattering = luminance_second_order * ISOTROPIC_PHASE;
    let scattering_transfer = multiscattering_transfer * ISOTROPIC_PHASE;

    // Geometric sum with r = multiscattering_transfer
    let infinite_scattering_transfer = vec3<f32>(1.0 / (1.0 - scattering_transfer));

    // Equation (10)
    let multiscattering = infinite_scattering_transfer * inscattering;

    textureStore(multiscatter_lut, texel_coord, vec4<f32>(multiscattering, 1.0));
}
