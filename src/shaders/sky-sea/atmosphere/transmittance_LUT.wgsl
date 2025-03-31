#include types.inc.wgsl
#include util/raycast.inc.wgsl

@group(0) @binding(0) var transmittance_lut: texture_storage_2d<rgba32float, write>;

@group(1) @binding(0) var<uniform> u_global: GlobalUBO;

#include atmosphere/atmosphere_common.inc.wgsl

// See 'atmosphere_common.inc.wgsl' for sources on what this method is based on.

// Transmittance LUT
//
// This map builds a transmittance LUT, a map of the transmittance of light interacting with the atmosphere parameterized by altitude and facing direction.
// This map depends entirely on the atmosphere's parameters, and NOT on any lights, cameras, or geometry.

@compute @workgroup_size(16, 16, 1)
fn computeTransmittance(@builtin(global_invocation_id) global_id : vec3<u32>,)
{
    let texel_coord = vec2<u32>(global_id.xy);
    let size = textureDimensions(transmittance_lut);
    if(texel_coord.x >= size.x || texel_coord.y >= size.y)
    {
        return;
    }
    var atmosphere: Atmosphere = u_global.atmosphere;

    let offset = vec2<f32>(0.5, 0.5);
    let uv = (vec2<f32>(texel_coord) + offset) / vec2<f32>(size);

    let r_mu: vec2<f32> = transmittanceLUT_UV_to_RMu(&atmosphere, uv, textureDimensions(transmittance_lut));

    let radius: f32 = r_mu.x;
    let direction_cosine: f32 = r_mu.y;

    let origin: vec3<f32> = vec3<f32>(0.0, radius, 0.0);
    let direction: vec3<f32> = vec3<f32>(sqrt(1.0 - direction_cosine * direction_cosine), direction_cosine, 0.0);

    let atmosphere_hit: RaySphereHit = raySphereIntersection(origin, direction, atmosphere.atmosphere_radius_Mm);
    // Could maybe skip this check, since our parameters guarantee we start within the atmosphere
    if(!atmosphere_hit.hit)
    {
        textureStore(transmittance_lut, texel_coord, vec4<f32>(1.0, 1.0, 1.0, 1.0));
        return;
    }

    let distance: f32 = atmosphere_hit.t1;

    var transmittance: vec3<f32> = vec3<f32>(1.0);

	const SAMPLE_COUNT = 500u;
    let dt: f32 = distance / f32(SAMPLE_COUNT);
    for(var i: u32 = 0; i < SAMPLE_COUNT; i++)
    {
        let t: f32 = distance * (f32(i) + 0.5) / f32(SAMPLE_COUNT);
        let position: vec3<f32> = origin + t * direction;
        let altitude: f32 = length(position) - atmosphere.planet_radius_Mm;

        let extinction_sample: ExtinctionSample = sampleExtinction(&atmosphere, altitude);

        transmittance *= exp(-abs(dt) * extinction_sample.extinction);
    }

    textureStore(transmittance_lut, texel_coord, vec4<f32>(transmittance, 1.0));
}
