var ue = Object.defineProperty;
var le = (u, e, t) => e in u ? ue(u, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[e] = t;
var a = (u, e, t) => le(u, typeof e != "symbol" ? e + "" : e, t);
import { v as z, m as x, a as S, b as T } from "./wgpu-matrix.module-CE_7eKYK.js";
const _e = 4;
class R {
  /**
   * Allocates the backing buffer with a given size.
   * @param device - The WebGPU device to use.
   * @param lengthFloat32 - The length of the buffer in 32-bit
   *  (4-byte) floats.
   * @param label - A label for debugging purposes, used by WebGPU.
   */
  constructor(e, t, r) {
    /**
     * The device buffer that is uploaded to.
     */
    a(this, "buffer");
    this.buffer = e.createBuffer({
      size: t * _e,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
      label: r
    });
  }
  /**
   * Writes the bytes of the host data into the device buffer.
   * @param queue - The device queue to submit the synchronous
   *  write command into.
   */
  writeToGPU(e) {
    const t = this.packed();
    t.byteLength != this.buffer.size && console.warn(
      `GPUBuffer label: '${this.buffer.label}' uploaded with improper size. Expected: ${this.buffer.size} bytes, got ${t.byteLength} bytes.`
    ), e.writeBuffer(this.buffer, 0, t);
  }
}
function ce() {
  return {
    rayleighMm: {
      scattering: S.create(5.802, 13.558, 33.1),
      absorption: S.create(0, 0, 0),
      densityScale: 8e-3
    },
    mieMm: {
      scattering: S.create(3.996, 3.996, 3.996),
      absorption: S.create(4.4, 4.4, 4.4),
      densityScale: 12e-4
    },
    ozoneMm: {
      scattering: S.create(0, 0, 0),
      absorption: S.create(0.65, 1.881, 0.085)
    },
    planetRadiusMm: 6.36,
    atmosphereRadiusMm: 6.42,
    // Unitless albedo
    // Values are arbitrary
    groundAlbedo: S.create(0.3 * 1, 0.3 * 0.75, 0.3 * 0.4)
  };
}
function me() {
  return {
    color: S.create(1, 1, 1),
    strength: 10,
    forward: S.create(0, -1, 0),
    angularRadius: 16 / 60 * (3.141592653589793 / 180)
  };
}
const de = 16, pe = 128, fe = 16, he = 32, ge = 16, k = 256, ve = 16, ye = 16;
function xe(u, e) {
  return Math.ceil(e / u) * u;
}
const be = Math.max(
  de,
  fe,
  ge,
  ve
), Se = xe(
  be,
  k + k + pe + he + ye
);
class Te extends R {
  constructor(t) {
    super(t, Se / 4, "Global UBO");
    /**
     * The data that will be packed and laid out in proper byte order in
     * {@link packed}, to be written to the GPU.
     */
    a(this, "data", {
      atmosphere: ce(),
      light: me(),
      camera: {
        invProj: x.identity(),
        invView: x.identity(),
        projView: x.identity(),
        position: z.create(0, 0, 0, 1),
        forward: z.create(0, 0, -1, 0)
      },
      ocean_camera: {
        invProj: x.identity(),
        invView: x.identity(),
        projView: x.identity(),
        position: z.create(0, 0, 0, 1),
        forward: z.create(0, 0, -1, 0)
      },
      time: {
        timeSeconds: 0,
        deltaTimeSeconds: 0
      }
    });
  }
  packed() {
    const t = new Float32Array(2).fill(0), r = new Float32Array(4).fill(0), i = new Float32Array(4 * 2).fill(0), n = this.data.atmosphere, o = n.rayleighMm, s = n.mieMm, l = new Float32Array([
      ...o.scattering,
      o.densityScale,
      ...o.absorption,
      n.planetRadiusMm,
      ...s.scattering,
      s.densityScale,
      ...s.absorption,
      n.atmosphereRadiusMm,
      ...n.groundAlbedo,
      0,
      ...n.ozoneMm.scattering,
      0,
      ...n.ozoneMm.absorption,
      0,
      ...r
    ]), _ = this.data.light, m = new Float32Array([
      ..._.color,
      _.strength,
      ..._.forward,
      _.angularRadius
    ]), c = this.data.camera, v = new Float32Array([
      ...c.invProj,
      ...c.invView,
      ...c.projView,
      ...c.position,
      ...c.forward,
      ...i
    ]), h = this.data.ocean_camera, y = new Float32Array([
      ...h.invProj,
      ...h.invView,
      ...h.projView,
      ...h.position,
      ...h.forward,
      ...i
    ]), d = this.data.time, g = new Float32Array([
      ...t,
      d.timeSeconds,
      d.deltaTimeSeconds
    ]);
    return new Float32Array([
      ...v,
      ...y,
      ...l,
      ...m,
      ...g
    ]);
  }
}
const we = `struct Atmosphere
{
scattering_rayleigh_per_Mm : vec3<f32>,
density_scale_rayleigh_Mm : f32,
absorption_rayleigh_per_Mm : vec3<f32>,
planet_radius_Mm : f32,
scattering_mie_per_Mm : vec3<f32>,
density_scale_mie_Mm : f32,
absorption_mie_per_Mm : vec3<f32>,
atmosphere_radius_Mm : f32,
ground_albedo : vec3<f32>,
padding0 : f32,
scattering_ozone_per_Mm : vec3<f32>,
padding1 : f32,
absorption_ozone_per_Mm : vec3<f32>,
padding2 : f32,
padding3 : vec4<f32>,
}
struct CelestialLight
{
color: vec3<f32>,
strength: f32,
forward: vec3<f32>,
angular_radius: f32,
}
struct Camera
{
inv_proj: mat4x4<f32>,
inv_view: mat4x4<f32>,
proj_view: mat4x4<f32>,
position: vec4<f32>,
forward: vec4<f32>,
padding0: mat2x4<f32>,
}
struct Time
{
padding0: vec2<f32>,
time_seconds: f32,
delta_time_seconds: f32,
}
struct GlobalUBO
{
camera: Camera,
ocean_camera: Camera,
atmosphere: Atmosphere,
light: CelestialLight,
time: Time,
}
struct RaySphereHit
{
hit: bool,
t0: f32,
t1: f32,
}
fn raySphereIntersection(
ray_origin: vec3<f32>,
ray_direction_normalized: vec3<f32>,
radius: f32
) -> RaySphereHit
{
let f: vec3<f32> = ray_origin;
let d: vec3<f32> = ray_direction_normalized;
let b: f32 = -1.0 * dot(f, d);
let center_to_intersection_chord: vec3<f32> = f + b * d;
let discriminant: f32 = radius * radius - dot(center_to_intersection_chord, center_to_intersection_chord);
let c: f32 = dot(f, f) - radius * radius;
var output : RaySphereHit;
output.hit = false;
output.t0 = 0.0;
output.t1 = 0.0;
if (discriminant < 0.0)
{
return output;
}
var q: f32 = b;
if (b < 0.0)
{
q -= sqrt(discriminant);
}
else
{
q += sqrt(discriminant);
}
output.hit = true;
output.t0 = c / q;
output.t1 = q;
if (output.t0 > output.t1)
{
let temp: f32 = output.t0;
output.t0 = output.t1;
output.t1 = temp;
}
return output;
}
struct RayPlaneHit {
hit: bool,
t: f32,
}
fn rayPlaneIntersection(
ray_origin: vec3<f32>,
ray_direction: vec3<f32>,
plane_origin: vec3<f32>,
plane_normal: vec3<f32>
) -> RayPlaneHit
{
var result: RayPlaneHit;
let perp = dot(plane_normal, ray_direction);
result.t = dot(plane_origin - ray_origin, plane_normal) / perp;
result.hit = (abs(perp) > 0.00001) && (result.t > 0.0);
return result;
}
@group(0) @binding(0) var transmittance_lut: texture_storage_2d<rgba32float, write>;
@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
const PI = 3.141592653589793;
const METERS_PER_MM = 1000000;
const AERIAL_PERSPECTIVE_MM_PER_SLICE = 0.001;
const ISOTROPIC_PHASE = 1.0 / (4.0 * PI);
fn safeSqrt(value: f32) -> f32 { return sqrt(max(value, 0.0)); }
fn textureCoordFromUnitRange(value: f32, length: u32) -> f32
{
return 0.5 / f32(length) + value * (1.0 - 1.0 / f32(length));
}
fn unitRangeFromTextureCoord(coord: f32 , length: u32) -> f32
{
return (coord - 0.5 / f32(length)) / (1.0 - 1.0 / f32(length));
}
fn transmittanceLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let atmosphere_radius_Mm_squared: f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared: f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h: f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho: f32 = safeSqrt(radius * radius - planet_radius_Mm_squared);
let d: f32 = max(-radius * mu + safeSqrt(radius * radius * (mu * mu - 1.0) + atmosphere_radius_Mm_squared), 0.0);
let d_min: f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max: f32 = rho + h;
let x_mu: f32 = (d - d_min) / (d_max - d_min);
let x_radius: f32 = rho / h;
return vec2<f32>(
textureCoordFromUnitRange(x_mu, dimensions.x),
textureCoordFromUnitRange(x_radius, dimensions.y)
);
}
fn transmittanceLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let x_mu : f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let x_radius : f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let atmosphere_radius_Mm_squared : f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared : f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h : f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho : f32 = h * x_radius;
let radius : f32 = safeSqrt(rho * rho + planet_radius_Mm_squared);
let d_min : f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max : f32 = rho + h;
let d : f32 = (d_max - d_min) * x_mu + d_min;
let D_EPSILON: f32 = 0.000000001;
if (d < D_EPSILON)
{
return vec2<f32>(radius, 1.0);
}
let mu : f32 = (h * h - rho * rho - d * d) / (2.0 * radius * d);
return vec2<f32>(radius, clamp(mu, -1.0, 1.0));
}
fn multiscatterLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = 0.5 + 0.5 * mu_light;
let v_unit: f32 = clamp(
(radius - (*atmosphere).planet_radius_Mm)
/ ((*atmosphere).atmosphere_radius_Mm - (*atmosphere).planet_radius_Mm),
0.0, 1.0
);
return vec2<f32>(
textureCoordFromUnitRange(u_unit, dimensions.x),
textureCoordFromUnitRange(v_unit, dimensions.y)
);
}
fn multiscatterLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let v_unit: f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let mu_light: f32 = 2.0 * (u_unit - 0.5);
let radius: f32 = mix(
(*atmosphere).planet_radius_Mm * (1.0002),
(*atmosphere).atmosphere_radius_Mm * (0.9998),
v_unit
);
return vec2<f32>(radius, mu_light);
}
fn sampleMultiscatterLUT(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32
) -> vec3<f32>
{
let uv: vec2<f32> = multiscatterLUT_RMu_to_UV(
atmosphere,
radius,
mu_light,
textureDimensions(lut)
);
return textureSampleLevel(lut, s, uv, 0.0).xyz;
}
fn sampleTransmittanceLUT_RadiusMu(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32
) -> vec3<f32>
{
let uv: vec2<f32> = transmittanceLUT_RMu_to_UV(
atmosphere,
radius,
mu,
textureDimensions(lut)
);
let sample = textureSampleLevel(lut, s, uv, 0.0).xyz;
return sample;
}
fn sampleTransmittanceLUT_Ray(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
position: vec3<f32>,
direction: vec3<f32>
) -> vec3<f32>
{
let radius: f32 = length(position);
let mu: f32 = (dot(position, direction) / (length(position) * length(direction)));
return sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, radius, mu);
}
fn sampleTransmittanceLUT_Segment(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
r_start: f32,
mu_start: f32,
d: f32,
intersects_ground: bool
) -> vec3<f32>
{
let r_end = clamp(
safeSqrt(d * d + 2.0 * r_start * mu_start * d + r_start * r_start),
(*atmosphere).planet_radius_Mm, (*atmosphere).atmosphere_radius_Mm
);
let mu_end = clamp((r_start * mu_start + d) / r_end, -1.0, 1.0);
if(intersects_ground)
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, -mu_end)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, -mu_start),
vec3<f32>(1.0)
);
}
else
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, mu_start)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, mu_end),
vec3<f32>(1.0)
);
}
}
struct ExtinctionSample
{
scattering_rayleigh: vec3<f32>,
scattering_mie: vec3<f32>,
scattering_ozone: vec3<f32>,
absorption_rayleigh: vec3<f32>,
absorption_mie: vec3<f32>,
absorption_ozone: vec3<f32>,
scattering: vec3<f32>,
extinction: vec3<f32>,
}
fn densityExponential(altitude: f32, density_scale: f32) -> f32
{ return exp(-altitude / density_scale); }
fn densityTent(altitude_km: f32) -> f32
{ return max(0.0, 1.0 - abs(altitude_km - 25.0) / 15.0); }
fn sampleExtinction(atmosphere: ptr<function,Atmosphere>, altitude_Mm: f32) -> ExtinctionSample
{
let density_rayleigh: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_rayleigh_Mm);
let scattering_rayleigh: vec3<f32> = (*atmosphere).scattering_rayleigh_per_Mm * density_rayleigh;
let absorption_rayleigh: vec3<f32> = (*atmosphere).absorption_rayleigh_per_Mm * density_rayleigh;
let density_mie: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_mie_Mm);
let scattering_mie: vec3<f32> = (*atmosphere).scattering_mie_per_Mm * density_mie;
let absorption_mie: vec3<f32> = (*atmosphere).absorption_mie_per_Mm * density_mie;
let density_ozone: f32 = densityTent(altitude_Mm * 1000.0);
let scattering_ozone: vec3<f32> = (*atmosphere).scattering_ozone_per_Mm * density_ozone;
let absorption_ozone: vec3<f32> = (*atmosphere).absorption_ozone_per_Mm * density_ozone;
var extinction_sample: ExtinctionSample;
extinction_sample.scattering_rayleigh = scattering_rayleigh;
extinction_sample.scattering_mie = scattering_mie;
extinction_sample.scattering_ozone = scattering_ozone;
extinction_sample.absorption_rayleigh = absorption_rayleigh;
extinction_sample.absorption_mie = absorption_mie;
extinction_sample.absorption_ozone = absorption_ozone;
extinction_sample.scattering = scattering_rayleigh + scattering_mie + scattering_ozone;
extinction_sample.extinction = extinction_sample.scattering + absorption_rayleigh + absorption_mie + absorption_ozone;
return extinction_sample;
}
fn phaseRayleigh(cosine: f32) -> f32
{
let scalar: f32 = 3.0 / (16.0 * PI);
let numerator: f32 = (1.0 + cosine * cosine);
return scalar * numerator;
}
fn phaseMie(cosine: f32, g: f32) -> f32
{
let scalar: f32 = 3.0 / (8.0 * PI);
let numerator: f32 = (1.0 - g * g) * (1.0 + cosine * cosine);
let denominator: f32 = (2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * cosine, 1.5);
return scalar * numerator / denominator;
}
struct RaymarchStep
{
radius: f32,
mu: f32,
mu_light: f32,
nu: f32,
};
fn stepRadiusMu(
start: RaymarchStep,
step_distance: f32,
) -> RaymarchStep
{
var result: RaymarchStep;
result.radius = safeSqrt(
step_distance * step_distance + 2.0 * start.radius * start.mu * step_distance
+ start.radius * start.radius
);
result.mu = (start.radius * start.mu + step_distance) / result.radius;
result.nu = start.nu;
result.mu_light = (start.radius * start.mu_light + step_distance * start.nu) / result.radius;
return result;
}
fn sampleTransmittanceLUT_RayMarchStep(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
start: RaymarchStep,
step_distance: f32
) -> vec3<f32>
{
const STEP_DISTANCE_EPSILON = 0.0000001;
if (step_distance < STEP_DISTANCE_EPSILON)
{
return vec3<f32>(1.0);
}
let end: RaymarchStep = stepRadiusMu(start, step_distance);
var transmittance = vec3<f32>(0.0);
if (start.mu > 0.0)
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, start.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, end.mu);
}
else
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, -end.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, -start.mu);
}
return clamp(transmittance, vec3<f32>(0.0), vec3<f32>(1.0));
}
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
`, Me = "rgba32float";
class ze {
  /**
   * Initializes all resources related to the transmittance lookup table.
   * @param device - The WebGPU device to use.
   * @param dimensions - The dimensions to use for the LUT texture.
   * @param globalUBO - The global UBO to bind and use when
   * 	rendering the LUT.
   */
  constructor(e, t, r) {
    /**
     * The transmittance lookup table texture.
     */
    a(this, "texture");
    /**
     * The view into {@link texture}.
     */
    a(this, "view");
    /*
     * @group(0) @binding(0) var transmittance_lut: texture_storage_2d<rgba32float, write>;
     *
     * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
     */
    a(this, "pipeline");
    a(this, "group0");
    a(this, "group1");
    this.texture = e.createTexture({
      size: t,
      dimension: "2d",
      format: Me,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Transmittance LUT"
    }), this.view = this.texture.createView({ label: "Transmittance LUT" });
    const i = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            access: "write-only",
            format: this.texture.format
          }
        }
      ],
      label: "Transmittance LUT Group 0"
    }), n = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {}
        }
      ],
      label: "Transmittance LUT Group 1"
    }), o = e.createShaderModule({
      code: we,
      label: "Transmittance LUT"
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: o,
        entryPoint: "computeTransmittance"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [i, n]
      }),
      label: "Transmittance LUT"
    }), this.group0 = e.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: this.view
        }
      ],
      label: "Transmittance LUT Group 0"
    }), this.group1 = e.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(1),
      entries: [
        {
          binding: 0,
          resource: { buffer: r.buffer }
        }
      ],
      label: "Transmittance LUT Group 1"
    });
  }
  /**
   * Records the population of the lookup table.
   * @param commandEncoder - The command encoder to record
   *  into.
   */
  record(e) {
    const t = e.beginComputePass({
      label: "Transmittance LUT"
    });
    t.setPipeline(this.pipeline), t.setBindGroup(0, this.group0), t.setBindGroup(1, this.group1), t.dispatchWorkgroups(
      Math.ceil(this.texture.width / 16),
      Math.ceil(this.texture.height / 16)
    ), t.end();
  }
}
const De = `struct Atmosphere
{
scattering_rayleigh_per_Mm : vec3<f32>,
density_scale_rayleigh_Mm : f32,
absorption_rayleigh_per_Mm : vec3<f32>,
planet_radius_Mm : f32,
scattering_mie_per_Mm : vec3<f32>,
density_scale_mie_Mm : f32,
absorption_mie_per_Mm : vec3<f32>,
atmosphere_radius_Mm : f32,
ground_albedo : vec3<f32>,
padding0 : f32,
scattering_ozone_per_Mm : vec3<f32>,
padding1 : f32,
absorption_ozone_per_Mm : vec3<f32>,
padding2 : f32,
padding3 : vec4<f32>,
}
struct CelestialLight
{
color: vec3<f32>,
strength: f32,
forward: vec3<f32>,
angular_radius: f32,
}
struct Camera
{
inv_proj: mat4x4<f32>,
inv_view: mat4x4<f32>,
proj_view: mat4x4<f32>,
position: vec4<f32>,
forward: vec4<f32>,
padding0: mat2x4<f32>,
}
struct Time
{
padding0: vec2<f32>,
time_seconds: f32,
delta_time_seconds: f32,
}
struct GlobalUBO
{
camera: Camera,
ocean_camera: Camera,
atmosphere: Atmosphere,
light: CelestialLight,
time: Time,
}
struct RaySphereHit
{
hit: bool,
t0: f32,
t1: f32,
}
fn raySphereIntersection(
ray_origin: vec3<f32>,
ray_direction_normalized: vec3<f32>,
radius: f32
) -> RaySphereHit
{
let f: vec3<f32> = ray_origin;
let d: vec3<f32> = ray_direction_normalized;
let b: f32 = -1.0 * dot(f, d);
let center_to_intersection_chord: vec3<f32> = f + b * d;
let discriminant: f32 = radius * radius - dot(center_to_intersection_chord, center_to_intersection_chord);
let c: f32 = dot(f, f) - radius * radius;
var output : RaySphereHit;
output.hit = false;
output.t0 = 0.0;
output.t1 = 0.0;
if (discriminant < 0.0)
{
return output;
}
var q: f32 = b;
if (b < 0.0)
{
q -= sqrt(discriminant);
}
else
{
q += sqrt(discriminant);
}
output.hit = true;
output.t0 = c / q;
output.t1 = q;
if (output.t0 > output.t1)
{
let temp: f32 = output.t0;
output.t0 = output.t1;
output.t1 = temp;
}
return output;
}
struct RayPlaneHit {
hit: bool,
t: f32,
}
fn rayPlaneIntersection(
ray_origin: vec3<f32>,
ray_direction: vec3<f32>,
plane_origin: vec3<f32>,
plane_normal: vec3<f32>
) -> RayPlaneHit
{
var result: RayPlaneHit;
let perp = dot(plane_normal, ray_direction);
result.t = dot(plane_origin - ray_origin, plane_normal) / perp;
result.hit = (abs(perp) > 0.00001) && (result.t > 0.0);
return result;
}
@group(0) @binding(0) var multiscatter_lut: texture_storage_2d<rgba32float, write>;
@group(0) @binding(1) var lut_sampler: sampler;
@group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
const PI = 3.141592653589793;
const METERS_PER_MM = 1000000;
const AERIAL_PERSPECTIVE_MM_PER_SLICE = 0.001;
const ISOTROPIC_PHASE = 1.0 / (4.0 * PI);
fn safeSqrt(value: f32) -> f32 { return sqrt(max(value, 0.0)); }
fn textureCoordFromUnitRange(value: f32, length: u32) -> f32
{
return 0.5 / f32(length) + value * (1.0 - 1.0 / f32(length));
}
fn unitRangeFromTextureCoord(coord: f32 , length: u32) -> f32
{
return (coord - 0.5 / f32(length)) / (1.0 - 1.0 / f32(length));
}
fn transmittanceLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let atmosphere_radius_Mm_squared: f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared: f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h: f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho: f32 = safeSqrt(radius * radius - planet_radius_Mm_squared);
let d: f32 = max(-radius * mu + safeSqrt(radius * radius * (mu * mu - 1.0) + atmosphere_radius_Mm_squared), 0.0);
let d_min: f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max: f32 = rho + h;
let x_mu: f32 = (d - d_min) / (d_max - d_min);
let x_radius: f32 = rho / h;
return vec2<f32>(
textureCoordFromUnitRange(x_mu, dimensions.x),
textureCoordFromUnitRange(x_radius, dimensions.y)
);
}
fn transmittanceLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let x_mu : f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let x_radius : f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let atmosphere_radius_Mm_squared : f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared : f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h : f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho : f32 = h * x_radius;
let radius : f32 = safeSqrt(rho * rho + planet_radius_Mm_squared);
let d_min : f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max : f32 = rho + h;
let d : f32 = (d_max - d_min) * x_mu + d_min;
let D_EPSILON: f32 = 0.000000001;
if (d < D_EPSILON)
{
return vec2<f32>(radius, 1.0);
}
let mu : f32 = (h * h - rho * rho - d * d) / (2.0 * radius * d);
return vec2<f32>(radius, clamp(mu, -1.0, 1.0));
}
fn multiscatterLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = 0.5 + 0.5 * mu_light;
let v_unit: f32 = clamp(
(radius - (*atmosphere).planet_radius_Mm)
/ ((*atmosphere).atmosphere_radius_Mm - (*atmosphere).planet_radius_Mm),
0.0, 1.0
);
return vec2<f32>(
textureCoordFromUnitRange(u_unit, dimensions.x),
textureCoordFromUnitRange(v_unit, dimensions.y)
);
}
fn multiscatterLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let v_unit: f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let mu_light: f32 = 2.0 * (u_unit - 0.5);
let radius: f32 = mix(
(*atmosphere).planet_radius_Mm * (1.0002),
(*atmosphere).atmosphere_radius_Mm * (0.9998),
v_unit
);
return vec2<f32>(radius, mu_light);
}
fn sampleMultiscatterLUT(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32
) -> vec3<f32>
{
let uv: vec2<f32> = multiscatterLUT_RMu_to_UV(
atmosphere,
radius,
mu_light,
textureDimensions(lut)
);
return textureSampleLevel(lut, s, uv, 0.0).xyz;
}
fn sampleTransmittanceLUT_RadiusMu(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32
) -> vec3<f32>
{
let uv: vec2<f32> = transmittanceLUT_RMu_to_UV(
atmosphere,
radius,
mu,
textureDimensions(lut)
);
let sample = textureSampleLevel(lut, s, uv, 0.0).xyz;
return sample;
}
fn sampleTransmittanceLUT_Ray(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
position: vec3<f32>,
direction: vec3<f32>
) -> vec3<f32>
{
let radius: f32 = length(position);
let mu: f32 = (dot(position, direction) / (length(position) * length(direction)));
return sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, radius, mu);
}
fn sampleTransmittanceLUT_Segment(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
r_start: f32,
mu_start: f32,
d: f32,
intersects_ground: bool
) -> vec3<f32>
{
let r_end = clamp(
safeSqrt(d * d + 2.0 * r_start * mu_start * d + r_start * r_start),
(*atmosphere).planet_radius_Mm, (*atmosphere).atmosphere_radius_Mm
);
let mu_end = clamp((r_start * mu_start + d) / r_end, -1.0, 1.0);
if(intersects_ground)
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, -mu_end)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, -mu_start),
vec3<f32>(1.0)
);
}
else
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, mu_start)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, mu_end),
vec3<f32>(1.0)
);
}
}
struct ExtinctionSample
{
scattering_rayleigh: vec3<f32>,
scattering_mie: vec3<f32>,
scattering_ozone: vec3<f32>,
absorption_rayleigh: vec3<f32>,
absorption_mie: vec3<f32>,
absorption_ozone: vec3<f32>,
scattering: vec3<f32>,
extinction: vec3<f32>,
}
fn densityExponential(altitude: f32, density_scale: f32) -> f32
{ return exp(-altitude / density_scale); }
fn densityTent(altitude_km: f32) -> f32
{ return max(0.0, 1.0 - abs(altitude_km - 25.0) / 15.0); }
fn sampleExtinction(atmosphere: ptr<function,Atmosphere>, altitude_Mm: f32) -> ExtinctionSample
{
let density_rayleigh: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_rayleigh_Mm);
let scattering_rayleigh: vec3<f32> = (*atmosphere).scattering_rayleigh_per_Mm * density_rayleigh;
let absorption_rayleigh: vec3<f32> = (*atmosphere).absorption_rayleigh_per_Mm * density_rayleigh;
let density_mie: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_mie_Mm);
let scattering_mie: vec3<f32> = (*atmosphere).scattering_mie_per_Mm * density_mie;
let absorption_mie: vec3<f32> = (*atmosphere).absorption_mie_per_Mm * density_mie;
let density_ozone: f32 = densityTent(altitude_Mm * 1000.0);
let scattering_ozone: vec3<f32> = (*atmosphere).scattering_ozone_per_Mm * density_ozone;
let absorption_ozone: vec3<f32> = (*atmosphere).absorption_ozone_per_Mm * density_ozone;
var extinction_sample: ExtinctionSample;
extinction_sample.scattering_rayleigh = scattering_rayleigh;
extinction_sample.scattering_mie = scattering_mie;
extinction_sample.scattering_ozone = scattering_ozone;
extinction_sample.absorption_rayleigh = absorption_rayleigh;
extinction_sample.absorption_mie = absorption_mie;
extinction_sample.absorption_ozone = absorption_ozone;
extinction_sample.scattering = scattering_rayleigh + scattering_mie + scattering_ozone;
extinction_sample.extinction = extinction_sample.scattering + absorption_rayleigh + absorption_mie + absorption_ozone;
return extinction_sample;
}
fn phaseRayleigh(cosine: f32) -> f32
{
let scalar: f32 = 3.0 / (16.0 * PI);
let numerator: f32 = (1.0 + cosine * cosine);
return scalar * numerator;
}
fn phaseMie(cosine: f32, g: f32) -> f32
{
let scalar: f32 = 3.0 / (8.0 * PI);
let numerator: f32 = (1.0 - g * g) * (1.0 + cosine * cosine);
let denominator: f32 = (2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * cosine, 1.5);
return scalar * numerator / denominator;
}
struct RaymarchStep
{
radius: f32,
mu: f32,
mu_light: f32,
nu: f32,
};
fn stepRadiusMu(
start: RaymarchStep,
step_distance: f32,
) -> RaymarchStep
{
var result: RaymarchStep;
result.radius = safeSqrt(
step_distance * step_distance + 2.0 * start.radius * start.mu * step_distance
+ start.radius * start.radius
);
result.mu = (start.radius * start.mu + step_distance) / result.radius;
result.nu = start.nu;
result.mu_light = (start.radius * start.mu_light + step_distance * start.nu) / result.radius;
return result;
}
fn sampleTransmittanceLUT_RayMarchStep(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
start: RaymarchStep,
step_distance: f32
) -> vec3<f32>
{
const STEP_DISTANCE_EPSILON = 0.0000001;
if (step_distance < STEP_DISTANCE_EPSILON)
{
return vec3<f32>(1.0);
}
let end: RaymarchStep = stepRadiusMu(start, step_distance);
var transmittance = vec3<f32>(0.0);
if (start.mu > 0.0)
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, start.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, end.mu);
}
else
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, -end.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, -start.mu);
}
return clamp(transmittance, vec3<f32>(0.0), vec3<f32>(1.0));
}
struct AtmosphereRaycastResult
{
intersects_ground: bool,
t_min: f32,
t_max: f32,
}
fn raycastAtmosphere(atmosphere: ptr<function, Atmosphere>, origin: vec3<f32>, direction: vec3<f32>) -> AtmosphereRaycastResult
{
var result: AtmosphereRaycastResult;
let planet_hit = raySphereIntersection(origin, direction, (*atmosphere).planet_radius_Mm);
let atmosphere_hit = raySphereIntersection(origin, direction, (*atmosphere).atmosphere_radius_Mm);
let inside_planet = planet_hit.hit && planet_hit.t0 < 0.0 && planet_hit.t1 > 0.0;
let intersects_atmosphere = atmosphere_hit.hit && atmosphere_hit.t1 > 0.0;
if (!intersects_atmosphere || inside_planet)
{
result.intersects_ground = true;
result.t_min = 0.0;
result.t_max = 0.0;
return result;
}
result.t_min = max(atmosphere_hit.t0, 0.0);
result.t_max = atmosphere_hit.t1;
if (planet_hit.hit && planet_hit.t0 > 0.0)
{
result.intersects_ground = true;
result.t_max = planet_hit.t0;
}
return result;
}
struct ScatteringResult
{
luminance: vec3<f32>,
transmittance: vec3<f32>,
multiscattering_transfer: vec3<f32>,
}
fn computeLuminanceScatteringIntegral(
atmosphere: ptr<function, Atmosphere>,
light:  ptr<function, CelestialLight>,
lut_sampler: sampler,
transmittance_lut: texture_2d<f32>,
origin: vec3<f32>,
direction: vec3<f32>,
include_ground: bool,
intersects_ground: bool,
sample_distance: f32,
) -> ScatteringResult
{
var result: ScatteringResult;
result.luminance = vec3<f32>(0.0);
result.transmittance = vec3<f32>(1.0);
result.multiscattering_transfer = vec3<f32>(0.0);
if(sample_distance <= 0.0)
{
result.luminance = vec3<f32>(1.0, 1.0, 0.0);
return result;
}
let incident_cosine = dot((*light).forward, -direction);
let start_radius: f32 = length(origin);
let start_mu: f32 = dot(origin, direction) / (length(origin) * length(direction));
let start_mu_light: f32 = dot(origin, -(*light).forward) / (length(origin) * length((*light).forward));
let nu: f32 = dot(-(*light).forward, direction) / (length((*light).forward) * length(direction));
let origin_step = RaymarchStep(start_radius, start_mu, start_mu_light, nu);
var transmittance_accumulated = vec3<f32>(1.0);
const SAMPLE_COUNT = 256.0;
const T_SUBSTEP = 0.2;
var t: f32 = 0.0;
var d_t: f32 = 0.0;
for (var s = 0.0; s < SAMPLE_COUNT; s += 1.0)
{
{
let t_new = sample_distance * (s + T_SUBSTEP) / SAMPLE_COUNT;
d_t = t_new - t;
t = t_new;
}
let sample_step: RaymarchStep = stepRadiusMu(origin_step, t);
let altitude = sample_step.radius - (*atmosphere).planet_radius_Mm;
let extinction_sample: ExtinctionSample = sampleExtinction(atmosphere, altitude);
let transmittance_to_t_begin = transmittance_accumulated;
let transmittance_along_path = exp(-extinction_sample.extinction * d_t);
transmittance_accumulated *= transmittance_along_path;
let phase_times_scattering = extinction_sample.scattering * ISOTROPIC_PHASE;
let multiscatter = vec3<f32>(0.0);
var occlusion_planet: f32 = 0.0;
{
let horizon_sin = (*atmosphere).planet_radius_Mm / sample_step.radius;
let horizon_cos = -safeSqrt(1.0 - horizon_sin * horizon_sin);
occlusion_planet = f32(sample_step.mu_light < horizon_cos);
}
let transmittance_to_sun = sampleTransmittanceLUT_RadiusMu(transmittance_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
var shadowing = vec3<f32>(transmittance_to_sun * (1.0 - f32(occlusion_planet)));
let scattering_illuminance_integral = (vec3(1.0) - transmittance_along_path) / extinction_sample.extinction;
result.luminance +=
(phase_times_scattering * shadowing + multiscatter * extinction_sample.scattering)
* scattering_illuminance_integral * transmittance_to_t_begin
* 1.0;
result.multiscattering_transfer += extinction_sample.scattering * scattering_illuminance_integral * transmittance_to_t_begin;
}
if (include_ground && intersects_ground)
{
let sample_step: RaymarchStep = stepRadiusMu(origin_step, sample_distance);
let transmittance_to_surface = sampleTransmittanceLUT_RayMarchStep(transmittance_lut, lut_sampler, atmosphere, origin_step, sample_distance);
let transmittance_to_sun = sampleTransmittanceLUT_RadiusMu(transmittance_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
let normal_dot_light = clamp(sample_step.mu_light, 0.0, 1.0);
let diffuse = (*atmosphere).ground_albedo / PI;
result.luminance +=
transmittance_to_surface * transmittance_to_sun * normal_dot_light * diffuse
* 1.0;
}
result.transmittance = transmittance_accumulated;
return result;
}
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
    let sun_direction = vec3<f32>(0.0, cos_sun_zenith, sin_sun_zenith);
    var light: CelestialLight = u_global.light;
    light.forward = -sun_direction;
    var luminance_second_order = vec3<f32>(0.0);
    var multiscattering_transfer = vec3<f32>(0.0);
    const SAMPLE_COUNT_SQRT = 5u;
    const SAMPLE_COUNT = SAMPLE_COUNT_SQRT * SAMPLE_COUNT_SQRT;
    for (var sample_index = 0u; sample_index < SAMPLE_COUNT; sample_index++) {
        let azimuthal_index = f32(sample_index) / f32(SAMPLE_COUNT_SQRT);
        let zenith_index = f32(sample_index % SAMPLE_COUNT_SQRT) + 0.5;
        let azimuth = 2.0 * PI * f32(azimuthal_index) / f32(SAMPLE_COUNT_SQRT);
        let cos_azimuth = cos(azimuth);
        let sin_azimuth = sin(azimuth);
        let cos_zenith = clamp(
            2.0 * f32(zenith_index) / f32(SAMPLE_COUNT_SQRT) - 1.0,
            -1.0, 1.0
        );
        let sin_zenith = sqrt(1.0 - cos_zenith * cos_zenith);
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
    	const SPHERE_SOLID_ANGLE = 4.0 * PI;
        let sample_solid_angle = SPHERE_SOLID_ANGLE / f32(SAMPLE_COUNT);
        luminance_second_order += scattering.luminance * sample_solid_angle;
        multiscattering_transfer += scattering.multiscattering_transfer * sample_solid_angle;
    }
    let inscattering = luminance_second_order * ISOTROPIC_PHASE;
    let scattering_transfer = multiscattering_transfer * ISOTROPIC_PHASE;
    let infinite_scattering_transfer = vec3<f32>(1.0 / (1.0 - scattering_transfer));
    let multiscattering = infinite_scattering_transfer * inscattering;
    textureStore(multiscatter_lut, texel_coord, vec4<f32>(multiscattering, 1.0));
}
`, V = "rgba32float";
class Pe {
  /**
   * Initializes all resources related to the multiscatter lookup table.
   * @param device - The WebGPU device to use.
   * @param dimensions - The dimensions of the LUT texture.
   * @param transmittanceLUT - The transmittance LUT to bind and read from.
   * @param filterableLUT - Whether or not the LUTs are filterable.
   * @param globalUBO - The global UBO to bind and read from.
   */
  constructor(e, t, r, i, n) {
    /**
     * The multiscatter lookup table texture.
     */
    a(this, "texture");
    /**
     * The view into {@link texture}.
     */
    a(this, "view");
    /*
     * @group(0) @binding(0) var multiscatter_lut: texture_storage_2d<rgba32float, write>;
     * @group(0) @binding(1) var lut_sampler: sampler;
     * @group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
     *
     * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
     */
    a(this, "pipeline");
    a(this, "group0");
    a(this, "group1");
    const o = "Multiscatter LUT";
    this.texture = e.createTexture({
      size: t,
      dimension: "2d",
      format: V,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Multiscatter LUT"
    }), this.view = this.texture.createView({ label: o });
    const s = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            access: "write-only",
            format: V
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          sampler: {
            type: i ? "filtering" : "non-filtering"
          }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: i ? "float" : "unfilterable-float"
          }
        }
      ],
      label: "Multiscatter LUT Group 0"
    });
    this.group0 = e.createBindGroup({
      layout: s,
      entries: [
        {
          binding: 0,
          resource: this.view
        },
        {
          binding: 1,
          resource: e.createSampler({
            magFilter: i ? "linear" : "nearest",
            minFilter: i ? "linear" : "nearest"
          })
        },
        {
          binding: 2,
          resource: r
        }
      ],
      label: "Multiscatter LUT Group 0"
    });
    const l = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {}
        }
      ],
      label: "Multiscatter LUT Group 1"
    });
    this.group1 = e.createBindGroup({
      layout: l,
      entries: [
        {
          binding: 0,
          resource: { buffer: n.buffer }
        }
      ],
      label: "Multiscatter LUT Group 1"
    });
    const _ = e.createShaderModule({
      code: De,
      label: o
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: _,
        entryPoint: "computeMultiscattering"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [s, l]
      }),
      label: "Multiscatter LUT"
    });
  }
  record(e) {
    const t = e.beginComputePass({
      label: "Multiscatter LUT"
    });
    t.setPipeline(this.pipeline), t.setBindGroup(0, this.group0), t.setBindGroup(1, this.group1), t.dispatchWorkgroups(
      Math.ceil(this.texture.width / 16),
      Math.ceil(this.texture.height / 16)
    ), t.end();
  }
}
const Ae = `struct Atmosphere
{
scattering_rayleigh_per_Mm : vec3<f32>,
density_scale_rayleigh_Mm : f32,
absorption_rayleigh_per_Mm : vec3<f32>,
planet_radius_Mm : f32,
scattering_mie_per_Mm : vec3<f32>,
density_scale_mie_Mm : f32,
absorption_mie_per_Mm : vec3<f32>,
atmosphere_radius_Mm : f32,
ground_albedo : vec3<f32>,
padding0 : f32,
scattering_ozone_per_Mm : vec3<f32>,
padding1 : f32,
absorption_ozone_per_Mm : vec3<f32>,
padding2 : f32,
padding3 : vec4<f32>,
}
struct CelestialLight
{
color: vec3<f32>,
strength: f32,
forward: vec3<f32>,
angular_radius: f32,
}
struct Camera
{
inv_proj: mat4x4<f32>,
inv_view: mat4x4<f32>,
proj_view: mat4x4<f32>,
position: vec4<f32>,
forward: vec4<f32>,
padding0: mat2x4<f32>,
}
struct Time
{
padding0: vec2<f32>,
time_seconds: f32,
delta_time_seconds: f32,
}
struct GlobalUBO
{
camera: Camera,
ocean_camera: Camera,
atmosphere: Atmosphere,
light: CelestialLight,
time: Time,
}
@group(0) @binding(0) var skyview_lut: texture_storage_2d<rgba32float, write>;
@group(0) @binding(1) var lut_sampler: sampler;
@group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
@group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
const PI = 3.141592653589793;
const METERS_PER_MM = 1000000;
const AERIAL_PERSPECTIVE_MM_PER_SLICE = 0.001;
const ISOTROPIC_PHASE = 1.0 / (4.0 * PI);
fn safeSqrt(value: f32) -> f32 { return sqrt(max(value, 0.0)); }
fn textureCoordFromUnitRange(value: f32, length: u32) -> f32
{
return 0.5 / f32(length) + value * (1.0 - 1.0 / f32(length));
}
fn unitRangeFromTextureCoord(coord: f32 , length: u32) -> f32
{
return (coord - 0.5 / f32(length)) / (1.0 - 1.0 / f32(length));
}
fn transmittanceLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let atmosphere_radius_Mm_squared: f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared: f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h: f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho: f32 = safeSqrt(radius * radius - planet_radius_Mm_squared);
let d: f32 = max(-radius * mu + safeSqrt(radius * radius * (mu * mu - 1.0) + atmosphere_radius_Mm_squared), 0.0);
let d_min: f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max: f32 = rho + h;
let x_mu: f32 = (d - d_min) / (d_max - d_min);
let x_radius: f32 = rho / h;
return vec2<f32>(
textureCoordFromUnitRange(x_mu, dimensions.x),
textureCoordFromUnitRange(x_radius, dimensions.y)
);
}
fn transmittanceLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let x_mu : f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let x_radius : f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let atmosphere_radius_Mm_squared : f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared : f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h : f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho : f32 = h * x_radius;
let radius : f32 = safeSqrt(rho * rho + planet_radius_Mm_squared);
let d_min : f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max : f32 = rho + h;
let d : f32 = (d_max - d_min) * x_mu + d_min;
let D_EPSILON: f32 = 0.000000001;
if (d < D_EPSILON)
{
return vec2<f32>(radius, 1.0);
}
let mu : f32 = (h * h - rho * rho - d * d) / (2.0 * radius * d);
return vec2<f32>(radius, clamp(mu, -1.0, 1.0));
}
fn multiscatterLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = 0.5 + 0.5 * mu_light;
let v_unit: f32 = clamp(
(radius - (*atmosphere).planet_radius_Mm)
/ ((*atmosphere).atmosphere_radius_Mm - (*atmosphere).planet_radius_Mm),
0.0, 1.0
);
return vec2<f32>(
textureCoordFromUnitRange(u_unit, dimensions.x),
textureCoordFromUnitRange(v_unit, dimensions.y)
);
}
fn multiscatterLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let v_unit: f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let mu_light: f32 = 2.0 * (u_unit - 0.5);
let radius: f32 = mix(
(*atmosphere).planet_radius_Mm * (1.0002),
(*atmosphere).atmosphere_radius_Mm * (0.9998),
v_unit
);
return vec2<f32>(radius, mu_light);
}
fn sampleMultiscatterLUT(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32
) -> vec3<f32>
{
let uv: vec2<f32> = multiscatterLUT_RMu_to_UV(
atmosphere,
radius,
mu_light,
textureDimensions(lut)
);
return textureSampleLevel(lut, s, uv, 0.0).xyz;
}
fn sampleTransmittanceLUT_RadiusMu(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32
) -> vec3<f32>
{
let uv: vec2<f32> = transmittanceLUT_RMu_to_UV(
atmosphere,
radius,
mu,
textureDimensions(lut)
);
let sample = textureSampleLevel(lut, s, uv, 0.0).xyz;
return sample;
}
fn sampleTransmittanceLUT_Ray(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
position: vec3<f32>,
direction: vec3<f32>
) -> vec3<f32>
{
let radius: f32 = length(position);
let mu: f32 = (dot(position, direction) / (length(position) * length(direction)));
return sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, radius, mu);
}
fn sampleTransmittanceLUT_Segment(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
r_start: f32,
mu_start: f32,
d: f32,
intersects_ground: bool
) -> vec3<f32>
{
let r_end = clamp(
safeSqrt(d * d + 2.0 * r_start * mu_start * d + r_start * r_start),
(*atmosphere).planet_radius_Mm, (*atmosphere).atmosphere_radius_Mm
);
let mu_end = clamp((r_start * mu_start + d) / r_end, -1.0, 1.0);
if(intersects_ground)
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, -mu_end)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, -mu_start),
vec3<f32>(1.0)
);
}
else
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, mu_start)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, mu_end),
vec3<f32>(1.0)
);
}
}
struct ExtinctionSample
{
scattering_rayleigh: vec3<f32>,
scattering_mie: vec3<f32>,
scattering_ozone: vec3<f32>,
absorption_rayleigh: vec3<f32>,
absorption_mie: vec3<f32>,
absorption_ozone: vec3<f32>,
scattering: vec3<f32>,
extinction: vec3<f32>,
}
fn densityExponential(altitude: f32, density_scale: f32) -> f32
{ return exp(-altitude / density_scale); }
fn densityTent(altitude_km: f32) -> f32
{ return max(0.0, 1.0 - abs(altitude_km - 25.0) / 15.0); }
fn sampleExtinction(atmosphere: ptr<function,Atmosphere>, altitude_Mm: f32) -> ExtinctionSample
{
let density_rayleigh: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_rayleigh_Mm);
let scattering_rayleigh: vec3<f32> = (*atmosphere).scattering_rayleigh_per_Mm * density_rayleigh;
let absorption_rayleigh: vec3<f32> = (*atmosphere).absorption_rayleigh_per_Mm * density_rayleigh;
let density_mie: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_mie_Mm);
let scattering_mie: vec3<f32> = (*atmosphere).scattering_mie_per_Mm * density_mie;
let absorption_mie: vec3<f32> = (*atmosphere).absorption_mie_per_Mm * density_mie;
let density_ozone: f32 = densityTent(altitude_Mm * 1000.0);
let scattering_ozone: vec3<f32> = (*atmosphere).scattering_ozone_per_Mm * density_ozone;
let absorption_ozone: vec3<f32> = (*atmosphere).absorption_ozone_per_Mm * density_ozone;
var extinction_sample: ExtinctionSample;
extinction_sample.scattering_rayleigh = scattering_rayleigh;
extinction_sample.scattering_mie = scattering_mie;
extinction_sample.scattering_ozone = scattering_ozone;
extinction_sample.absorption_rayleigh = absorption_rayleigh;
extinction_sample.absorption_mie = absorption_mie;
extinction_sample.absorption_ozone = absorption_ozone;
extinction_sample.scattering = scattering_rayleigh + scattering_mie + scattering_ozone;
extinction_sample.extinction = extinction_sample.scattering + absorption_rayleigh + absorption_mie + absorption_ozone;
return extinction_sample;
}
fn phaseRayleigh(cosine: f32) -> f32
{
let scalar: f32 = 3.0 / (16.0 * PI);
let numerator: f32 = (1.0 + cosine * cosine);
return scalar * numerator;
}
fn phaseMie(cosine: f32, g: f32) -> f32
{
let scalar: f32 = 3.0 / (8.0 * PI);
let numerator: f32 = (1.0 - g * g) * (1.0 + cosine * cosine);
let denominator: f32 = (2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * cosine, 1.5);
return scalar * numerator / denominator;
}
struct RaymarchStep
{
radius: f32,
mu: f32,
mu_light: f32,
nu: f32,
};
fn stepRadiusMu(
start: RaymarchStep,
step_distance: f32,
) -> RaymarchStep
{
var result: RaymarchStep;
result.radius = safeSqrt(
step_distance * step_distance + 2.0 * start.radius * start.mu * step_distance
+ start.radius * start.radius
);
result.mu = (start.radius * start.mu + step_distance) / result.radius;
result.nu = start.nu;
result.mu_light = (start.radius * start.mu_light + step_distance * start.nu) / result.radius;
return result;
}
fn sampleTransmittanceLUT_RayMarchStep(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
start: RaymarchStep,
step_distance: f32
) -> vec3<f32>
{
const STEP_DISTANCE_EPSILON = 0.0000001;
if (step_distance < STEP_DISTANCE_EPSILON)
{
return vec3<f32>(1.0);
}
let end: RaymarchStep = stepRadiusMu(start, step_distance);
var transmittance = vec3<f32>(0.0);
if (start.mu > 0.0)
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, start.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, end.mu);
}
else
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, -end.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, -start.mu);
}
return clamp(transmittance, vec3<f32>(0.0), vec3<f32>(1.0));
}
struct RaySphereHit
{
hit: bool,
t0: f32,
t1: f32,
}
fn raySphereIntersection(
ray_origin: vec3<f32>,
ray_direction_normalized: vec3<f32>,
radius: f32
) -> RaySphereHit
{
let f: vec3<f32> = ray_origin;
let d: vec3<f32> = ray_direction_normalized;
let b: f32 = -1.0 * dot(f, d);
let center_to_intersection_chord: vec3<f32> = f + b * d;
let discriminant: f32 = radius * radius - dot(center_to_intersection_chord, center_to_intersection_chord);
let c: f32 = dot(f, f) - radius * radius;
var output : RaySphereHit;
output.hit = false;
output.t0 = 0.0;
output.t1 = 0.0;
if (discriminant < 0.0)
{
return output;
}
var q: f32 = b;
if (b < 0.0)
{
q -= sqrt(discriminant);
}
else
{
q += sqrt(discriminant);
}
output.hit = true;
output.t0 = c / q;
output.t1 = q;
if (output.t0 > output.t1)
{
let temp: f32 = output.t0;
output.t0 = output.t1;
output.t1 = temp;
}
return output;
}
struct RayPlaneHit {
hit: bool,
t: f32,
}
fn rayPlaneIntersection(
ray_origin: vec3<f32>,
ray_direction: vec3<f32>,
plane_origin: vec3<f32>,
plane_normal: vec3<f32>
) -> RayPlaneHit
{
var result: RayPlaneHit;
let perp = dot(plane_normal, ray_direction);
result.t = dot(plane_origin - ray_origin, plane_normal) / perp;
result.hit = (abs(perp) > 0.00001) && (result.t > 0.0);
return result;
}
struct AtmosphereRaycastResult
{
intersects_ground: bool,
t_min: f32,
t_max: f32,
}
fn raycastAtmosphere(atmosphere: ptr<function, Atmosphere>, origin: vec3<f32>, direction: vec3<f32>) -> AtmosphereRaycastResult
{
var result: AtmosphereRaycastResult;
let planet_hit = raySphereIntersection(origin, direction, (*atmosphere).planet_radius_Mm);
let atmosphere_hit = raySphereIntersection(origin, direction, (*atmosphere).atmosphere_radius_Mm);
let inside_planet = planet_hit.hit && planet_hit.t0 < 0.0 && planet_hit.t1 > 0.0;
let intersects_atmosphere = atmosphere_hit.hit && atmosphere_hit.t1 > 0.0;
if (!intersects_atmosphere || inside_planet)
{
result.intersects_ground = true;
result.t_min = 0.0;
result.t_max = 0.0;
return result;
}
result.t_min = max(atmosphere_hit.t0, 0.0);
result.t_max = atmosphere_hit.t1;
if (planet_hit.hit && planet_hit.t0 > 0.0)
{
result.intersects_ground = true;
result.t_max = planet_hit.t0;
}
return result;
}
struct ScatteringResult
{
luminance: vec3<f32>,
transmittance: vec3<f32>,
multiscattering_transfer: vec3<f32>,
}
fn computeLuminanceScatteringIntegral(
atmosphere: ptr<function, Atmosphere>,
light:  ptr<function, CelestialLight>,
lut_sampler: sampler,
transmittance_lut: texture_2d<f32>,
multiscatter_lut: texture_2d<f32>,
origin: vec3<f32>,
direction: vec3<f32>,
include_ground: bool,
intersects_ground: bool,
sample_distance: f32,
) -> ScatteringResult
{
var result: ScatteringResult;
result.luminance = vec3<f32>(0.0);
result.transmittance = vec3<f32>(1.0);
result.multiscattering_transfer = vec3<f32>(0.0);
if(sample_distance <= 0.0)
{
result.luminance = vec3<f32>(1.0, 1.0, 0.0);
return result;
}
let incident_cosine = dot((*light).forward, -direction);
let start_radius: f32 = length(origin);
let start_mu: f32 = dot(origin, direction) / (length(origin) * length(direction));
let start_mu_light: f32 = dot(origin, -(*light).forward) / (length(origin) * length((*light).forward));
let nu: f32 = dot(-(*light).forward, direction) / (length((*light).forward) * length(direction));
let origin_step = RaymarchStep(start_radius, start_mu, start_mu_light, nu);
var transmittance_accumulated = vec3<f32>(1.0);
const SAMPLE_COUNT = 64.0;
const T_SUBSTEP = 0.4;
var t: f32 = 0.0;
var d_t: f32 = 0.0;
for (var s = 0.0; s < SAMPLE_COUNT; s += 1.0)
{
{
var t_begin = s / SAMPLE_COUNT;
var t_end = (s + 1.0) / SAMPLE_COUNT;
t_begin = sample_distance * t_begin * t_begin;
t_end = sample_distance * t_end * t_end;
d_t = t_end - t_begin;
t = mix(t_begin, t_end, T_SUBSTEP);
}
let sample_step: RaymarchStep = stepRadiusMu(origin_step, t);
let altitude = sample_step.radius - (*atmosphere).planet_radius_Mm;
let extinction_sample: ExtinctionSample = sampleExtinction(atmosphere, altitude);
let transmittance_to_t_begin = transmittance_accumulated;
let transmittance_along_path = exp(-extinction_sample.extinction * d_t);
transmittance_accumulated *= transmittance_along_path;
let phase_times_scattering: vec3<f32> =
extinction_sample.scattering_rayleigh * phaseRayleigh(incident_cosine)
+ extinction_sample.scattering_mie * phaseMie(incident_cosine, 0.8)
+ extinction_sample.scattering_ozone * phaseRayleigh(incident_cosine);
let multiscatter = sampleMultiscatterLUT(multiscatter_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
var occlusion_planet: f32 = 0.0;
{
let horizon_sin = (*atmosphere).planet_radius_Mm / sample_step.radius;
let horizon_cos = -safeSqrt(1.0 - horizon_sin * horizon_sin);
occlusion_planet = f32(sample_step.mu_light < horizon_cos);
}
let transmittance_to_sun = sampleTransmittanceLUT_RadiusMu(transmittance_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
var shadowing = vec3<f32>(transmittance_to_sun * (1.0 - f32(occlusion_planet)));
let scattering_illuminance_integral = (vec3(1.0) - transmittance_along_path) / extinction_sample.extinction;
result.luminance +=
(phase_times_scattering * shadowing + multiscatter * extinction_sample.scattering)
* scattering_illuminance_integral * transmittance_to_t_begin
* 1.0;
result.multiscattering_transfer += extinction_sample.scattering * scattering_illuminance_integral * transmittance_to_t_begin;
}
if (include_ground && intersects_ground)
{
let sample_step: RaymarchStep = stepRadiusMu(origin_step, sample_distance);
let transmittance_to_surface = sampleTransmittanceLUT_RayMarchStep(transmittance_lut, lut_sampler, atmosphere, origin_step, sample_distance);
let transmittance_to_sun = sampleTransmittanceLUT_RadiusMu(transmittance_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
let normal_dot_light = clamp(sample_step.mu_light, 0.0, 1.0);
let diffuse = (*atmosphere).ground_albedo / PI;
result.luminance +=
transmittance_to_surface * transmittance_to_sun * normal_dot_light * diffuse
* 1.0;
}
result.transmittance = transmittance_accumulated;
return result;
}
fn uv_to_azimuthElevation(
    atmosphere: ptr<function, Atmosphere>,
    radius: f32,
    uv: vec2<f32>,
) -> vec2<f32>
{
    let sin_horizon_zenith = (*atmosphere).planet_radius_Mm / radius;
    let horizon_zenith = PI - asin(sin_horizon_zenith);
    let azimuth = 2.0 * PI * (uv.x - 0.5);
    var view_zenith: f32;
    if (uv.y < 0.5)
    {
        let unnormalized_v = 2.0 * uv.y - 1.0;
        let angle_fraction = 1.0 - unnormalized_v * unnormalized_v;
        view_zenith = angle_fraction * horizon_zenith;
    }
    else
    {
        let unnormalized_v = 2.0 * uv.y - 1.0;
        let angle_fraction = unnormalized_v * unnormalized_v;
        view_zenith = (PI - horizon_zenith) * angle_fraction + horizon_zenith;
    }
    let elevation = -(view_zenith - PI / 2.0);
    return vec2<f32>(azimuth, elevation);
}
@compute @workgroup_size(16,16,1)
fn computeSkyViewLuminance(@builtin(global_invocation_id) global_id : vec3<u32>,)
{
    let texel_coord = vec2<u32>(global_id.xy);
    let size = textureDimensions(skyview_lut);
    if(texel_coord.x >= size.x || texel_coord.y >= size.y)
    {
        return;
    }
    var atmosphere: Atmosphere = u_global.atmosphere;
    var light: CelestialLight = u_global.light;
    let offset = vec2<f32>(0.5, 0.5);
    let uv = (vec2<f32>(texel_coord) + offset) / vec2<f32>(size);
    let origin = vec3<f32>(0.0, atmosphere.planet_radius_Mm, 0.0) + u_global.camera.position.xyz / METERS_PER_MM;
    let azimuth_elevation = uv_to_azimuthElevation(
        &atmosphere,
        length(origin),
        uv
    );
    let azimuth = azimuth_elevation.x;
    let elevation = azimuth_elevation.y;
    let direction = normalize(vec3(
        sin(azimuth) * cos(elevation),
        sin(elevation),
        cos(azimuth) * cos(elevation)
    ));
	let atmosphere_raycast = raycastAtmosphere(&atmosphere, origin, direction);
    let include_ground = false;
    let luminance = computeLuminanceScatteringIntegral(
        &atmosphere,
        &light,
        lut_sampler,
        transmittance_lut,
        multiscatter_lut,
        origin + direction * atmosphere_raycast.t_min,
        direction,
        include_ground,
		atmosphere_raycast.intersects_ground,
		atmosphere_raycast.t_max - atmosphere_raycast.t_min
    ).luminance;
    textureStore(skyview_lut, texel_coord, vec4(luminance, 1.0));
}
`, H = "rgba32float";
class Re {
  /**
   * Initializes all resources related to the sky view lookup table.
   * @param device - The WebGPU device to use.
   * @param dimensions - The dimensions to use for the LUT texture.
   * @param transmittanceLUT - A view into the transmittance
   * 	LUT that will be used.
   * @param multiscatterLUT - A view into the multiscatter
   * 	LUT that will be used.
   * @param filterableLUT - Whether or not the passed LUTs are
   *  filterable by samples. This is a consideration since the LUTs are 32-bit
   *  floats per channel, and filtering such textures is not supported on all
   *  WebGPU instances.
   * @param globalUBO - The global UBO to bind and use when
   *  rendering the LUT.
   */
  constructor(e, t, r, i, n, o) {
    a(this, "texture");
    a(this, "view");
    /*
    	@group(0) @binding(0) var skyview_lut: texture_storage_2d<rgba32float, write>;
    	@group(0) @binding(1) var lut_sampler: sampler;
    	@group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
    	@group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
    
    	@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
    	*/
    a(this, "group0");
    a(this, "group1");
    a(this, "pipeline");
    this.texture = e.createTexture({
      size: t,
      dimension: "2d",
      format: H,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Skyview LUT"
    }), this.view = this.texture.createView({ label: "Skyview LUT" });
    const s = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            access: "write-only",
            format: H
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          sampler: {
            type: n ? "filtering" : "non-filtering"
          }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: n ? "float" : "unfilterable-float"
          }
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: n ? "float" : "unfilterable-float"
          }
        }
      ],
      label: "Skyview LUT"
    });
    this.group0 = e.createBindGroup({
      layout: s,
      entries: [
        {
          binding: 0,
          resource: this.view
        },
        {
          binding: 1,
          resource: e.createSampler({
            magFilter: n ? "linear" : "nearest",
            minFilter: n ? "linear" : "nearest"
          })
        },
        {
          binding: 2,
          resource: r
        },
        {
          binding: 3,
          resource: i
        }
      ],
      label: "Skyview LUT Group 0"
    });
    const l = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {}
        }
      ],
      label: "Skyview LUT Group 1"
    });
    this.group1 = e.createBindGroup({
      layout: l,
      entries: [
        {
          binding: 0,
          resource: { buffer: o.buffer }
        }
      ],
      label: "Skyview LUT Group 1"
    });
    const _ = e.createShaderModule({
      code: Ae
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: _,
        entryPoint: "computeSkyViewLuminance"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [s, l]
      }),
      label: "Skyview LUT"
    });
  }
  /**
   * Records the population of the lookup table.
   * @param commandEncoder - The command encoder to record
   * 	into.
   * @param timestampInterval - The
   *  interval to record timing information into.
   */
  record(e, t) {
    const r = e.beginComputePass({
      timestampWrites: t !== void 0 ? {
        querySet: t.querySet,
        beginningOfPassWriteIndex: t.beginWriteIndex,
        endOfPassWriteIndex: t.endWriteIndex
      } : void 0,
      label: "Skyview LUT"
    });
    r.setPipeline(this.pipeline), r.setBindGroup(0, this.group0), r.setBindGroup(1, this.group1), r.dispatchWorkgroups(
      Math.ceil(this.texture.width / 16),
      Math.ceil(this.texture.height / (16 * 1.9))
    ), r.end();
  }
}
const Ue = `struct Atmosphere
{
scattering_rayleigh_per_Mm : vec3<f32>,
density_scale_rayleigh_Mm : f32,
absorption_rayleigh_per_Mm : vec3<f32>,
planet_radius_Mm : f32,
scattering_mie_per_Mm : vec3<f32>,
density_scale_mie_Mm : f32,
absorption_mie_per_Mm : vec3<f32>,
atmosphere_radius_Mm : f32,
ground_albedo : vec3<f32>,
padding0 : f32,
scattering_ozone_per_Mm : vec3<f32>,
padding1 : f32,
absorption_ozone_per_Mm : vec3<f32>,
padding2 : f32,
padding3 : vec4<f32>,
}
struct CelestialLight
{
color: vec3<f32>,
strength: f32,
forward: vec3<f32>,
angular_radius: f32,
}
struct Camera
{
inv_proj: mat4x4<f32>,
inv_view: mat4x4<f32>,
proj_view: mat4x4<f32>,
position: vec4<f32>,
forward: vec4<f32>,
padding0: mat2x4<f32>,
}
struct Time
{
padding0: vec2<f32>,
time_seconds: f32,
delta_time_seconds: f32,
}
struct GlobalUBO
{
camera: Camera,
ocean_camera: Camera,
atmosphere: Atmosphere,
light: CelestialLight,
time: Time,
}
struct RaySphereHit
{
hit: bool,
t0: f32,
t1: f32,
}
fn raySphereIntersection(
ray_origin: vec3<f32>,
ray_direction_normalized: vec3<f32>,
radius: f32
) -> RaySphereHit
{
let f: vec3<f32> = ray_origin;
let d: vec3<f32> = ray_direction_normalized;
let b: f32 = -1.0 * dot(f, d);
let center_to_intersection_chord: vec3<f32> = f + b * d;
let discriminant: f32 = radius * radius - dot(center_to_intersection_chord, center_to_intersection_chord);
let c: f32 = dot(f, f) - radius * radius;
var output : RaySphereHit;
output.hit = false;
output.t0 = 0.0;
output.t1 = 0.0;
if (discriminant < 0.0)
{
return output;
}
var q: f32 = b;
if (b < 0.0)
{
q -= sqrt(discriminant);
}
else
{
q += sqrt(discriminant);
}
output.hit = true;
output.t0 = c / q;
output.t1 = q;
if (output.t0 > output.t1)
{
let temp: f32 = output.t0;
output.t0 = output.t1;
output.t1 = temp;
}
return output;
}
struct RayPlaneHit {
hit: bool,
t: f32,
}
fn rayPlaneIntersection(
ray_origin: vec3<f32>,
ray_direction: vec3<f32>,
plane_origin: vec3<f32>,
plane_normal: vec3<f32>
) -> RayPlaneHit
{
var result: RayPlaneHit;
let perp = dot(plane_normal, ray_direction);
result.t = dot(plane_origin - ray_origin, plane_normal) / perp;
result.hit = (abs(perp) > 0.00001) && (result.t > 0.0);
return result;
}
@group(0) @binding(0) var output_color: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var lut_sampler: sampler;
@group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
@group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
@group(0) @binding(4) var skyview_lut: texture_2d<f32>;
@group(0) @binding(5) var aerial_perspective_lut: texture_3d<f32>;
@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
@group(2) @binding(0) var gbuffer_color_with_surface_world_depth_in_alpha: texture_2d<f32>;
@group(2) @binding(1) var gbuffer_normal_with_surface_foam_strength_in_alpha: texture_2d<f32>;
const PI = 3.141592653589793;
const METERS_PER_MM = 1000000;
const AERIAL_PERSPECTIVE_MM_PER_SLICE = 0.001;
const ISOTROPIC_PHASE = 1.0 / (4.0 * PI);
fn safeSqrt(value: f32) -> f32 { return sqrt(max(value, 0.0)); }
fn textureCoordFromUnitRange(value: f32, length: u32) -> f32
{
return 0.5 / f32(length) + value * (1.0 - 1.0 / f32(length));
}
fn unitRangeFromTextureCoord(coord: f32 , length: u32) -> f32
{
return (coord - 0.5 / f32(length)) / (1.0 - 1.0 / f32(length));
}
fn transmittanceLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let atmosphere_radius_Mm_squared: f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared: f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h: f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho: f32 = safeSqrt(radius * radius - planet_radius_Mm_squared);
let d: f32 = max(-radius * mu + safeSqrt(radius * radius * (mu * mu - 1.0) + atmosphere_radius_Mm_squared), 0.0);
let d_min: f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max: f32 = rho + h;
let x_mu: f32 = (d - d_min) / (d_max - d_min);
let x_radius: f32 = rho / h;
return vec2<f32>(
textureCoordFromUnitRange(x_mu, dimensions.x),
textureCoordFromUnitRange(x_radius, dimensions.y)
);
}
fn transmittanceLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let x_mu : f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let x_radius : f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let atmosphere_radius_Mm_squared : f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared : f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h : f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho : f32 = h * x_radius;
let radius : f32 = safeSqrt(rho * rho + planet_radius_Mm_squared);
let d_min : f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max : f32 = rho + h;
let d : f32 = (d_max - d_min) * x_mu + d_min;
let D_EPSILON: f32 = 0.000000001;
if (d < D_EPSILON)
{
return vec2<f32>(radius, 1.0);
}
let mu : f32 = (h * h - rho * rho - d * d) / (2.0 * radius * d);
return vec2<f32>(radius, clamp(mu, -1.0, 1.0));
}
fn multiscatterLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = 0.5 + 0.5 * mu_light;
let v_unit: f32 = clamp(
(radius - (*atmosphere).planet_radius_Mm)
/ ((*atmosphere).atmosphere_radius_Mm - (*atmosphere).planet_radius_Mm),
0.0, 1.0
);
return vec2<f32>(
textureCoordFromUnitRange(u_unit, dimensions.x),
textureCoordFromUnitRange(v_unit, dimensions.y)
);
}
fn multiscatterLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let v_unit: f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let mu_light: f32 = 2.0 * (u_unit - 0.5);
let radius: f32 = mix(
(*atmosphere).planet_radius_Mm * (1.0002),
(*atmosphere).atmosphere_radius_Mm * (0.9998),
v_unit
);
return vec2<f32>(radius, mu_light);
}
fn sampleMultiscatterLUT(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32
) -> vec3<f32>
{
let uv: vec2<f32> = multiscatterLUT_RMu_to_UV(
atmosphere,
radius,
mu_light,
textureDimensions(lut)
);
return textureSampleLevel(lut, s, uv, 0.0).xyz;
}
fn sampleTransmittanceLUT_RadiusMu(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32
) -> vec3<f32>
{
let uv: vec2<f32> = transmittanceLUT_RMu_to_UV(
atmosphere,
radius,
mu,
textureDimensions(lut)
);
let sample = textureSampleLevel(lut, s, uv, 0.0).xyz;
return sample;
}
fn sampleTransmittanceLUT_Ray(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
position: vec3<f32>,
direction: vec3<f32>
) -> vec3<f32>
{
let radius: f32 = length(position);
let mu: f32 = (dot(position, direction) / (length(position) * length(direction)));
return sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, radius, mu);
}
fn sampleTransmittanceLUT_Segment(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
r_start: f32,
mu_start: f32,
d: f32,
intersects_ground: bool
) -> vec3<f32>
{
let r_end = clamp(
safeSqrt(d * d + 2.0 * r_start * mu_start * d + r_start * r_start),
(*atmosphere).planet_radius_Mm, (*atmosphere).atmosphere_radius_Mm
);
let mu_end = clamp((r_start * mu_start + d) / r_end, -1.0, 1.0);
if(intersects_ground)
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, -mu_end)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, -mu_start),
vec3<f32>(1.0)
);
}
else
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, mu_start)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, mu_end),
vec3<f32>(1.0)
);
}
}
struct ExtinctionSample
{
scattering_rayleigh: vec3<f32>,
scattering_mie: vec3<f32>,
scattering_ozone: vec3<f32>,
absorption_rayleigh: vec3<f32>,
absorption_mie: vec3<f32>,
absorption_ozone: vec3<f32>,
scattering: vec3<f32>,
extinction: vec3<f32>,
}
fn densityExponential(altitude: f32, density_scale: f32) -> f32
{ return exp(-altitude / density_scale); }
fn densityTent(altitude_km: f32) -> f32
{ return max(0.0, 1.0 - abs(altitude_km - 25.0) / 15.0); }
fn sampleExtinction(atmosphere: ptr<function,Atmosphere>, altitude_Mm: f32) -> ExtinctionSample
{
let density_rayleigh: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_rayleigh_Mm);
let scattering_rayleigh: vec3<f32> = (*atmosphere).scattering_rayleigh_per_Mm * density_rayleigh;
let absorption_rayleigh: vec3<f32> = (*atmosphere).absorption_rayleigh_per_Mm * density_rayleigh;
let density_mie: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_mie_Mm);
let scattering_mie: vec3<f32> = (*atmosphere).scattering_mie_per_Mm * density_mie;
let absorption_mie: vec3<f32> = (*atmosphere).absorption_mie_per_Mm * density_mie;
let density_ozone: f32 = densityTent(altitude_Mm * 1000.0);
let scattering_ozone: vec3<f32> = (*atmosphere).scattering_ozone_per_Mm * density_ozone;
let absorption_ozone: vec3<f32> = (*atmosphere).absorption_ozone_per_Mm * density_ozone;
var extinction_sample: ExtinctionSample;
extinction_sample.scattering_rayleigh = scattering_rayleigh;
extinction_sample.scattering_mie = scattering_mie;
extinction_sample.scattering_ozone = scattering_ozone;
extinction_sample.absorption_rayleigh = absorption_rayleigh;
extinction_sample.absorption_mie = absorption_mie;
extinction_sample.absorption_ozone = absorption_ozone;
extinction_sample.scattering = scattering_rayleigh + scattering_mie + scattering_ozone;
extinction_sample.extinction = extinction_sample.scattering + absorption_rayleigh + absorption_mie + absorption_ozone;
return extinction_sample;
}
fn phaseRayleigh(cosine: f32) -> f32
{
let scalar: f32 = 3.0 / (16.0 * PI);
let numerator: f32 = (1.0 + cosine * cosine);
return scalar * numerator;
}
fn phaseMie(cosine: f32, g: f32) -> f32
{
let scalar: f32 = 3.0 / (8.0 * PI);
let numerator: f32 = (1.0 - g * g) * (1.0 + cosine * cosine);
let denominator: f32 = (2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * cosine, 1.5);
return scalar * numerator / denominator;
}
struct RaymarchStep
{
radius: f32,
mu: f32,
mu_light: f32,
nu: f32,
};
fn stepRadiusMu(
start: RaymarchStep,
step_distance: f32,
) -> RaymarchStep
{
var result: RaymarchStep;
result.radius = safeSqrt(
step_distance * step_distance + 2.0 * start.radius * start.mu * step_distance
+ start.radius * start.radius
);
result.mu = (start.radius * start.mu + step_distance) / result.radius;
result.nu = start.nu;
result.mu_light = (start.radius * start.mu_light + step_distance * start.nu) / result.radius;
return result;
}
fn sampleTransmittanceLUT_RayMarchStep(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
start: RaymarchStep,
step_distance: f32
) -> vec3<f32>
{
const STEP_DISTANCE_EPSILON = 0.0000001;
if (step_distance < STEP_DISTANCE_EPSILON)
{
return vec3<f32>(1.0);
}
let end: RaymarchStep = stepRadiusMu(start, step_distance);
var transmittance = vec3<f32>(0.0);
if (start.mu > 0.0)
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, start.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, end.mu);
}
else
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, -end.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, -start.mu);
}
return clamp(transmittance, vec3<f32>(0.0), vec3<f32>(1.0));
}
struct AtmosphereRaycastResult
{
intersects_ground: bool,
t_min: f32,
t_max: f32,
}
fn raycastAtmosphere(atmosphere: ptr<function, Atmosphere>, origin: vec3<f32>, direction: vec3<f32>) -> AtmosphereRaycastResult
{
var result: AtmosphereRaycastResult;
let planet_hit = raySphereIntersection(origin, direction, (*atmosphere).planet_radius_Mm);
let atmosphere_hit = raySphereIntersection(origin, direction, (*atmosphere).atmosphere_radius_Mm);
let inside_planet = planet_hit.hit && planet_hit.t0 < 0.0 && planet_hit.t1 > 0.0;
let intersects_atmosphere = atmosphere_hit.hit && atmosphere_hit.t1 > 0.0;
if (!intersects_atmosphere || inside_planet)
{
result.intersects_ground = true;
result.t_min = 0.0;
result.t_max = 0.0;
return result;
}
result.t_min = max(atmosphere_hit.t0, 0.0);
result.t_max = atmosphere_hit.t1;
if (planet_hit.hit && planet_hit.t0 > 0.0)
{
result.intersects_ground = true;
result.t_max = planet_hit.t0;
}
return result;
}
struct ScatteringResult
{
luminance: vec3<f32>,
transmittance: vec3<f32>,
multiscattering_transfer: vec3<f32>,
}
fn computeLuminanceScatteringIntegral(
atmosphere: ptr<function, Atmosphere>,
light:  ptr<function, CelestialLight>,
lut_sampler: sampler,
transmittance_lut: texture_2d<f32>,
multiscatter_lut: texture_2d<f32>,
origin: vec3<f32>,
direction: vec3<f32>,
include_ground: bool,
intersects_ground: bool,
sample_distance: f32,
) -> ScatteringResult
{
var result: ScatteringResult;
result.luminance = vec3<f32>(0.0);
result.transmittance = vec3<f32>(1.0);
result.multiscattering_transfer = vec3<f32>(0.0);
if(sample_distance <= 0.0)
{
result.luminance = vec3<f32>(1.0, 1.0, 0.0);
return result;
}
let incident_cosine = dot((*light).forward, -direction);
let start_radius: f32 = length(origin);
let start_mu: f32 = dot(origin, direction) / (length(origin) * length(direction));
let start_mu_light: f32 = dot(origin, -(*light).forward) / (length(origin) * length((*light).forward));
let nu: f32 = dot(-(*light).forward, direction) / (length((*light).forward) * length(direction));
let origin_step = RaymarchStep(start_radius, start_mu, start_mu_light, nu);
var transmittance_accumulated = vec3<f32>(1.0);
const SAMPLE_COUNT = 64.0;
const T_SUBSTEP = 0.4;
var t: f32 = 0.0;
var d_t: f32 = 0.0;
for (var s = 0.0; s < SAMPLE_COUNT; s += 1.0)
{
{
var t_begin = s / SAMPLE_COUNT;
var t_end = (s + 1.0) / SAMPLE_COUNT;
t_begin = sample_distance * t_begin * t_begin;
t_end = sample_distance * t_end * t_end;
d_t = t_end - t_begin;
t = mix(t_begin, t_end, T_SUBSTEP);
}
let sample_step: RaymarchStep = stepRadiusMu(origin_step, t);
let altitude = sample_step.radius - (*atmosphere).planet_radius_Mm;
let extinction_sample: ExtinctionSample = sampleExtinction(atmosphere, altitude);
let transmittance_to_t_begin = transmittance_accumulated;
let transmittance_along_path = exp(-extinction_sample.extinction * d_t);
transmittance_accumulated *= transmittance_along_path;
let phase_times_scattering: vec3<f32> =
extinction_sample.scattering_rayleigh * phaseRayleigh(incident_cosine)
+ extinction_sample.scattering_mie * phaseMie(incident_cosine, 0.8)
+ extinction_sample.scattering_ozone * phaseRayleigh(incident_cosine);
let multiscatter = sampleMultiscatterLUT(multiscatter_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
var occlusion_planet: f32 = 0.0;
{
let horizon_sin = (*atmosphere).planet_radius_Mm / sample_step.radius;
let horizon_cos = -safeSqrt(1.0 - horizon_sin * horizon_sin);
occlusion_planet = f32(sample_step.mu_light < horizon_cos);
}
let transmittance_to_sun = sampleTransmittanceLUT_RadiusMu(transmittance_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
var shadowing = vec3<f32>(transmittance_to_sun * (1.0 - f32(occlusion_planet)));
let scattering_illuminance_integral = (vec3(1.0) - transmittance_along_path) / extinction_sample.extinction;
result.luminance +=
(phase_times_scattering * shadowing + multiscatter * extinction_sample.scattering)
* scattering_illuminance_integral * transmittance_to_t_begin
* 1.0;
result.multiscattering_transfer += extinction_sample.scattering * scattering_illuminance_integral * transmittance_to_t_begin;
}
if (include_ground && intersects_ground)
{
let sample_step: RaymarchStep = stepRadiusMu(origin_step, sample_distance);
let transmittance_to_surface = sampleTransmittanceLUT_RayMarchStep(transmittance_lut, lut_sampler, atmosphere, origin_step, sample_distance);
let transmittance_to_sun = sampleTransmittanceLUT_RadiusMu(transmittance_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
let normal_dot_light = clamp(sample_step.mu_light, 0.0, 1.0);
let diffuse = (*atmosphere).ground_albedo / PI;
result.luminance +=
transmittance_to_surface * transmittance_to_sun * normal_dot_light * diffuse
* 1.0;
}
result.transmittance = transmittance_accumulated;
return result;
}
fn sRGB_EOTF(color_nonlinear: vec3<f32>) -> vec3<f32>
{
let piecewise_boundary = color_nonlinear < vec3<f32>(0.0031308 * 12.92);
let piecewise_linear = color_nonlinear / vec3<f32>(12.92);
let piecewise_nonlinear = pow(
(color_nonlinear + vec3<f32>(0.055)) / vec3<f32>(1.055), vec3<f32>(2.4)
);
return 0.95 * select(piecewise_nonlinear, piecewise_linear, piecewise_boundary);
}
fn sRGB_OETF(color_linear: vec3<f32>) -> vec3<f32>
{
let piecewise_boundary = color_linear <= vec3<f32>(0.0031308);
let piecewise_linear = vec3<f32>(12.92) * color_linear;
let piecewise_nonlinear = vec3<f32>(1.055) * pow(color_linear, vec3<f32>(1 / 2.4)) - vec3<f32>(0.055);
return select(piecewise_nonlinear, piecewise_linear, piecewise_boundary);
}
fn RRTAndODTFit(v: vec3<f32>) -> vec3<f32>
{
let a = v * (v + 0.0245786) - 0.000090537;
let b = v * (0.983729 * v + 0.4329510) + 0.238081;
return a / b;
}
fn HDRtoSRGB_ACES(color_hdr: vec3<f32>) -> vec3<f32>
{
const ACES_INPUT_MAT = mat3x3<f32>(
vec3<f32>(0.59719, 0.07600, 0.02840),
vec3<f32>(0.35458, 0.90834, 0.13383),
vec3<f32>(0.04823, 0.01566, 0.83777)
);
const ACES_OUTPUT_MAT = mat3x3<f32>
(
vec3<f32>(1.60475, -0.10208, -0.00327),
vec3<f32>(-0.53108,  1.10813, -0.07276),
vec3<f32>(-0.07367, -0.00605,  1.07602)
);
var color = ACES_INPUT_MAT * sRGB_OETF(color_hdr);
color = RRTAndODTFit(color);
color = ACES_OUTPUT_MAT * color;
color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));
return color;
}
fn tonemapPBRNeutral(color: vec3<f32>) -> vec3<f32>
{
let x = min(min(color.r, color.g), color.b);
let F_normal = 0.04;
var f = F_normal;
if (x <= 2.0 * F_normal)
{
f = x - x * x / (4.0 * F_normal);
}
var color_minus_f = color - vec3<f32>(f);
let K_s = 0.8 - F_normal;
let p = max(max(color_minus_f.r, color_minus_f.g), color_minus_f.b);
if (p <= K_s)
{
return color_minus_f;
}
let K_d = 0.15;
let p_n = 1.0 - (1.0 - K_s) * (1.0 - K_s) / (p + 1.0 - 2.0 * K_s);
let g = 1.0 / (K_d * (p - p_n) + 1.0);
return mix(vec3(p_n), color_minus_f * p_n / p, g);
}
fn max3(value: vec3<f32>) -> f32
{
    return max(max(value.x, value.y), value.z);
}
struct PBRTexel
{
    normal: vec3<f32>,
    subscattering_albedo: vec3<f32>,
    normal_reflectance: vec3<f32>,
    specular_power: f32,
    metallic: f32,
};
fn convertPBRPropertiesWater(color: vec3<f32>, normal: vec3<f32>, foam: f32) -> PBRTexel
{
    const METALLIC_WATER = 0.5;
	const SPECULAR_POWER = 160.0;
	const ROUGHNESS_WATER = 0.05;
	const ROUGHNESS_FOAM = 1.0;
    let roughness = mix(
		ROUGHNESS_WATER,
		ROUGHNESS_FOAM,
		foam
	);
	const FOAM_COLOR = vec3<f32>(1.0);
	let albedo = mix(color, FOAM_COLOR, foam);
    const DIELECTRIC_REFLECTANCE = vec3<f32>(0.04);
    const METALLIC_REFLECTANCE = vec3<f32>(0.5);
	const FOAM_REFLECTANCE = vec3<f32>(0.8);
    let normal_reflectance = mix(
		mix(
			DIELECTRIC_REFLECTANCE,
			METALLIC_REFLECTANCE * color / max3(color),
			METALLIC_WATER
		),
		FOAM_REFLECTANCE,
		foam
	);
    var texel = PBRTexel();
    texel.normal = normal;
    texel.subscattering_albedo = albedo;
    texel.normal_reflectance = normal_reflectance;
    texel.specular_power = pow(SPECULAR_POWER, 1.0 - roughness);
    texel.metallic = METALLIC_WATER;
    return texel;
}
fn computeFresnelMicrofacet(material: PBRTexel, light_outgoing: vec3<f32>, view_outgoing: vec3<f32>) -> vec3<f32>
{
    let halfway_direction = normalize(light_outgoing + view_outgoing);
    let fresnel =
        material.normal_reflectance
        + (1.0 - material.normal_reflectance) * pow(1.0 - clamp(dot(halfway_direction, light_outgoing), 0.0, 1.0), 5.0);
    return fresnel;
}
fn computeFresnelPerfectReflection(material: PBRTexel, light_outgoing: vec3<f32>) -> vec3<f32>
{
    let fresnel =
        material.normal_reflectance
        + (1.0 - material.normal_reflectance) * pow(1.0 - clamp(dot(light_outgoing, material.normal), 0.0, 1.0), 5.0);
    return fresnel;
}
fn diffuseBRDF(material: PBRTexel) -> vec3<f32>
{
    return material.subscattering_albedo / 3.14159265359;
}
fn specularBRDF(material: PBRTexel, light_outgoing: vec3<f32>, view_outgoing: vec3<f32>) -> vec3<f32>
{
    let halfway_direction = normalize(light_outgoing + view_outgoing);
    let specular_power = material.specular_power;
    let microfacet_distribution = pow(clamp(dot(halfway_direction, material.normal), 0.0, 1.0), specular_power);
    let normalization_term = (specular_power + 2.0) / 8.0;
    return vec3<f32>(normalization_term * microfacet_distribution);
}
fn sampleSkyViewLUT(
    atmosphere: ptr<function, Atmosphere>,
    position: vec3<f32>,
    direction: vec3<f32>
) -> vec3<f32>
{
    let sin_horizon_zenith = clamp((*atmosphere).planet_radius_Mm / length(position), -1.0, 1.0);
    let horizon_zenith = PI - asin(sin_horizon_zenith);
    let cos_view_zenith = clamp(dot(position, direction) / (length(position) * length(direction)), -1.0, 1.0);
    let cos_horizon_zenith = -safeSqrt(1.0 - sin_horizon_zenith * sin_horizon_zenith);
    let view_zenith = acos(cos_view_zenith);
    var u = 0.0;
    var v = 0.0;
    if (cos_view_zenith > cos_horizon_zenith)
    {
        let angle_fraction = view_zenith / horizon_zenith;
        v = (1.0 - sqrt(1.0 - angle_fraction)) * 0.5;
    }
    else
    {
        let angle_fraction = (view_zenith - horizon_zenith) / (PI - horizon_zenith);
        v = sqrt(angle_fraction) * 0.5 + 0.5;
    }
    {
        var azimuth = 0.0;
        if (direction.z == 0.0)
        {
            azimuth = sign(direction.x) * PI / 2.0;
        }
        else
        {
            azimuth = atan2(direction.x, direction.z);
        }
        u = (azimuth / (2.0 * PI)) + 0.5;
    }
	const V_SAFE_OFFSET = 2.5;
	let lut_height = textureDimensions(skyview_lut).y;
	let v_safe = (0.5 * f32(lut_height) - V_SAFE_OFFSET) / f32(lut_height);
	v = min(v, v_safe);
    return textureSampleLevel(skyview_lut, lut_sampler, vec2<f32>(u, v), 0.0).xyz;
}
fn sunFractionOfRadianceVisible(
    atmosphere: ptr<function, Atmosphere>,
	light: ptr<function, CelestialLight>,
	position: vec3<f32>,
    direction: vec3<f32>
) -> f32
{
    let sin_horizon: f32 = atmosphere.planet_radius_Mm / length(position);
    let cos_horizon: f32 = -safeSqrt(1.0 - sin_horizon * sin_horizon);
	let mu = dot(normalize(position), normalize(direction));
	let intersects_ground = mu < cos_horizon;
	let light_direction = normalize(-(*light).forward);
	let mu_light = dot(normalize(position), normalize(light_direction));
	let cos_light_radius = cos((*light).angular_radius);
	let sin_light_radius = safeSqrt(1.0 - cos_light_radius * cos_light_radius);
	let horizon_factor = smoothstep(-sin_light_radius, sin_light_radius, mu_light - cos_horizon);
	let cos_direction_light = dot(normalize(direction), light_direction);
	let direction_factor = f32(cos_direction_light > cos_light_radius);
	return direction_factor * horizon_factor;
}
fn sampleSunDisk(
    atmosphere: ptr<function, Atmosphere>,
    light: ptr<function, CelestialLight>,
	position: vec3<f32>,
    direction: vec3<f32>
) -> vec3<f32>
{
	let light_direction = normalize(-(*light).forward);
	let cos_direction_light = dot(normalize(direction), light_direction);
	let cos_light_radius = cos((*light).angular_radius);
	let sin_theta = acos(cos_direction_light) / (*light).angular_radius;
	if (sin_theta > 1.0)
	{
		return vec3<f32>(0.0);
	}
	let limb_darkening_intensity_exponent = vec3<f32>(0.482, 0.522, 0.643);
	let cos_theta = safeSqrt(1.0 - sin_theta * sin_theta);
	let limb_darkening_intensity = pow(vec3<f32>(cos_theta), limb_darkening_intensity_exponent);
	let radius = length(position);
	let mu_light = dot(position, light_direction) / radius;
	let transmittance_to_light = sampleTransmittanceLUT_RadiusMu(
		transmittance_lut,
		lut_sampler,
		atmosphere,
		radius,
		mu_light
	);
	let solid_angle_from_space = 2.0 * PI * (1.0 - cos_light_radius);
	let light_luminance_from_space = vec3<f32>(1.0) / solid_angle_from_space;
	return limb_darkening_intensity * transmittance_to_light * light_luminance_from_space;
}
fn sampleSkyLuminance(
    atmosphere: ptr<function, Atmosphere>,
    light: ptr<function, CelestialLight>,
    position: vec3<f32>,
    direction: vec3<f32>
) -> vec3<f32>
{
    var luminance = sampleSkyViewLUT(atmosphere, position, direction) + sampleSunDisk(atmosphere, light, position, direction);
    return luminance;
}
fn sampleGeometryLuminance(
    atmosphere: ptr<function, Atmosphere>,
    light: ptr<function, CelestialLight>,
	screen_texture_uv: vec2<f32>,
    material: PBRTexel,
    position: vec3<f32>,
    direction: vec3<f32>,
    distance: f32,
    intersects_ground: bool
) -> vec3<f32>
{
    let light_direction = normalize(-(*light).forward);
    var origin_step = RaymarchStep();
    origin_step.radius = length(position);
    origin_step.mu = dot(position, direction) / origin_step.radius;
    origin_step.mu_light = dot(position, light_direction) / origin_step.radius;
    origin_step.nu = dot(direction, light_direction);
    let surface_step: RaymarchStep = stepRadiusMu(origin_step, distance);
	let aerial_perspective_scale = f32(textureDimensions(aerial_perspective_lut).z)
		* AERIAL_PERSPECTIVE_MM_PER_SLICE
		* METERS_PER_MM;
	let aerial_perspective = textureSampleLevel(
		aerial_perspective_lut,
		lut_sampler,
		vec3<f32>(screen_texture_uv,clamp(distance / aerial_perspective_scale, 0.0, 1.0)),
		0.0
	);
    let transmittance_to_surface = vec3<f32>(aerial_perspective.w);
    var light_luminance_transfer = aerial_perspective.xyz;
    let surface_position = position + direction * distance;
	let sea_subscattering_factor = 0.3;
	let sea_brdf = sea_subscattering_factor * diffuseBRDF(material);
	let sky_reflection_lobe_solid_angle = (4.0 * PI) / 200;
    let reflection_direction = reflect(normalize(direction), normalize(material.normal));
	let sky_reflection_luminance = sampleSkyViewLUT(atmosphere, surface_position, reflection_direction);
	light_luminance_transfer +=
		transmittance_to_surface
		* sky_reflection_lobe_solid_angle
		* sky_reflection_luminance
		* specularBRDF(material, reflection_direction, -direction)
		* computeFresnelPerfectReflection(material, reflection_direction);
	var sky_diffuse_lobe_solid_angle = 2.0 * PI;
	let diffuse_sample_direction = normalize(light_direction + vec3<f32>(0.0,1.0,0.0));
	let sky_indirect_luminance = sampleSkyViewLUT(atmosphere, surface_position, diffuse_sample_direction);
	light_luminance_transfer +=
		transmittance_to_surface
		* sky_diffuse_lobe_solid_angle
		* sky_indirect_luminance
		* sea_brdf
		* (1.0 - computeFresnelMicrofacet(material, light_direction, -direction));
	let surface_transmittance_to_sun = sampleTransmittanceLUT_Ray(
		transmittance_lut,
        lut_sampler,
		atmosphere,
		surface_position,
		light_direction
	);
	let light_illuminance = surface_transmittance_to_sun
		* sunFractionOfRadianceVisible(atmosphere, light, surface_position, light_direction);
	light_luminance_transfer +=
		transmittance_to_surface
		* light_illuminance
		* mix(
			sea_brdf,
			specularBRDF(material, light_direction, -direction),
			computeFresnelMicrofacet(material, light_direction, -direction)
		);
    return light_luminance_transfer;
}
@compute @workgroup_size(16,16,1)
fn renderCompositedAtmosphere(@builtin(global_invocation_id) global_id : vec3<u32>)
{
    let texel_coord = vec2<u32>(global_id.xy);
    let size = textureDimensions(gbuffer_color_with_surface_world_depth_in_alpha);
    if(texel_coord.x >= size.x || texel_coord.y >= size.y)
    {
        return;
    }
    var atmosphere = u_global.atmosphere;
    var light = u_global.light;
	var camera = u_global.camera;
    let offset = vec2<f32>(0.5, 0.5);
    let uv = (vec2<f32>(texel_coord) + offset) / vec2<f32>(size);
    let origin = vec3<f32>(0.0, atmosphere.planet_radius_Mm, 0.0) + camera.position.xyz / METERS_PER_MM;
    let ndc_space_coord = (uv - vec2<f32>(0.5)) * 2.0 * vec2<f32>(1.0, -1.0);
    let near_plane_depth = 1.0;
    let direction_view_space = camera.inv_proj * vec4(ndc_space_coord, near_plane_depth, 1.0);
    let direction_world = normalize((camera.inv_view * vec4<f32>(direction_view_space.xyz, 0.0)).xyz);
    let color_with_surface_world_depth_in_alpha = textureLoad(gbuffer_color_with_surface_world_depth_in_alpha, texel_coord, 0);
    let normal_with_surface_foam_strength_in_alpha = textureLoad(gbuffer_normal_with_surface_foam_strength_in_alpha, texel_coord, 0);
	var normal = normal_with_surface_foam_strength_in_alpha.xyz;
	if(dot(normal, -direction_world) < 0.0)
	{
		normal -= 2.0 * dot(normal, -direction_world) * (-direction_world);
	}
	let foam_strength = normal_with_surface_foam_strength_in_alpha.w;
    let depth = color_with_surface_world_depth_in_alpha.a / METERS_PER_MM;
    var luminance_transfer = vec3<f32>(0.0);
    let sin_horizon: f32 = atmosphere.planet_radius_Mm / length(origin);
    let cos_horizon: f32 = -safeSqrt(1.0 - sin_horizon * sin_horizon);
	let mu = dot(normalize(origin), normalize(direction_world));
	let intersects_ground = mu < cos_horizon;
    if (depth <= 0.0)
    {
		luminance_transfer = sampleSkyLuminance(&atmosphere, &light, origin, direction_world);
    }
    else
    {
		let color = color_with_surface_world_depth_in_alpha.xyz;
        let material: PBRTexel = convertPBRPropertiesWater(
			color,
			normal.xyz,
			foam_strength
		);
		luminance_transfer = sampleGeometryLuminance(
			&atmosphere,
			&light,
			uv,
			material,
			origin,
			direction_world,
			depth,
			true
		);
    }
    let luminance = light.strength * light.color * luminance_transfer;
    let output = vec4<f32>(sRGB_EOTF(HDRtoSRGB_ACES(luminance)),1.0);
    textureStore(output_color, texel_coord, output);
}
`, j = "rgba16float";
class Ee {
  /**
   * Initializes all resources related to the atmospheric camera pass. The
   * texture will be initialized as one pixel by one pixel, call
   * {@link resize} afterwards to set the size.
   * @param device - The WebGPU device to use.
   * @param gbufferReadGroupLayout - The layout of the GBuffer bind group that
   *  will be provided at rendering time.
   * @param transmittanceLUT - A view into the transmittance LUT that will be
   *  used.
   * @param multiscatterLUT - A view into the multiscatter LUT that will be
   *  used.
   * @param skyviewLUT - A view into the sky view LUT that will be used.
   * @param aerialPerspectiveLUT - A view into the aerial perspective LUT that
   *  will be used.
   * @param filterableLUT - Whether or not the passed LUTs are filterable by
   *  samples. This is a consideration since the LUTs are 32-bit floats per
   *  channel, and filtering such textures is not supported on all WebGPU
   *  instances.
   * @param globalUBO - The global UBO to bind and use when rendering the LUT.
   */
  constructor(e, t, r, i, n, o, s, l) {
    /*
     * @group(0) @binding(0) var output_color: texture_storage_2d<rgba32float, write>;
     * @group(0) @binding(1) var lut_sampler: sampler;
     * @group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
     * @group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
     * @group(0) @binding(4) var skyview_lut: texture_2d<f32>;
     * @group(0) @binding(5) var aerial_perspective_lut: texture_3d<f32>;
     *
     * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
     *
     * @group(2) @binding(0) var gbuffer_color_with_surface_world_depth_in_alpha: texture_2d<f32>;
     * @group(2) @binding(1) var gbuffer_normal_with_surface_jacobian_in_alpha: texture_2d<f32>;
     */
    a(this, "group0Layout");
    a(this, "group1Layout");
    a(this, "lutSampler");
    a(this, "group0");
    a(this, "group1");
    a(this, "outputColor");
    a(this, "outputColorView");
    a(this, "pipeline");
    this.group0Layout = e.createBindGroupLayout({
      entries: [
        {
          // output texture
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: j
          }
        },
        {
          // sampler for the LUTs
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          sampler: {
            type: s ? "filtering" : "non-filtering"
          }
        },
        {
          // transmittance
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: s ? "float" : "unfilterable-float",
            viewDimension: "2d"
          }
        },
        {
          // multiscatter
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: s ? "float" : "unfilterable-float",
            viewDimension: "2d"
          }
        },
        {
          // skyview
          binding: 4,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: s ? "float" : "unfilterable-float",
            viewDimension: "2d"
          }
        },
        {
          // aerial perspective
          binding: 5,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: "float",
            viewDimension: "3d"
          }
        }
      ],
      label: "Atmosphere Camera Group 0"
    }), this.group1Layout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {}
        }
      ],
      label: "Atmosphere Camera Group 1"
    }), this.outputColor = e.createTexture({
      format: j,
      size: { width: 1, height: 1 },
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Atmosphere Camera Output Color"
    }), this.outputColorView = this.outputColor.createView(), this.lutSampler = e.createSampler({
      label: "Atmosphere Camera LUT Sampler",
      magFilter: s ? "linear" : "nearest",
      minFilter: s ? "linear" : "nearest"
    }), this.group0 = e.createBindGroup({
      layout: this.group0Layout,
      entries: [
        {
          binding: 0,
          resource: this.outputColorView
        },
        {
          binding: 1,
          resource: this.lutSampler
        },
        {
          binding: 2,
          resource: r
        },
        {
          binding: 3,
          resource: i
        },
        {
          binding: 4,
          resource: n
        },
        {
          binding: 5,
          resource: o
        }
      ],
      label: "Atmosphere Camera Group 0"
    }), this.group1 = e.createBindGroup({
      layout: this.group1Layout,
      entries: [
        {
          binding: 0,
          resource: { buffer: l.buffer }
        }
      ],
      label: "Atmosphere Camera Group 1"
    });
    const _ = e.createShaderModule({
      code: Ue,
      label: "Atmosphere Camera"
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: _,
        entryPoint: "renderCompositedAtmosphere"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [
          this.group0Layout,
          this.group1Layout,
          t
        ]
      }),
      label: "Atmosphere Camera"
    });
  }
  /**
   * Resizes all managed textures.
   * @see {@link (AtmosphereCameraPassResources:constructor)} for further
   *  descriptions of the parameters.
   * @param size - The new size to use. {@link outputColor} will be this size.
   * @param device - The WebGPU device to use.
   */
  resize(e, t, r, i, n, o) {
    this.outputColor = t.createTexture({
      format: this.outputColor.format,
      size: e,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
    }), this.outputColorView = this.outputColor.createView(), this.group0 = t.createBindGroup({
      layout: this.group0Layout,
      entries: [
        {
          binding: 0,
          resource: this.outputColorView
        },
        {
          binding: 1,
          resource: this.lutSampler
        },
        {
          binding: 2,
          resource: r
        },
        {
          binding: 3,
          resource: i
        },
        {
          binding: 4,
          resource: n
        },
        {
          binding: 5,
          resource: o
        }
      ],
      label: "Atmosphere Camera Group 0 Resized"
    });
  }
  /**
   * Records the rendering of GBuffer scene composited with the atmosphere.
   * @param commandEncoder - The command encoder to record
   *  into.
   * @param timestampInterval - The
   *  interval to record timing information into.
   * @param gbuffer - The GBuffer to use as the input scene. See
   * 	shader source for how it is utilized.
   */
  record(e, t, r) {
    const i = e.beginComputePass({
      timestampWrites: t !== void 0 ? {
        querySet: t.querySet,
        beginningOfPassWriteIndex: t.beginWriteIndex,
        endOfPassWriteIndex: t.endWriteIndex
      } : void 0,
      label: "Atmosphere Camera"
    });
    i.setPipeline(this.pipeline), i.setBindGroup(0, this.group0), i.setBindGroup(1, this.group1), i.setBindGroup(2, r.readGroup), i.dispatchWorkgroups(
      Math.ceil(this.outputColor.width / 16),
      Math.ceil(this.outputColor.height / 16)
    ), i.end();
  }
}
const Le = `const PI = 3.141592653589793;
const METERS_PER_MM = 1000000;
struct Atmosphere
{
scattering_rayleigh_per_Mm : vec3<f32>,
density_scale_rayleigh_Mm : f32,
absorption_rayleigh_per_Mm : vec3<f32>,
planet_radius_Mm : f32,
scattering_mie_per_Mm : vec3<f32>,
density_scale_mie_Mm : f32,
absorption_mie_per_Mm : vec3<f32>,
atmosphere_radius_Mm : f32,
ground_albedo : vec3<f32>,
padding0 : f32,
scattering_ozone_per_Mm : vec3<f32>,
padding1 : f32,
absorption_ozone_per_Mm : vec3<f32>,
padding2 : f32,
padding3 : vec4<f32>,
}
struct CelestialLight
{
color: vec3<f32>,
strength: f32,
forward: vec3<f32>,
angular_radius: f32,
}
struct Camera
{
inv_proj: mat4x4<f32>,
inv_view: mat4x4<f32>,
proj_view: mat4x4<f32>,
position: vec4<f32>,
forward: vec4<f32>,
padding0: mat2x4<f32>,
}
struct Time
{
padding0: vec2<f32>,
time_seconds: f32,
delta_time_seconds: f32,
}
struct GlobalUBO
{
camera: Camera,
ocean_camera: Camera,
atmosphere: Atmosphere,
light: CelestialLight,
time: Time,
}
struct RaySphereHit
{
hit: bool,
t0: f32,
t1: f32,
}
fn raySphereIntersection(
ray_origin: vec3<f32>,
ray_direction_normalized: vec3<f32>,
radius: f32
) -> RaySphereHit
{
let f: vec3<f32> = ray_origin;
let d: vec3<f32> = ray_direction_normalized;
let b: f32 = -1.0 * dot(f, d);
let center_to_intersection_chord: vec3<f32> = f + b * d;
let discriminant: f32 = radius * radius - dot(center_to_intersection_chord, center_to_intersection_chord);
let c: f32 = dot(f, f) - radius * radius;
var output : RaySphereHit;
output.hit = false;
output.t0 = 0.0;
output.t1 = 0.0;
if (discriminant < 0.0)
{
return output;
}
var q: f32 = b;
if (b < 0.0)
{
q -= sqrt(discriminant);
}
else
{
q += sqrt(discriminant);
}
output.hit = true;
output.t0 = c / q;
output.t1 = q;
if (output.t0 > output.t1)
{
let temp: f32 = output.t0;
output.t0 = output.t1;
output.t1 = temp;
}
return output;
}
struct RayPlaneHit {
hit: bool,
t: f32,
}
fn rayPlaneIntersection(
ray_origin: vec3<f32>,
ray_direction: vec3<f32>,
plane_origin: vec3<f32>,
plane_normal: vec3<f32>
) -> RayPlaneHit
{
var result: RayPlaneHit;
let perp = dot(plane_normal, ray_direction);
result.t = dot(plane_origin - ray_origin, plane_normal) / perp;
result.hit = (abs(perp) > 0.00001) && (result.t > 0.0);
return result;
}
@group(0) @binding(0) var aerial_perspective_lut: texture_storage_3d<rgba16float, write>;
@group(0) @binding(1) var lut_sampler: sampler;
@group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
@group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
const AERIAL_PERSPECTIVE_MM_PER_SLICE = 0.001;
const ISOTROPIC_PHASE = 1.0 / (4.0 * PI);
fn safeSqrt(value: f32) -> f32 { return sqrt(max(value, 0.0)); }
fn textureCoordFromUnitRange(value: f32, length: u32) -> f32
{
return 0.5 / f32(length) + value * (1.0 - 1.0 / f32(length));
}
fn unitRangeFromTextureCoord(coord: f32 , length: u32) -> f32
{
return (coord - 0.5 / f32(length)) / (1.0 - 1.0 / f32(length));
}
fn transmittanceLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let atmosphere_radius_Mm_squared: f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared: f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h: f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho: f32 = safeSqrt(radius * radius - planet_radius_Mm_squared);
let d: f32 = max(-radius * mu + safeSqrt(radius * radius * (mu * mu - 1.0) + atmosphere_radius_Mm_squared), 0.0);
let d_min: f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max: f32 = rho + h;
let x_mu: f32 = (d - d_min) / (d_max - d_min);
let x_radius: f32 = rho / h;
return vec2<f32>(
textureCoordFromUnitRange(x_mu, dimensions.x),
textureCoordFromUnitRange(x_radius, dimensions.y)
);
}
fn transmittanceLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let x_mu : f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let x_radius : f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let atmosphere_radius_Mm_squared : f32 = (*atmosphere).atmosphere_radius_Mm * (*atmosphere).atmosphere_radius_Mm;
let planet_radius_Mm_squared : f32 = (*atmosphere).planet_radius_Mm * (*atmosphere).planet_radius_Mm;
let h : f32 = safeSqrt(atmosphere_radius_Mm_squared - planet_radius_Mm_squared);
let rho : f32 = h * x_radius;
let radius : f32 = safeSqrt(rho * rho + planet_radius_Mm_squared);
let d_min : f32 = (*atmosphere).atmosphere_radius_Mm - radius;
let d_max : f32 = rho + h;
let d : f32 = (d_max - d_min) * x_mu + d_min;
let D_EPSILON: f32 = 0.000000001;
if (d < D_EPSILON)
{
return vec2<f32>(radius, 1.0);
}
let mu : f32 = (h * h - rho * rho - d * d) / (2.0 * radius * d);
return vec2<f32>(radius, clamp(mu, -1.0, 1.0));
}
fn multiscatterLUT_RMu_to_UV(
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = 0.5 + 0.5 * mu_light;
let v_unit: f32 = clamp(
(radius - (*atmosphere).planet_radius_Mm)
/ ((*atmosphere).atmosphere_radius_Mm - (*atmosphere).planet_radius_Mm),
0.0, 1.0
);
return vec2<f32>(
textureCoordFromUnitRange(u_unit, dimensions.x),
textureCoordFromUnitRange(v_unit, dimensions.y)
);
}
fn multiscatterLUT_UV_to_RMu(
atmosphere: ptr<function,Atmosphere>,
uv: vec2<f32>,
dimensions: vec2<u32>,
) -> vec2<f32>
{
let u_unit: f32 = unitRangeFromTextureCoord(uv.x, dimensions.x);
let v_unit: f32 = unitRangeFromTextureCoord(uv.y, dimensions.y);
let mu_light: f32 = 2.0 * (u_unit - 0.5);
let radius: f32 = mix(
(*atmosphere).planet_radius_Mm * (1.0002),
(*atmosphere).atmosphere_radius_Mm * (0.9998),
v_unit
);
return vec2<f32>(radius, mu_light);
}
fn sampleMultiscatterLUT(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu_light: f32
) -> vec3<f32>
{
let uv: vec2<f32> = multiscatterLUT_RMu_to_UV(
atmosphere,
radius,
mu_light,
textureDimensions(lut)
);
return textureSampleLevel(lut, s, uv, 0.0).xyz;
}
fn sampleTransmittanceLUT_RadiusMu(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
radius: f32,
mu: f32
) -> vec3<f32>
{
let uv: vec2<f32> = transmittanceLUT_RMu_to_UV(
atmosphere,
radius,
mu,
textureDimensions(lut)
);
let sample = textureSampleLevel(lut, s, uv, 0.0).xyz;
return sample;
}
fn sampleTransmittanceLUT_Ray(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
position: vec3<f32>,
direction: vec3<f32>
) -> vec3<f32>
{
let radius: f32 = length(position);
let mu: f32 = (dot(position, direction) / (length(position) * length(direction)));
return sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, radius, mu);
}
fn sampleTransmittanceLUT_Segment(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
r_start: f32,
mu_start: f32,
d: f32,
intersects_ground: bool
) -> vec3<f32>
{
let r_end = clamp(
safeSqrt(d * d + 2.0 * r_start * mu_start * d + r_start * r_start),
(*atmosphere).planet_radius_Mm, (*atmosphere).atmosphere_radius_Mm
);
let mu_end = clamp((r_start * mu_start + d) / r_end, -1.0, 1.0);
if(intersects_ground)
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, -mu_end)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, -mu_start),
vec3<f32>(1.0)
);
}
else
{
return min(
sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_start, mu_start)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, r_end, mu_end),
vec3<f32>(1.0)
);
}
}
struct ExtinctionSample
{
scattering_rayleigh: vec3<f32>,
scattering_mie: vec3<f32>,
scattering_ozone: vec3<f32>,
absorption_rayleigh: vec3<f32>,
absorption_mie: vec3<f32>,
absorption_ozone: vec3<f32>,
scattering: vec3<f32>,
extinction: vec3<f32>,
}
fn densityExponential(altitude: f32, density_scale: f32) -> f32
{ return exp(-altitude / density_scale); }
fn densityTent(altitude_km: f32) -> f32
{ return max(0.0, 1.0 - abs(altitude_km - 25.0) / 15.0); }
fn sampleExtinction(atmosphere: ptr<function,Atmosphere>, altitude_Mm: f32) -> ExtinctionSample
{
let density_rayleigh: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_rayleigh_Mm);
let scattering_rayleigh: vec3<f32> = (*atmosphere).scattering_rayleigh_per_Mm * density_rayleigh;
let absorption_rayleigh: vec3<f32> = (*atmosphere).absorption_rayleigh_per_Mm * density_rayleigh;
let density_mie: f32 = densityExponential(altitude_Mm, (*atmosphere).density_scale_mie_Mm);
let scattering_mie: vec3<f32> = (*atmosphere).scattering_mie_per_Mm * density_mie;
let absorption_mie: vec3<f32> = (*atmosphere).absorption_mie_per_Mm * density_mie;
let density_ozone: f32 = densityTent(altitude_Mm * 1000.0);
let scattering_ozone: vec3<f32> = (*atmosphere).scattering_ozone_per_Mm * density_ozone;
let absorption_ozone: vec3<f32> = (*atmosphere).absorption_ozone_per_Mm * density_ozone;
var extinction_sample: ExtinctionSample;
extinction_sample.scattering_rayleigh = scattering_rayleigh;
extinction_sample.scattering_mie = scattering_mie;
extinction_sample.scattering_ozone = scattering_ozone;
extinction_sample.absorption_rayleigh = absorption_rayleigh;
extinction_sample.absorption_mie = absorption_mie;
extinction_sample.absorption_ozone = absorption_ozone;
extinction_sample.scattering = scattering_rayleigh + scattering_mie + scattering_ozone;
extinction_sample.extinction = extinction_sample.scattering + absorption_rayleigh + absorption_mie + absorption_ozone;
return extinction_sample;
}
fn phaseRayleigh(cosine: f32) -> f32
{
let scalar: f32 = 3.0 / (16.0 * PI);
let numerator: f32 = (1.0 + cosine * cosine);
return scalar * numerator;
}
fn phaseMie(cosine: f32, g: f32) -> f32
{
let scalar: f32 = 3.0 / (8.0 * PI);
let numerator: f32 = (1.0 - g * g) * (1.0 + cosine * cosine);
let denominator: f32 = (2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * cosine, 1.5);
return scalar * numerator / denominator;
}
struct RaymarchStep
{
radius: f32,
mu: f32,
mu_light: f32,
nu: f32,
};
fn stepRadiusMu(
start: RaymarchStep,
step_distance: f32,
) -> RaymarchStep
{
var result: RaymarchStep;
result.radius = safeSqrt(
step_distance * step_distance + 2.0 * start.radius * start.mu * step_distance
+ start.radius * start.radius
);
result.mu = (start.radius * start.mu + step_distance) / result.radius;
result.nu = start.nu;
result.mu_light = (start.radius * start.mu_light + step_distance * start.nu) / result.radius;
return result;
}
fn sampleTransmittanceLUT_RayMarchStep(
lut: texture_2d<f32>,
s: sampler,
atmosphere: ptr<function,Atmosphere>,
start: RaymarchStep,
step_distance: f32
) -> vec3<f32>
{
const STEP_DISTANCE_EPSILON = 0.0000001;
if (step_distance < STEP_DISTANCE_EPSILON)
{
return vec3<f32>(1.0);
}
let end: RaymarchStep = stepRadiusMu(start, step_distance);
var transmittance = vec3<f32>(0.0);
if (start.mu > 0.0)
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, start.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, end.mu);
}
else
{
transmittance = sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, end.radius, -end.mu)
/ sampleTransmittanceLUT_RadiusMu(lut, s, atmosphere, start.radius, -start.mu);
}
return clamp(transmittance, vec3<f32>(0.0), vec3<f32>(1.0));
}
struct AtmosphereRaycastResult
{
intersects_ground: bool,
t_min: f32,
t_max: f32,
}
fn raycastAtmosphere(atmosphere: ptr<function, Atmosphere>, origin: vec3<f32>, direction: vec3<f32>) -> AtmosphereRaycastResult
{
var result: AtmosphereRaycastResult;
let planet_hit = raySphereIntersection(origin, direction, (*atmosphere).planet_radius_Mm);
let atmosphere_hit = raySphereIntersection(origin, direction, (*atmosphere).atmosphere_radius_Mm);
let inside_planet = planet_hit.hit && planet_hit.t0 < 0.0 && planet_hit.t1 > 0.0;
let intersects_atmosphere = atmosphere_hit.hit && atmosphere_hit.t1 > 0.0;
if (!intersects_atmosphere || inside_planet)
{
result.intersects_ground = true;
result.t_min = 0.0;
result.t_max = 0.0;
return result;
}
result.t_min = max(atmosphere_hit.t0, 0.0);
result.t_max = atmosphere_hit.t1;
if (planet_hit.hit && planet_hit.t0 > 0.0)
{
result.intersects_ground = true;
result.t_max = planet_hit.t0;
}
return result;
}
struct ScatteringResult
{
luminance: vec3<f32>,
transmittance: vec3<f32>,
multiscattering_transfer: vec3<f32>,
}
fn computeLuminanceScatteringIntegral(
atmosphere: ptr<function, Atmosphere>,
light:  ptr<function, CelestialLight>,
lut_sampler: sampler,
transmittance_lut: texture_2d<f32>,
multiscatter_lut: texture_2d<f32>,
origin: vec3<f32>,
direction: vec3<f32>,
include_ground: bool,
intersects_ground: bool,
sample_distance: f32,
) -> ScatteringResult
{
var result: ScatteringResult;
result.luminance = vec3<f32>(0.0);
result.transmittance = vec3<f32>(1.0);
result.multiscattering_transfer = vec3<f32>(0.0);
if(sample_distance <= 0.0)
{
result.luminance = vec3<f32>(1.0, 1.0, 0.0);
return result;
}
let incident_cosine = dot((*light).forward, -direction);
let start_radius: f32 = length(origin);
let start_mu: f32 = dot(origin, direction) / (length(origin) * length(direction));
let start_mu_light: f32 = dot(origin, -(*light).forward) / (length(origin) * length((*light).forward));
let nu: f32 = dot(-(*light).forward, direction) / (length((*light).forward) * length(direction));
let origin_step = RaymarchStep(start_radius, start_mu, start_mu_light, nu);
var transmittance_accumulated = vec3<f32>(1.0);
const SAMPLE_COUNT = 64.0;
const T_SUBSTEP = 0.4;
var t: f32 = 0.0;
var d_t: f32 = 0.0;
for (var s = 0.0; s < SAMPLE_COUNT; s += 1.0)
{
{
var t_begin = s / SAMPLE_COUNT;
var t_end = (s + 1.0) / SAMPLE_COUNT;
t_begin = sample_distance * t_begin * t_begin;
t_end = sample_distance * t_end * t_end;
d_t = t_end - t_begin;
t = mix(t_begin, t_end, T_SUBSTEP);
}
let sample_step: RaymarchStep = stepRadiusMu(origin_step, t);
let altitude = sample_step.radius - (*atmosphere).planet_radius_Mm;
let extinction_sample: ExtinctionSample = sampleExtinction(atmosphere, altitude);
let transmittance_to_t_begin = transmittance_accumulated;
let transmittance_along_path = exp(-extinction_sample.extinction * d_t);
transmittance_accumulated *= transmittance_along_path;
let phase_times_scattering: vec3<f32> =
extinction_sample.scattering_rayleigh * phaseRayleigh(incident_cosine)
+ extinction_sample.scattering_mie * phaseMie(incident_cosine, 0.8)
+ extinction_sample.scattering_ozone * phaseRayleigh(incident_cosine);
let multiscatter = sampleMultiscatterLUT(multiscatter_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
var occlusion_planet: f32 = 0.0;
{
let horizon_sin = (*atmosphere).planet_radius_Mm / sample_step.radius;
let horizon_cos = -safeSqrt(1.0 - horizon_sin * horizon_sin);
occlusion_planet = f32(sample_step.mu_light < horizon_cos);
}
let transmittance_to_sun = sampleTransmittanceLUT_RadiusMu(transmittance_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
var shadowing = vec3<f32>(transmittance_to_sun * (1.0 - f32(occlusion_planet)));
let scattering_illuminance_integral = (vec3(1.0) - transmittance_along_path) / extinction_sample.extinction;
result.luminance +=
(phase_times_scattering * shadowing + multiscatter * extinction_sample.scattering)
* scattering_illuminance_integral * transmittance_to_t_begin
* 1.0;
result.multiscattering_transfer += extinction_sample.scattering * scattering_illuminance_integral * transmittance_to_t_begin;
}
if (include_ground && intersects_ground)
{
let sample_step: RaymarchStep = stepRadiusMu(origin_step, sample_distance);
let transmittance_to_surface = sampleTransmittanceLUT_RayMarchStep(transmittance_lut, lut_sampler, atmosphere, origin_step, sample_distance);
let transmittance_to_sun = sampleTransmittanceLUT_RadiusMu(transmittance_lut, lut_sampler, atmosphere, sample_step.radius, sample_step.mu_light);
let normal_dot_light = clamp(sample_step.mu_light, 0.0, 1.0);
let diffuse = (*atmosphere).ground_albedo / PI;
result.luminance +=
transmittance_to_surface * transmittance_to_sun * normal_dot_light * diffuse
* 1.0;
}
result.transmittance = transmittance_accumulated;
return result;
}
@compute @workgroup_size(16,16,1)
fn computeAerialPerspective(@builtin(global_invocation_id) global_id : vec3<u32>,)
{
    let texel_coord = vec3<u32>(global_id.xyz);
    let size = textureDimensions(aerial_perspective_lut);
    if(texel_coord.x >= size.x || texel_coord.y >= size.y || texel_coord.z >= size.z)
    {
        return;
    }
    var atmosphere = u_global.atmosphere;
    var light = u_global.light;
	var camera = u_global.camera;
    let offset = vec2<f32>(0.5, 0.5);
    let uv = (vec2<f32>(texel_coord.xy) + offset) / vec2<f32>(size.xy);
    let origin = vec3<f32>(0.0, atmosphere.planet_radius_Mm, 0.0) + camera.position.xyz / METERS_PER_MM;
    let ndc_space_coord = (uv - vec2<f32>(0.5)) * 2.0 * vec2<f32>(1.0, -1.0);
    let near_plane_depth = 1.0;
    let direction_view_space = camera.inv_proj * vec4(ndc_space_coord, near_plane_depth, 1.0);
    let direction_world = normalize((camera.inv_view * vec4<f32>(direction_view_space.xyz, 0.0)).xyz);
	let atmosphere_raycast = raycastAtmosphere(&atmosphere, origin, direction_world);
	let sample_distance = min(
		atmosphere_raycast.t_max - atmosphere_raycast.t_min,
		f32(texel_coord.z + 1u) * AERIAL_PERSPECTIVE_MM_PER_SLICE
	);
    let include_ground = false;
    let result = computeLuminanceScatteringIntegral(
        &atmosphere,
        &light,
        lut_sampler,
        transmittance_lut,
        multiscatter_lut,
        origin + direction_world * atmosphere_raycast.t_min,
        direction_world,
        include_ground,
		atmosphere_raycast.intersects_ground,
		sample_distance
    );
	let in_scattering = result.luminance;
	let mean_transmittance = dot(result.transmittance, vec3<f32>(1.0)) / 3.0;
    textureStore(aerial_perspective_lut, texel_coord, vec4(in_scattering, mean_transmittance));
}
`, Y = "rgba16float";
class Ce {
  /**
   * Initializes all resources related to the aerial perspective lookup table.
   * @param device - The WebGPU device to use.
   * @param dimensions - The dimensions to use for the LUT. This increases the
   *  fidelity and detail captured. Generally, a low value like 32 x 32 x 32
   *  is good enough.
   * @param transmittanceLUT - A view into the transmittance LUT that will be
   *  used.
   * @param multiscatterLUT - A view into the multiscatter LUT that will be
   *  used.
   * @param filterableLUT - Whether or not the passed LUTs are filterable by
   *  samples. This is a consideration since the LUTs are 32-bit floats per
   *  channel, and filtering such textures is not supported on all WebGPU
   *  instances.
   * @param globalUBO - The global UBO to bind and use when rendering the LUT.
   */
  constructor(e, t, r, i, n, o) {
    /**
     * The aerial perspective lookup table texture.
     */
    a(this, "texture");
    /**
     * The view into {@link texture}.
     */
    a(this, "view");
    /*
     * @group(0) @binding(0) var aerial_perspective_lut: texture_storage_3d<rgba16float, write>;
     * @group(0) @binding(1) var lut_sampler: sampler;
     * @group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
     * @group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
     *
     * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
     */
    a(this, "group0");
    a(this, "group1");
    a(this, "pipeline");
    this.texture = e.createTexture({
      size: t,
      dimension: "3d",
      format: Y,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Aerial Perspective LUT"
    }), this.view = this.texture.createView({
      label: this.texture.label,
      dimension: "3d"
    });
    const s = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            access: "write-only",
            viewDimension: "3d",
            format: Y
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          sampler: {
            type: n ? "filtering" : "non-filtering"
          }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: n ? "float" : "unfilterable-float"
          }
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: n ? "float" : "unfilterable-float"
          }
        }
      ],
      label: "Aerial Perspective LUT"
    });
    this.group0 = e.createBindGroup({
      layout: s,
      entries: [
        {
          binding: 0,
          resource: this.view
        },
        {
          binding: 1,
          resource: e.createSampler({
            magFilter: n ? "linear" : "nearest",
            minFilter: n ? "linear" : "nearest"
          })
        },
        {
          binding: 2,
          resource: r
        },
        {
          binding: 3,
          resource: i
        }
      ],
      label: "Aerial Perspective LUT Group 0"
    });
    const l = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {}
        }
      ],
      label: "Aerial Perspective LUT Group 1"
    });
    this.group1 = e.createBindGroup({
      layout: l,
      entries: [
        {
          binding: 0,
          resource: { buffer: o.buffer }
        }
      ],
      label: "Aerial Perspective LUT Group 1"
    });
    const _ = e.createShaderModule({
      code: Le
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: _,
        entryPoint: "computeAerialPerspective"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [s, l]
      }),
      label: "Aerial Perspective LUT"
    });
  }
  /**
   * Records the population of the lookup table.
   * @param commandEncoder - The command encoder to record
   * 	into.
   * @param timestampInterval - The
   *  interval to record timing information into.
   */
  record(e, t) {
    const r = e.beginComputePass(
      {
        timestampWrites: t !== void 0 ? {
          querySet: t.querySet,
          beginningOfPassWriteIndex: t.beginWriteIndex,
          endOfPassWriteIndex: t.endWriteIndex
        } : void 0,
        label: "Aerial Perspective LUT"
      }
    );
    r.setPipeline(this.pipeline), r.setBindGroup(0, this.group0), r.setBindGroup(1, this.group1), r.dispatchWorkgroups(
      Math.ceil(this.texture.width / 16),
      Math.ceil(this.texture.height / 16),
      Math.ceil(this.texture.depthOrArrayLayers / 1)
    ), r.end();
  }
}
const Ge = [
  "Scene",
  "GBufferColor",
  "GBufferNormal",
  "AtmosphereTransmittanceLUT",
  "AtmosphereMultiscatterLUT",
  "AtmosphereSkyviewLUT",
  "AtmosphereAerialPerspectiveLUT",
  "FFTWaveSpectrumGaussianNoise",
  "FFTWaveInitialAmplitude",
  "FFTWaveDx_plus_iDy_Dz_iDxdz_Amplitude",
  "FFTWaveDydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude",
  "FFTWaveTurbulenceJacobian",
  "FFTWaveDx_Dy_Dz_Dxdz_Spatial",
  "FFTWaveDydx_Dydz_Dxdx_Dzdz_Spatial"
];
class w {
  /**
   * Uses the passed texture to create a view, while storing the texture
   * object so that the properties can be queried later. The resulting view
   * will have dimension "1d", "2d", "2d-array", or "3d" and will match the
   * texture.
   * @param texture - The texture to store and create a view of.
   */
  constructor(e) {
    a(this, "texture");
    a(this, "view");
    a(this, "viewDimension");
    this.texture = e;
    let t = 1, r = this.texture.dimension;
    this.texture.dimension == "2d" && this.texture.depthOrArrayLayers > 1 && (t = this.texture.depthOrArrayLayers, r = "2d-array"), this.viewDimension = r, this.view = e.createView({
      label: `Render Output View for '${e.label}'`,
      dimension: this.viewDimension,
      arrayLayerCount: t,
      baseArrayLayer: 0
    });
  }
  /**
   * The number of mip levels in the texture.
   * @readonly
   */
  get mipLevelCount() {
    return this.texture.mipLevelCount;
  }
  /**
   * The extent of the texture.
   * @readonly
   */
  get extent() {
    return {
      width: this.texture.width,
      height: this.texture.height,
      depthOrArrayLayers: this.texture.depthOrArrayLayers
    };
  }
}
class Fe {
  constructor() {
    a(this, "flip", !1);
    a(this, "colorGain", { r: 1, g: 1, b: 1 });
    a(this, "channelMasks", { r: !0, g: !0, b: !0 });
    a(this, "swapBARG", !1);
    a(this, "mipLevel", 0);
    a(this, "arrayLayer", 0);
  }
}
const Oe = [
  { id: "AtmosphereTransmittanceLUT", flip: !0 },
  {
    id: "AtmosphereMultiscatterLUT",
    flip: !0,
    colorGain: { r: 20, g: 20, b: 20 }
  },
  {
    id: "AtmosphereSkyviewLUT",
    colorGain: { r: 8, g: 8, b: 8 }
  },
  {
    id: "AtmosphereAerialPerspectiveLUT",
    colorGain: { r: 8, g: 8, b: 8 }
  },
  {
    id: "FFTWaveInitialAmplitude",
    colorGain: { r: 100, g: 100, b: 100 }
  },
  {
    id: "FFTWaveDx_plus_iDy_Dz_iDxdz_Amplitude",
    colorGain: { r: 100, g: 100, b: 100 }
  },
  {
    id: "FFTWaveDydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude",
    colorGain: { r: 100, g: 100, b: 100 }
  }
];
class Ie {
  constructor() {
    a(this, "options");
    a(this, "textureProperties");
    a(this, "controllers");
    this.options = {
      outputTexture: "Scene",
      renderOutputTransforms: new Map(
        Ge.map((e) => [e, new Fe()])
      )
    }, Oe.forEach(
      ({ id: e, ...t }) => {
        const r = this.options.renderOutputTransforms.get(e);
        this.options.renderOutputTransforms.set(e, {
          ...r,
          ...t
        });
      }
    ), this.textureProperties = /* @__PURE__ */ new Map();
  }
  /**
   * @returns The target and transform of the currently selected render
   * output.
   */
  current() {
    return {
      tag: this.options.outputTexture,
      transform: structuredClone(
        this.options.renderOutputTransforms.get(
          this.options.outputTexture
        )
      )
    };
  }
  updateVariableControllerBounds() {
    if (this.controllers === void 0)
      return;
    const e = this.textureProperties.get(this.options.outputTexture);
    e !== void 0 && (this.controllers.mipLevel.max(e.mipLevelCount - 1), this.controllers.mipLevel.disable(e.mipLevelCount == 1), e.mipLevelCount == 1 && this.controllers.mipLevel.setValue(0), this.controllers.mipLevel.updateDisplay(), this.controllers.arrayLayer.max(e.depthOrArrayLayerCount - 1), this.controllers.arrayLayer.disable(
      e.depthOrArrayLayerCount == 1
    ), e.depthOrArrayLayerCount == 1 && this.controllers.arrayLayer.setValue(0), this.controllers.arrayLayer.updateDisplay());
  }
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
  setTextureProperties(e) {
    this.textureProperties.set(e.tag, {
      mipLevelCount: e.mipLevelCount,
      depthOrArrayLayerCount: e.depthOrArrayLayerCount
    }), e.tag == this.options.outputTexture && this.updateVariableControllerBounds();
  }
  setOutput(e) {
    if (this.controllers === void 0)
      return;
    this.options.outputTexture = e;
    const t = this.options.renderOutputTransforms.get(
      this.options.outputTexture
    );
    this.controllers.flip.object = t, this.controllers.colorGain.r.object = t.colorGain, this.controllers.colorGain.g.object = t.colorGain, this.controllers.colorGain.b.object = t.colorGain, this.controllers.channelMasks.r.object = t.channelMasks, this.controllers.channelMasks.g.object = t.channelMasks, this.controllers.channelMasks.b.object = t.channelMasks, this.controllers.swapBARG.object = t, this.controllers.mipLevel.object = t, this.controllers.arrayLayer.object = t, this.updateVariableControllerBounds();
  }
  setUniformColorScale(e) {
    const t = this.options.renderOutputTransforms.get(
      this.options.outputTexture
    );
    t.colorGain.r = e, t.colorGain.g = e, t.colorGain.b = e;
  }
  /**
   * Adds this controller to the UI.
   * @param gui - The root level GUI to attach to.
   */
  setupUI(e) {
    const t = e.addFolder("Render Output").close();
    t.add({ outputTexture: "Scene" }, "outputTexture", {
      "Final Scene": "Scene",
      "[GBuffer] Color": "GBufferColor",
      "[GBuffer] Normal": "GBufferNormal",
      "[Atmosphere] Transmittance LUT": "AtmosphereTransmittanceLUT",
      "[Atmosphere] Multiscatter LUT": "AtmosphereMultiscatterLUT",
      "[Atmosphere] Skyview LUT": "AtmosphereSkyviewLUT",
      "[Atmosphere] Aerial Perspective LUT": "AtmosphereAerialPerspectiveLUT",
      "[FFT Waves] Gaussian Noise": "FFTWaveSpectrumGaussianNoise",
      "[FFT Waves] Initial Amplitude": "FFTWaveInitialAmplitude",
      "[FFT Waves] Frequency Domain (Dx + i * Dy, Dz + i * Dxdz)": "FFTWaveDx_plus_iDy_Dz_iDxdz_Amplitude",
      "[FFT Waves] Frequency Domain (Dydx + i * Dydz, Dxdx + i * Dzdz)": "FFTWaveDydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude",
      "[FFT Waves] (Turbulence, Jacobian)": "FFTWaveTurbulenceJacobian",
      "[FFT Waves] Spatial Domain (Dx, Dy, Dz, Dxdz)": "FFTWaveDx_Dy_Dz_Dxdz_Spatial",
      "[FFT Waves] Spatial Domain (Dydx, Dydz, Dxdx, Dzdz)": "FFTWaveDydx_Dydz_Dxdx_Dzdz_Spatial"
    }).name("Render Output").listen().onFinishChange((g) => {
      this.setOutput(g);
    });
    const r = this.options.renderOutputTransforms.get(
      this.options.outputTexture
    ), i = t.add(r, "flip").name("Flip Image").listen(), n = t.add(r, "mipLevel").min(0).max(0).step(1).name("Mip Level").listen(), o = t.add(r, "arrayLayer").min(0).max(0).step(1).name("Array Layer").listen(), s = -1e4, l = 1e4;
    t.add({ scale: 0 }, "scale").name("Uniform Scale").min(s).max(l).onChange((g) => {
      this.setUniformColorScale(g);
    });
    const _ = t.add(r.channelMasks, "r").name("R").listen(), m = t.add(r.colorGain, "r").name("").min(s).max(l).listen(), c = t.add(r.channelMasks, "g").name("G").listen(), v = t.add(r.colorGain, "g").name("").min(s).max(l).listen(), h = t.add(r.channelMasks, "b").name("B").listen(), y = t.add(r.colorGain, "b").name("").min(s).max(l).listen(), d = t.add(r, "swapBARG").name("Swap Blue-Alpha and Red-Green Pairs").listen();
    this.controllers = {
      flip: i,
      colorGain: {
        r: m,
        g: v,
        b: y
      },
      channelMasks: {
        r: _,
        g: c,
        b: h
      },
      swapBARG: d,
      mipLevel: n,
      arrayLayer: o
    };
  }
}
const X = "rgba16float", Be = "float", qe = "depth32float", Q = "rgba16float", Ne = "float";
class ne {
  /**
   * Instantiates all textures and bind groups for the GBuffer.
   * @param device - The WebGPU device to use.
   * @param dimensions - The dimensions in pixels to instantiate all the
   *  textures with.
   * @param old - A previous instance of `GBuffer` to potentially reuse
   *  resources or parameters from. This is useful to pass when the GBuffer is
   *  resized to match the presentation viewport's dimensions.
   */
  constructor(e, t, r) {
    a(this, "colorWithSurfaceWorldDepthInAlpha");
    a(this, "colorWithSurfaceWorldDepthInAlphaView");
    a(this, "normalWithSurfaceFoamStrengthInAlpha");
    a(this, "normalWithSurfaceFoamStrengthInAlphaView");
    // Depth used for graphics pipelines that render into the gbuffer
    a(this, "depth");
    a(this, "depthView");
    /**
     * Contains all bindings for reading the GBuffer in a shader.
     * @see {@link GBuffer} for descriptions of the targets including formats.
     */
    a(this, "readGroupLayout");
    /**
     * @see {@link readGroupLayout}
     */
    a(this, "readGroup");
    a(this, "writeGroupLayout");
    /**
     * Contains all bindings for writing to the GBuffer in a shader.
     * @see {@link GBuffer} for descriptions of the targets including formats.
     */
    a(this, "writeGroup");
    this.colorWithSurfaceWorldDepthInAlpha = e.createTexture({
      size: t,
      dimension: "2d",
      format: X,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      label: "GBuffer ColorWithSurfaceWorldDepthInAlpha"
    }), this.colorWithSurfaceWorldDepthInAlphaView = this.colorWithSurfaceWorldDepthInAlpha.createView({
      label: "GBuffer ColorWithSurfaceWorldDepthInAlpha"
    }), this.normalWithSurfaceFoamStrengthInAlpha = e.createTexture({
      size: t,
      dimension: "2d",
      format: Q,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      label: "GBuffer Normal"
    }), this.normalWithSurfaceFoamStrengthInAlphaView = this.normalWithSurfaceFoamStrengthInAlpha.createView({
      label: "GBuffer Normal"
    }), this.readGroupLayout = (r == null ? void 0 : r.readGroupLayout) ?? e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
          texture: { sampleType: Be }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
          texture: { sampleType: Ne }
        }
      ],
      label: "GBuffer Read Group Layout"
    }), this.readGroup = e.createBindGroup({
      layout: this.readGroupLayout,
      entries: [
        {
          binding: 0,
          resource: this.colorWithSurfaceWorldDepthInAlphaView
        },
        {
          binding: 1,
          resource: this.normalWithSurfaceFoamStrengthInAlphaView
        }
      ],
      label: "GBuffer Read Group"
    }), this.writeGroupLayout = (r == null ? void 0 : r.writeGroupLayout) ?? e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
          storageTexture: {
            access: "write-only",
            format: X
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
          storageTexture: {
            access: "write-only",
            format: Q
          }
        }
      ],
      label: "GBuffer Write Group Layout"
    }), this.writeGroup = e.createBindGroup({
      layout: this.writeGroupLayout,
      entries: [
        {
          binding: 0,
          resource: this.colorWithSurfaceWorldDepthInAlphaView
        },
        {
          binding: 1,
          resource: this.normalWithSurfaceFoamStrengthInAlphaView
        }
      ],
      label: "GBuffer Write Group"
    }), this.depth = e.createTexture({
      size: t,
      dimension: "2d",
      format: qe,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      label: "GBuffer Depth"
    }), this.depthView = this.depth.createView({ label: "GBuffer Depth" });
  }
  get extent() {
    return {
      width: this.colorWithSurfaceWorldDepthInAlpha.width,
      height: this.colorWithSurfaceWorldDepthInAlpha.height
    };
  }
  get formats() {
    return {
      colorWithSurfaceWorldDepthInAlpha: this.colorWithSurfaceWorldDepthInAlpha.format,
      normalWithSurfaceFoamStrengthInAlpha: this.normalWithSurfaceFoamStrengthInAlpha.format,
      depth: this.depth.format
    };
  }
  colorRenderables() {
    return {
      colorWithSurfaceWorldDepthInAlpha: new w(
        this.colorWithSurfaceWorldDepthInAlpha
      ),
      normalWithSurfaceFoamStrengthInAlpha: new w(
        this.normalWithSurfaceFoamStrengthInAlpha
      )
    };
  }
}
const We = `const PI = 3.141592653589793;
const METERS_PER_MM = 1000000;
struct Atmosphere
{
scattering_rayleigh_per_Mm : vec3<f32>,
density_scale_rayleigh_Mm : f32,
absorption_rayleigh_per_Mm : vec3<f32>,
planet_radius_Mm : f32,
scattering_mie_per_Mm : vec3<f32>,
density_scale_mie_Mm : f32,
absorption_mie_per_Mm : vec3<f32>,
atmosphere_radius_Mm : f32,
ground_albedo : vec3<f32>,
padding0 : f32,
scattering_ozone_per_Mm : vec3<f32>,
padding1 : f32,
absorption_ozone_per_Mm : vec3<f32>,
padding2 : f32,
padding3 : vec4<f32>,
}
struct CelestialLight
{
color: vec3<f32>,
strength: f32,
forward: vec3<f32>,
angular_radius: f32,
}
struct Camera
{
inv_proj: mat4x4<f32>,
inv_view: mat4x4<f32>,
proj_view: mat4x4<f32>,
position: vec4<f32>,
forward: vec4<f32>,
padding0: mat2x4<f32>,
}
struct Time
{
padding0: vec2<f32>,
time_seconds: f32,
delta_time_seconds: f32,
}
struct GlobalUBO
{
camera: Camera,
ocean_camera: Camera,
atmosphere: Atmosphere,
light: CelestialLight,
time: Time,
}
const CASCADE_CAPACITY = 4u;
struct CascadeUBO
{
	wave_number_min_max: vec2<f32>,
	wave_patch_extent_meters: f32,
	padding0: f32,
}
struct FourierWavesUBO
{
	fourier_grid_size: u32,
	gravity: f32,
	padding0: f32,
	wave_period_seconds: f32,
	wind_speed_meters_per_second: f32,
	wind_fetch_meters: f32,
	wave_swell: f32,
	padding1: f32,
	cascades: array<CascadeUBO, CASCADE_CAPACITY>,
}
struct WaveParameters
{
	wave_coord: vec2<i32>,
	wave_vector: vec2<f32>,
	wave_number: f32,
	delta_wave_number: f32,
	frequency: f32,
	d_frequency_d_wave_number: f32,
	wind_angle: f32,
}
fn quantizeFrequency(frequency: f32, fundamental_frequency: f32) -> f32
{
	let multiple = frequency / fundamental_frequency;
	return (multiple - fract(multiple)) * fundamental_frequency;
}
fn waveParameters(
	settings: FourierWavesUBO,
	patch_extent_meters: f32,
	texel_coord: vec2<u32>
) -> WaveParameters
{
	var result: WaveParameters;
	let wave_coord_offset = i32(settings.fourier_grid_size / 2u);
	let g = settings.gravity;
	result.wave_coord = vec2<i32>(i32(texel_coord.x), i32(texel_coord.y)) - vec2<i32>(wave_coord_offset);
	const QUANTIZED_FREQUENCIES = true;
	if (QUANTIZED_FREQUENCIES)
	{
		let frequency_quantization_step = 2.0 * PI / settings.wave_period_seconds;
		let non_quantized_fundamental_wave_number = 2.0 * PI / patch_extent_meters;
		let fundamental_frequency = quantizeFrequency(
			sqrt(g * non_quantized_fundamental_wave_number),
			frequency_quantization_step
		);
		let fundamental_wave_number = fundamental_frequency * fundamental_frequency / g;
		result.delta_wave_number = fundamental_wave_number;
		let wave_number_non_quantized = length(fundamental_wave_number * vec2<f32>(result.wave_coord));
		result.frequency = quantizeFrequency(sqrt(g * wave_number_non_quantized), frequency_quantization_step);
		result.d_frequency_d_wave_number = 0.5 * g / result.frequency;
		result.wave_number = result.frequency * result.frequency / g;
		result.wave_vector = result.wave_number * normalize(vec2<f32>(result.wave_coord));
	}
	else
	{
		let fundamental_wave_number = 2.0 * PI / patch_extent_meters;
		let fundamental_frequency = sqrt(g * fundamental_wave_number);
		result.delta_wave_number = fundamental_wave_number;
		result.wave_vector = fundamental_wave_number * vec2<f32>(result.wave_coord);
		result.wave_number = length(result.wave_vector);
		result.frequency = sqrt(g * result.wave_number);
		result.d_frequency_d_wave_number = 0.5 * g * inverseSqrt(g * result.wave_number);
	}
	result.wind_angle = atan2(result.wave_vector.y, result.wave_vector.x);
	return result;
}
fn waveSpectrumJONSWAP(settings: FourierWavesUBO, frequency: f32, peak_frequency: f32) -> f32
{
	let wind_speed = settings.wind_speed_meters_per_second;
	let wind_fetch = settings.wind_fetch_meters;
	let g = settings.gravity;
	let alpha = 0.076 * pow(wind_speed * wind_speed / (wind_fetch * g), 0.22);
	let gamma = 3.3;
	var sigma = 0.07;
	if (frequency > peak_frequency)
	{
		sigma = 0.09;
	}
	let r = exp(-(frequency-peak_frequency)*(frequency-peak_frequency)/(2 * sigma * sigma * peak_frequency * peak_frequency));
	let f_ratio = peak_frequency / frequency;
	let numerator =
		alpha
		* g * g
		* exp(-1.25 * f_ratio * f_ratio * f_ratio * f_ratio)
		* pow(gamma, r);
	let denominator = frequency * frequency * frequency * frequency * frequency;
	return numerator / denominator;
}
fn gammaApprox(z: f32) -> f32
{
	const c_0 = 1.000000000267524225;
	const c_1 = 4.739837024840160673;
	const c_2 = -1.393160104839919367;
	const r = 2.603209;
	let s = c_0 + c_1 / (z+1.0) + c_2 / (z+2.0);
	return sqrt(2.0 * PI) * pow(z + r + 0.5, z + 0.5) * exp(-(z + r + 0.5)) * s;
}
fn waveDirectionalSpreading(settings: FourierWavesUBO, frequency: f32, peak_frequency: f32, angle: f32) -> f32
{
	let f_ratio = peak_frequency / frequency;
	let swell = settings.wave_swell;
	let s = 16.0 * tanh(f_ratio) * swell * swell;
	let gamma_0 = gammaApprox(s + 1.0);
	let gamma_1 = gammaApprox(2.0 * s + 1.0);
	let q = (pow(2.0, 2.0 * s - 1.0) / PI) * (gamma_0 * gamma_0 / gamma_1);
	return q * pow(abs(cos(angle / 2.0)), 2.0 * s);
}
@group(0) @binding(0) var out_initial_amplitude: texture_storage_2d_array<rg32float, write>;
@group(0) @binding(1) var in_gaussian_random_pairs: texture_2d_array<f32>;
@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
@group(1) @binding(1) var<uniform> u_fourier_waves: FourierWavesUBO;
@compute @workgroup_size(16, 16, 1)
fn computeInitialAmplitude(@builtin(global_invocation_id) global_id: vec3<u32>)
{
    let texel_coord: vec2<u32> = global_id.xy;
	let array_layer: u32 = global_id.z;
    let size: vec2<u32> = textureDimensions(out_initial_amplitude);
    if texel_coord.x >= size.x
		|| texel_coord.y >= size.y
	{
        return;
    }
	let gaussian_pair = textureLoad(in_gaussian_random_pairs, texel_coord, array_layer, 0).xy;
	let wave = waveParameters(u_fourier_waves, u_fourier_waves.cascades[array_layer].wave_patch_extent_meters, texel_coord);
	let wave_number_min_max = u_fourier_waves.cascades[array_layer].wave_number_min_max;
	if (abs(wave.wave_number) < wave.delta_wave_number
		|| abs(wave.wave_number) < wave_number_min_max.x
		|| abs(wave.wave_number) > wave_number_min_max.y
	)
	{
		let amplitude = vec2<f32>(0.0, 0.0);
		textureStore(
			out_initial_amplitude,
			texel_coord,
			array_layer,
			vec4<f32>(amplitude, 0.0, 0.0)
		);
		return;
	}
	let g = u_fourier_waves.gravity;
	let wind_speed = u_fourier_waves.wind_speed_meters_per_second;
	let wind_fetch = u_fourier_waves.wind_fetch_meters;
	let peak_frequency = 22.0 * pow(g * g / (wind_speed * wind_fetch), 1.0 / 3.0);
	let spectrum = waveSpectrumJONSWAP(u_fourier_waves, wave.frequency, peak_frequency)
		* waveDirectionalSpreading(u_fourier_waves, wave.frequency, peak_frequency, wave.wind_angle);
	let magnitude = sqrt(
		2.0
		* spectrum
		* (wave.d_frequency_d_wave_number / wave.wave_number)
		* wave.delta_wave_number * wave.delta_wave_number
	);
	let amplitude = inverseSqrt(2.0)
		* gaussian_pair
		* magnitude;
	textureStore(
		out_initial_amplitude,
		texel_coord,
		array_layer,
		vec4<f32>(amplitude, 0.0, 0.0)
	);
}
@group(0) @binding(2) var out_packed_Dx_plus_iDy_Dz_iDxdz_amplitudeArray: texture_storage_2d_array<rgba32float, write>;
@group(0) @binding(3) var out_packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_amplitudeArray: texture_storage_2d_array<rgba32float, write>;
@group(0) @binding(4) var in_initial_amplitude: texture_2d_array<f32>;
fn complexMult(a: vec2<f32>, b: vec2<f32>) -> vec2<f32>
{
	return vec2<f32>(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}
@compute @workgroup_size(16, 16, 1)
fn computeTimeDependentAmplitude(@builtin(global_invocation_id) global_id: vec3<u32>)
{
    let texel_coord: vec2<u32> = global_id.xy;
	let array_layer: u32 = global_id.z;
    let size = textureDimensions(in_initial_amplitude);
    if texel_coord.x >= size.x
		|| texel_coord.y >= size.y
	{
        return;
    }
	let wave = waveParameters(u_fourier_waves, u_fourier_waves.cascades[array_layer].wave_patch_extent_meters, texel_coord);
	let wave_number_min_max = u_fourier_waves.cascades[array_layer].wave_number_min_max;
	if (abs(wave.wave_number) < wave.delta_wave_number
		|| abs(wave.wave_number) < wave_number_min_max.x
		|| abs(wave.wave_number) > wave_number_min_max.y
	)
	{
		textureStore(
			out_packed_Dx_plus_iDy_Dz_iDxdz_amplitudeArray,
			texel_coord,
			array_layer,
			vec4<f32>(0.0)
		);
		textureStore(
			out_packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_amplitudeArray,
			texel_coord,
			array_layer,
			vec4<f32>(0.0)
		);
		return;
	}
	let k_amplitude = textureLoad(in_initial_amplitude, texel_coord, array_layer, 0).xy;
	let k_minus_coord = vec2<u32>(
		(u_fourier_waves.fourier_grid_size - texel_coord.x) % u_fourier_waves.fourier_grid_size,
		(u_fourier_waves.fourier_grid_size - texel_coord.y) % u_fourier_waves.fourier_grid_size
	);
	let k_minus_amplitude = textureLoad(in_initial_amplitude, k_minus_coord, array_layer, 0).xy;
	let k_minus_amplitude_conjugate = vec2<f32>(k_minus_amplitude.x, -k_minus_amplitude.y);
	let phase = wave.frequency * u_global.time.time_seconds;
	let exponential = vec2<f32>(cos(phase), sin(phase));
	let exponential_conjugate = vec2<f32>(exponential.x, -exponential.y);
	let Dy_amplitude = complexMult(exponential, k_amplitude)
		+ complexMult(exponential_conjugate, k_minus_amplitude_conjugate);
	let iDy_amplitude = vec2<f32>(-Dy_amplitude.y, Dy_amplitude.x);
	var one_over_wave_number = 1.0 / wave.wave_number;
	let k_x = wave.wave_vector.x;
	let k_z = wave.wave_vector.y;
	let Dx_amplitude = iDy_amplitude * k_x * one_over_wave_number;
	let Dz_amplitude = iDy_amplitude * k_z * one_over_wave_number;
	let Dxdx_amplitude = -Dy_amplitude * k_x * k_x * one_over_wave_number;
	let Dydx_amplitude = iDy_amplitude * k_x;
	let Dxdz_amplitude = -Dy_amplitude * k_x * k_z * one_over_wave_number;
	let Dydz_amplitude = iDy_amplitude * k_z;
	let Dzdz_amplitude = -Dy_amplitude * k_z * k_z * one_over_wave_number;
	let iDxdz_amplitude = vec2<f32>(-Dxdz_amplitude.y, Dxdz_amplitude.x);
	let iDydz_amplitude = vec2<f32>(-Dydz_amplitude.y, Dydz_amplitude.x);
	let iDzdz_amplitude = vec2<f32>(-Dzdz_amplitude.y, Dzdz_amplitude.x);
	textureStore(
		out_packed_Dx_plus_iDy_Dz_iDxdz_amplitudeArray,
		texel_coord,
		array_layer,
		vec4<f32>(Dx_amplitude + iDy_amplitude, Dz_amplitude + iDxdz_amplitude)
	);
	textureStore(
		out_packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_amplitudeArray,
		texel_coord,
		array_layer,
		vec4<f32>(Dydx_amplitude + iDydz_amplitude, Dxdx_amplitude + iDzdz_amplitude)
	);
}
@group(0) @binding(5) var out_turbulence_jacobian_array: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(6) var in_turbulence_jacobian_array: texture_2d_array<f32>;
@group(0) @binding(7) var in_Dx_Dy_Dz_Dxdz_spatial_array: texture_2d_array<f32>;
@group(0) @binding(8) var in_Dydx_Dydz_Dxdx_Dzdz_spatial_array: texture_2d_array<f32>;
@compute @workgroup_size(16, 16, 1)
fn accumulateTurbulence(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	let texel_coord = vec2<u32>(global_id.xy);
	let array_layer: u32 = global_id.z;
    let size = textureDimensions(out_turbulence_jacobian_array);
    if texel_coord.x >= size.x || texel_coord.y >= size.y {
        return;
    }
	const mip = 0u;
	let Dx_Dy_Dz_Dxdz = textureLoad(in_Dx_Dy_Dz_Dxdz_spatial_array, texel_coord, array_layer, mip);
	let Dydx_Dydz_Dxdx_Dzdz = textureLoad(in_Dydx_Dydz_Dxdx_Dzdz_spatial_array, texel_coord, array_layer, mip);
	let Dydx = Dydx_Dydz_Dxdx_Dzdz.x;
	let Dydz = Dydx_Dydz_Dxdx_Dzdz.y;
	let Dxdz = Dx_Dy_Dz_Dxdz.w;
	let Dzdx = Dxdz;
	var Dxdx = Dydx_Dydz_Dxdx_Dzdz.z;
	var Dzdz = Dydx_Dydz_Dxdx_Dzdz.w;
	var jacobian_xx = 1.0;
	var jacobian_zz = 1.0;
	var jacobian_xz = 0.0;
	var jacobian_zx = 0.0;
	jacobian_xx += Dxdx;
	jacobian_zz += Dzdz;
	jacobian_xz += Dxdz;
	jacobian_zx += Dzdx;
	let jacobian = jacobian_xx * jacobian_zz - jacobian_xz * jacobian_zx;
	let turbulence_previous = textureLoad(in_turbulence_jacobian_array, texel_coord, array_layer, mip).x;
	let turbulence = min(
		turbulence_previous + u_global.time.delta_time_seconds * 0.5 / max(jacobian, 0.5),
		jacobian
	);
	textureStore(out_turbulence_jacobian_array, texel_coord, array_layer,
		vec4<f32>(turbulence, jacobian, 0.0, 0.0)
	);
}
`, ke = `const TWO_PI = 6.28318530717958647693;
struct DFFTParameters
{
	log_2_size: u32,
	size: u32,
	b_inverse: f32,
}
struct TwoPointButterfly
{
	twiddle: vec2<f32>,
	lower_index: u32,
	upper_index: u32,
}
@group(0) @binding(0) var<uniform> u_parameters: DFFTParameters;
@group(0) @binding(1) var<storage, read_write> out_butterflies_log2n_by_n: array<TwoPointButterfly>;
fn butterflyIndex(step: u32, major_index: u32) -> u32
{
	return step * u_parameters.size + major_index;
}
fn complexExp(imaginary_arg: f32) -> vec2<f32>
{
	return vec2<f32>(cos(imaginary_arg),sin(imaginary_arg));
}
@compute @workgroup_size(2, 1)
fn precomputeDFFTInstructions(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	var major_index = global_id.x;
	let grid_size = u_parameters.size;
	for(var step = 0u; step < u_parameters.log_2_size; step += 1u)
	{
		let dft_size = 1u << (step + 1u);
		let dft_count = u32(grid_size / dft_size);
		let dft = u32(major_index / u32(dft_size / 2u));
		let n = major_index % u32(dft_size / 2u);
		var lower_twiddle: TwoPointButterfly;
		lower_twiddle.twiddle = complexExp(-TWO_PI * f32(n) / f32(dft_size));
		lower_twiddle.lower_index = dft + n * 2u * dft_count;
		lower_twiddle.upper_index = lower_twiddle.lower_index + dft_count;
		var upper_twiddle = lower_twiddle;
		upper_twiddle.twiddle *= -1.0;
		let instruction_index = n * dft_count + dft;
		out_butterflies_log2n_by_n[butterflyIndex(step, instruction_index)] = lower_twiddle;
		out_butterflies_log2n_by_n[butterflyIndex(step, instruction_index + (grid_size / 2u))] = upper_twiddle;
	}
}
@group(0) @binding(2) var<storage, read> butterflies_log2n_by_n: array<TwoPointButterfly>;
@group(0) @binding(3) var<storage, read_write> buffer_0: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> buffer_1: array<vec4<f32>>;
@group(0) @binding(5) var<uniform> step_counter: u32;
@group(0) @binding(6) var out_texture: texture_storage_2d_array<rgba16float, write>;
fn complexMult(a: vec2<f32>, b: vec2<f32>) -> vec2<f32>
{
	return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
fn complexMult2(a: vec4<f32>, b: vec4<f32>) -> vec4<f32>
{
	return vec4<f32>(complexMult(a.xy, b.xy), complexMult(a.zw, b.zw));
}
fn bufferIndex(x: u32, y: u32, z: u32) -> u32
{
	let size = u_parameters.size;
	return x + y * size + z * size * size;
}
fn loadButterfly(major_index: u32) -> TwoPointButterfly
{
	var result = butterflies_log2n_by_n[butterflyIndex(step_counter % u_parameters.log_2_size, major_index)];
	result.twiddle.y *= (1.0 - 2.0 * u_parameters.b_inverse);
	return result;
}
@compute @workgroup_size(16, 16, 1)
fn performDFFTStep(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	let ping_pong = (step_counter % 2u) == 1u;
	if (step_counter < u_parameters.log_2_size)
	{
		let two_point_dft = loadButterfly(global_id.x);
		if(ping_pong)
		{
			let lower_input = buffer_1[bufferIndex(two_point_dft.lower_index, global_id.y, global_id.z)];
			let upper_input = buffer_1[bufferIndex(two_point_dft.upper_index, global_id.y, global_id.z)];
			let result = lower_input + complexMult2(vec4<f32>(two_point_dft.twiddle, two_point_dft.twiddle), upper_input);
			buffer_0[bufferIndex(global_id.x, global_id.y, global_id.z)] = result;
		}
		else
		{
			let lower_input = buffer_0[bufferIndex(two_point_dft.lower_index, global_id.y, global_id.z)];
			let upper_input = buffer_0[bufferIndex(two_point_dft.upper_index, global_id.y, global_id.z)];
			let result = lower_input + complexMult2(vec4<f32>(two_point_dft.twiddle, two_point_dft.twiddle), upper_input);
			buffer_1[bufferIndex(global_id.x, global_id.y, global_id.z)] = result;
		}
	}
	else
	{
		let two_point_dft = loadButterfly(global_id.y);
		if(ping_pong)
		{
			let lower_input = buffer_1[bufferIndex(global_id.x, two_point_dft.lower_index, global_id.z)];
			let upper_input = buffer_1[bufferIndex(global_id.x, two_point_dft.upper_index, global_id.z)];
			let result = lower_input + complexMult2(vec4<f32>(two_point_dft.twiddle, two_point_dft.twiddle), upper_input);
			buffer_0[bufferIndex(global_id.x, global_id.y, global_id.z)] = result;
		}
		else
		{
			let lower_input = buffer_0[bufferIndex(global_id.x, two_point_dft.lower_index, global_id.z)];
			let upper_input = buffer_0[bufferIndex(global_id.x, two_point_dft.upper_index, global_id.z)];
			let result = lower_input + complexMult2(vec4<f32>(two_point_dft.twiddle, two_point_dft.twiddle), upper_input);
			buffer_1[bufferIndex(global_id.x, global_id.y, global_id.z)] = result;
		}
	}
}
@compute @workgroup_size(16, 16, 1)
fn performSwapEvenSignsAndCopyToHalfPrecisionOutput(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	let ping_pong = (step_counter % 2u) == 1u;
	let factor = 1.0 - 2.0 * f32((global_id.x + global_id.y) % 2);
	if(ping_pong)
	{
		textureStore(
			out_texture,
			global_id.xy,
			global_id.z,
			buffer_0[bufferIndex(global_id.x, global_id.y, global_id.z)] * factor
		);
	}
	else
	{
		textureStore(
			out_texture,
			global_id.xy,
			global_id.z,
			buffer_1[bufferIndex(global_id.x, global_id.y, global_id.z)] * factor
		);
	}
}
@group(0) @binding(7) var<storage, read_write> out_step_counter: u32;
@compute @workgroup_size(1)
fn incrementStepCounter(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	if(global_id.x == 0)
	{
		out_step_counter = out_step_counter + 1;
	}
}
@compute @workgroup_size(1)
fn resetStepCounter(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	if(global_id.x == 0)
	{
		out_step_counter = 0;
	}
}
`;
class Ve extends R {
  constructor(t) {
    super(t, 3, "DFFT Parameters UBO");
    a(this, "data", {
      log_2_size: 1,
      size: 2,
      b_inverse: !1
    });
  }
  packed() {
    const t = new ArrayBuffer(this.buffer.size), r = new DataView(t);
    return r.setUint32(0, this.data.log_2_size, !0), r.setUint32(4, this.data.size, !0), r.setFloat32(8, this.data.b_inverse ? 1 : 0, !0), t;
  }
}
const K = 16, C = "rgba16float";
class He {
  /**
   * Initializes all the pipelines and intermediate buffers for the
   * performance of the DFFT on a square grid of size 2^N, where N is
   * {@link log2GridSize}.
   * @param device - The WebGPU device to use.
   * @param log2GridSize - The exponent used to calculate the grid
   *  size. Must be greater than 4.
   */
  constructor(e, t, r) {
    a(this, "parametersUBO");
    a(this, "butterfliesBuffer");
    a(this, "gridSize3D");
    /*
     * We work with buffers instead of textures, since webgpu is restrictive on
     * which storage textures can be read_write without extensions. A possible
     * workaround is using two functions for the perform kernel, identical up to
     * swapping source/destination buffer. This would save copying during IO, but
     * might not be necessary.
     */
    a(this, "complexBuffer0");
    a(this, "complexBuffer1");
    a(this, "stepCounterBuffer");
    a(this, "outputTexture");
    /*
     * @group(0) @binding(0) var<uniform> u_parameters: DFFTParameters;
     * @group(0) @binding(1) var<storage, write> out_butterflies_log2n_by_n: array<TwoPointButterfly>;
     */
    a(this, "butterfliesBindGroup");
    a(this, "computeButterfliesKernel");
    /*
     * @group(0) @binding(0) var<uniform> u_parameters: DFFTParameters;
     * @group(0) @binding(1) var<storage, read> butterflies_log2n_by_n: array<TwoPointButterfly>;
     * @group(0) @binding(2) var<storage, read_write> buffer_0: array<vec2<f32>>;
     * @group(0) @binding(3) var<storage, read_write> buffer_1: array<vec2<f32>>;
     * @group(0) @binding(4) var<uniform> step_counter: u32;
     * @group(0) @binding(5) var<uniform, read_write> out_half_precision_buffer: array<vec4<f16>>;
     */
    a(this, "performBindGroup");
    a(this, "performKernel");
    a(this, "performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel");
    /*
     * @group(0) @binding(0) var<storage, read_write> out_step_counter: u32;
     */
    a(this, "stepCounterBindGroup");
    a(this, "incrementStepCounterKernel");
    a(this, "resetStepCounterKernel");
    if (t < 5)
      throw new RangeError("gridSizeExponent must be greater than 4.");
    if (!Number.isFinite(r) || r < 1)
      throw new RangeError(`layerCount of ${r} is invalid`);
    const i = Math.pow(2, t);
    this.gridSize3D = {
      width: i,
      height: i,
      depthOrArrayLayers: r
    };
    const n = this.gridSize3D.width * this.gridSize3D.height * this.gridSize3D.depthOrArrayLayers;
    this.parametersUBO = new Ve(e), this.parametersUBO.data.log_2_size = t, this.parametersUBO.data.size = i, this.parametersUBO.data.b_inverse = !1, this.parametersUBO.writeToGPU(e.queue);
    const o = 16;
    this.butterfliesBuffer = e.createBuffer({
      label: "DFFT Precompute Stage Steps",
      size: t * i * o,
      usage: GPUBufferUsage.STORAGE
    });
    const s = e.createShaderModule({
      label: "DFFT Precompute Stage",
      code: ke
    }), l = e.createBindGroupLayout({
      label: "DFFT Precompute Stage Group 0",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "uniform" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" }
        }
      ]
    });
    this.butterfliesBindGroup = e.createBindGroup({
      label: "DFFT Precompute Stage Group 0",
      layout: l,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.parametersUBO.buffer
          }
        },
        {
          binding: 1,
          resource: { buffer: this.butterfliesBuffer }
        }
      ]
    });
    const _ = e.createPipelineLayout({
      label: "DFFT Precompute Steps Kernel",
      bindGroupLayouts: [l]
    });
    this.computeButterfliesKernel = e.createComputePipeline({
      label: "DFFT Precompute Stage",
      compute: {
        module: s,
        entryPoint: "precomputeDFFTInstructions"
      },
      layout: _
    });
    const m = e.createBindGroupLayout({
      label: "DFFT Perform Group 0",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "uniform" }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "read-only-storage" }
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" }
        },
        {
          binding: 4,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" }
        },
        {
          binding: 5,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "uniform" }
        },
        {
          binding: 6,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: C,
            viewDimension: "2d-array",
            access: "write-only"
          }
        }
      ]
    });
    this.complexBuffer0 = e.createBuffer({
      label: "DFFT Buffer 0",
      size: n * K,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    }), this.complexBuffer1 = e.createBuffer({
      label: "DFFT Buffer 1",
      size: this.complexBuffer0.size,
      usage: this.complexBuffer0.usage
    });
    const c = 4;
    this.stepCounterBuffer = e.createBuffer({
      label: "DFFT Step Counter",
      size: c,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE | GPUBufferUsage.UNIFORM
    });
    const v = new Uint32Array(1);
    v[0] = 0, e.queue.writeBuffer(this.stepCounterBuffer, 0, v), this.outputTexture = e.createTexture({
      label: "DFFT Output Texture",
      format: C,
      size: this.gridSize3D,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC
    }), this.performBindGroup = e.createBindGroup({
      label: "DFFT Perform Group 0",
      layout: m,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.parametersUBO.buffer
          }
        },
        {
          binding: 2,
          resource: { buffer: this.butterfliesBuffer }
        },
        {
          binding: 3,
          resource: { buffer: this.complexBuffer0 }
        },
        {
          binding: 4,
          resource: { buffer: this.complexBuffer1 }
        },
        {
          binding: 5,
          resource: { buffer: this.stepCounterBuffer }
        },
        {
          binding: 6,
          resource: this.outputTexture.createView()
        }
      ]
    });
    const h = e.createPipelineLayout({
      label: "DFFT Perform",
      bindGroupLayouts: [m]
    });
    this.performKernel = e.createComputePipeline({
      label: "DFFT Perform DFFT Step",
      compute: {
        module: s,
        entryPoint: "performDFFTStep"
      },
      layout: h
    }), this.performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel = e.createComputePipeline({
      label: "DFFT Perform Swap Even Signs",
      compute: {
        module: s,
        entryPoint: "performSwapEvenSignsAndCopyToHalfPrecisionOutput"
      },
      layout: h
    });
    const y = e.createBindGroupLayout({
      label: "DFFT Step Counter Bind Group 0",
      entries: [
        {
          binding: 7,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" }
        }
      ]
    });
    this.stepCounterBindGroup = e.createBindGroup({
      label: "DFFT Step Counter Bind Group 0",
      layout: y,
      entries: [
        {
          binding: 7,
          resource: { buffer: this.stepCounterBuffer }
        }
      ]
    });
    const d = e.createPipelineLayout({
      label: "DFFT Step Counter",
      bindGroupLayouts: [y]
    });
    this.incrementStepCounterKernel = e.createComputePipeline({
      label: "DFFT Increment Step Counter Kernel",
      layout: d,
      compute: {
        module: s,
        entryPoint: "incrementStepCounter"
      }
    }), this.resetStepCounterKernel = e.createComputePipeline({
      label: "DFFT Reset Step Counter Kernel",
      layout: d,
      compute: {
        module: s,
        entryPoint: "resetStepCounter"
      }
    }), this.parametersUBO.data.b_inverse = !0, this.parametersUBO.writeToGPU(e.queue);
    const g = e.createCommandEncoder({
      label: "DFFT Precompute"
    }), p = g.beginComputePass({
      label: "DFFT Precompute Steps"
    });
    p.setPipeline(this.computeButterfliesKernel), p.setBindGroup(0, this.butterfliesBindGroup), p.dispatchWorkgroups(i / 2 / 2, 1), p.end(), e.queue.submit([g.finish()]);
  }
  recordPerformOnBuffer0(e, t) {
    const r = 2 * this.parametersUBO.data.log_2_size, i = e.beginComputePass({
      label: "DFFT Perform",
      timestampWrites: t
    });
    for (let n = 0; n < r; n++)
      n === 0 ? (i.setPipeline(this.resetStepCounterKernel), i.setBindGroup(0, this.stepCounterBindGroup), i.dispatchWorkgroups(1)) : (i.setPipeline(this.incrementStepCounterKernel), i.setBindGroup(0, this.stepCounterBindGroup), i.dispatchWorkgroups(1)), i.setPipeline(this.performKernel), i.setBindGroup(0, this.performBindGroup), i.dispatchWorkgroups(
        this.gridSize3D.width / 16,
        this.gridSize3D.height / 16,
        this.gridSize3D.depthOrArrayLayers / 1
      );
    i.setPipeline(
      this.performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel
    ), i.setBindGroup(0, this.performBindGroup), i.dispatchWorkgroups(
      this.gridSize3D.width / 16,
      this.gridSize3D.height / 16,
      this.gridSize3D.depthOrArrayLayers / 1
    ), i.end();
  }
  /**
   * Performs two parallel Discrete Fast Fourier Transforms on a 2D square
   * grid of pairs of complex numbers.
   * - The source and destination textures must be 2D. They must be square and
   *   match the size passed during initialization. The source must be
   *   {@link REQUIRED_INPUT_FORMAT} and the destination must be
   *   {@link REQUIRED_OUTPUT_FORMAT}. This method will throw an error upon
   *   any incompatibilities.
   * - For consideration if parameter {@link inverse} is true: Typically, the
   *   inverse of the forward fourier transform needs to be scaled by 1/N,
   *   where N is the size of the input data (N^2 in the case of our 2D
   *   transform). We skip this, and it is up to the consumer of the output to
   *   scale or interpret the data as needed.
   * @param device - The WebGPU device to use.
   * @param commandEncoder - The command encoder to record
   *  into.
   * @param sourceTextureArray - The texture to copy the input
   *  from.
   * @param destinationTextureArray - The texture to copy the
   *  output into.
   * @param inverse - Whether to perform the inverse Fourier
   *  transform instead.
   * @param endTimestampWrites -
   * deprecated
   */
  recordPerform(e, t, r, i, n, o) {
    const s = "rgba32float";
    if (r.format != s)
      throw RangeError(
        `sourceTexture (format ${r.format}) must be ${s}`
      );
    if (i.format != C)
      throw RangeError(
        `destinationArray (format ${r.format}) must be ${s}`
      );
    if (r.width != i.width || r.height != i.height || r.depthOrArrayLayers != i.depthOrArrayLayers)
      throw RangeError(
        `SourceTexture ${r.label} does not match destination texture ${i.label} extent`
      );
    this.parametersUBO.data.b_inverse = n, this.parametersUBO.writeToGPU(e.queue), t.copyTextureToBuffer(
      { texture: r },
      {
        buffer: this.complexBuffer0,
        bytesPerRow: this.gridSize3D.width * K,
        rowsPerImage: this.gridSize3D.height
      },
      this.gridSize3D
    ), this.recordPerformOnBuffer0(t, o), t.copyTextureToTexture(
      {
        texture: this.outputTexture
      },
      {
        texture: i
      },
      this.gridSize3D
    );
  }
}
const je = `@group(0) @binding(0) var out_next_mip_level: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var in_previous_mip_level: texture_2d_array<f32>;
@compute @workgroup_size(16, 16, 1)
fn fillMipMap(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	let array_level = global_id.z;
	let color = 0.25 * (
		  textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(0,0), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(0,1), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(1,0), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(1,1), array_level, 0)
	);
	textureStore(out_next_mip_level, global_id.xy, array_level, color);
}
@compute @workgroup_size(1, 1, 1)
fn fillMipMapSmaller(@builtin(global_invocation_id) global_id: vec3<u32>)
{
	let array_level = global_id.z;
	let color = 0.25 * (
		  textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(0,0), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(0,1), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(1,0), array_level, 0)
		+ textureLoad(in_previous_mip_level, 2 * global_id.xy + vec2<u32>(1,1), array_level, 0)
	);
	textureStore(out_next_mip_level, global_id.xy, array_level, color);
}
`, G = "rgba16float";
class Ye {
  constructor(e) {
    /*
     * @group(0) @binding(0) var out_next_mip_level: texture_storage_2d<rgba16float, write>;
     * @group(0) @binding(1) var in_previous_mip_level: texture_2d<f32>;
     */
    a(this, "fillMipMapTextureInOutLayout");
    // private fillMipMapTextureBindGroups: GPUBindGroup[];
    // private baseSize: { width: number; height: number };
    // Workgroup size is (16,16,1)
    a(this, "fillMipMapKernel");
    // Workgroup size is (1,1,1)
    a(this, "fillMipMapSmallerKernel");
    this.fillMipMapTextureInOutLayout = e.createBindGroupLayout({
      label: "MipMap Generation fillMipMap Texture In-Out",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: G,
            viewDimension: "2d-array"
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: "unfilterable-float",
            viewDimension: "2d-array"
          }
        }
      ]
    });
    const t = e.createShaderModule({
      label: "sky-sea/mipmap.wgsl",
      code: je
    }), r = e.createPipelineLayout({
      label: "MipMap Generation fillMipMap Kernel",
      bindGroupLayouts: [this.fillMipMapTextureInOutLayout]
    });
    this.fillMipMapKernel = e.createComputePipeline({
      label: "MipMap Generation fillMipMap Kernel",
      layout: r,
      compute: {
        module: t,
        entryPoint: "fillMipMap"
      }
    }), this.fillMipMapSmallerKernel = e.createComputePipeline({
      label: "MipMap Generation fillMipMapSmaller Kernel",
      layout: r,
      compute: {
        module: t,
        entryPoint: "fillMipMapSmaller"
      }
    });
  }
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
  createBindGroups(e, t) {
    if (t.format != G)
      throw new RangeError(
        `Invalid source texture (label ${t.label}) for MipMap generation`,
        {
          cause: `Source format is ${t.format} when expected ${G}`
        }
      );
    if (t.dimension != "2d")
      throw new RangeError(
        `Invalid source texture (label ${t.label}) for MipMap generation`,
        {
          cause: "Source texture is not 2d"
        }
      );
    if (!(t.usage & GPUTextureUsage.COPY_SRC))
      throw new RangeError(
        `Invalid source texture (label ${t.label}) for MipMap generation`,
        {
          cause: "Source usage is missing required flag COPY_SRC"
        }
      );
    if (t.width != t.height || !Number.isInteger(Math.log2(t.width)))
      throw new RangeError(
        `Invalid source texture (label ${t.label}) for MipMap generation`,
        {
          cause: `Source dimensions of (${t.width},${t.height}) are invalid, texture must be square and power-of-2.`
        }
      );
    const r = Math.log2(t.width);
    return {
      level0Size: {
        width: t.width,
        height: t.height
      },
      bindGroupsByMipLevel: [
        ...new Array(
          Math.min(r, t.mipLevelCount) - 1
        ).keys()
      ].map((i, n) => {
        const o = n + 1, s = n;
        return e.createBindGroup({
          label: `MipMap Generation for '${t.label}' IO Bind Group '${s} => ${o}'`,
          layout: this.fillMipMapTextureInOutLayout,
          entries: [
            {
              binding: 0,
              resource: t.createView({
                dimension: "2d-array",
                baseMipLevel: o,
                mipLevelCount: 1
              })
            },
            {
              binding: 1,
              resource: t.createView({
                dimension: "2d-array",
                baseMipLevel: s,
                mipLevelCount: 1
              })
            }
          ]
        });
      }),
      arrayLevelCount: t.depthOrArrayLayers
    };
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
  recordUpdateMipMaps(e, t) {
    t.bindGroupsByMipLevel.forEach((r, i) => {
      e.setBindGroup(0, r);
      const n = 1 << i, o = t.level0Size.width / n, s = t.level0Size.height / n;
      o >= 16 && s >= 16 ? (e.setPipeline(this.fillMipMapKernel), e.dispatchWorkgroups(
        o / 16,
        s / 16,
        t.arrayLevelCount
      )) : (e.setPipeline(this.fillMipMapSmallerKernel), e.dispatchWorkgroups(
        o,
        s,
        t.arrayLevelCount
      ));
    });
  }
}
const Xe = 9.8, Qe = 100, Ke = "rg32float", $ = "rg32float", $e = "rgba16float", Z = "rgba16float", F = "rgba32float", Ze = 4, J = 4;
class Je extends R {
  constructor(t) {
    super(
      t,
      8 + Ze * J,
      "Fourier Waves UBO"
    );
    a(this, "data", {
      fourier_grid_size: 1,
      gravity: Xe,
      padding0: 0,
      wave_period_seconds: Qe,
      wind_speed_meters_per_second: 10,
      wind_fetch_meters: 10 * 1e3,
      wave_swell: 0.3,
      padding1: 0,
      cascades: new Array(4)
    });
  }
  packed() {
    const t = new ArrayBuffer(this.buffer.size), r = new DataView(t), i = new Float32Array(t);
    r.setUint32(0, this.data.fourier_grid_size, !0), r.setFloat32(4, this.data.gravity, !0), r.setFloat32(8, this.data.padding0, !0), r.setFloat32(12, this.data.wave_period_seconds, !0), r.setFloat32(16, this.data.wind_speed_meters_per_second, !0), r.setFloat32(20, this.data.wind_fetch_meters, !0), r.setFloat32(24, this.data.wave_swell, !0), r.setFloat32(28, this.data.padding1, !0);
    const n = 8;
    return this.data.cascades.forEach((o, s) => {
      const l = n + s * J;
      i.set(o.wave_number_min_max, l), i[l + 2] = o.wave_patch_extent_meters, i[l + 3] = 0;
    }), t;
  }
}
function et() {
  const u = Math.random(), e = Math.random(), t = Math.sqrt(-2 * Math.log(u)), r = 2 * Math.PI * e, i = t * Math.cos(r), n = t * Math.sin(r);
  return [i, n];
}
class tt {
  constructor(e, t, r) {
    a(this, "Dx_Dy_Dz_Dxdz_Spatial");
    a(this, "Dydx_Dydz_Dxdx_Dzdz_Spatial");
    a(this, "turbulenceJacobian");
    /**
     * Contains `(Dx,Dy,Dz,d/dz Dx)` packed in RGBA, where `(Dx,Dy,Dz)` is the
     * displacement of the ocean surface at the sampled point and `d/di` is the
     * partial derivative with respect to coordinate `i`. The dimension is
     * `2d-array`, and each array layer represents one cascade.
     * @readonly
     */
    a(this, "Dx_Dy_Dz_Dxdz_SpatialAllMips");
    /**
     * Contains `(d/dx Dy,d/dz Dy,d/dx Dx,d/dz Dz)` packed in RGBA, where
     * `(Dx,Dy,Dz)` is the displacement of the ocean surface at the sampled
     * point and `d/di` is the partial derivative with respect to coordinate
     * `i`. The dimension is `2d-array`, and each array layer represents one
     * cascade.
     */
    a(this, "Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips");
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
    a(this, "turbulenceJacobianOneMip");
    e.mipLevelCount != t.mipLevelCount && console.warn(
      `FFT Wave Displacement maps do not have identical mip levels. ${e.mipLevelCount} vs ${t.mipLevelCount}`
    ), this.Dx_Dy_Dz_Dxdz_Spatial = e, this.Dydx_Dydz_Dxdx_Dzdz_Spatial = t, this.turbulenceJacobian = r, this.Dx_Dy_Dz_Dxdz_SpatialAllMips = this.Dx_Dy_Dz_Dxdz_Spatial.createView({
      label: `FFT Wave DisplacementMaps for ${this.Dx_Dy_Dz_Dxdz_Spatial.label}`
    }), this.Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips = this.Dydx_Dydz_Dxdx_Dzdz_Spatial.createView({
      label: `FFT Wave DisplacementMaps for ${this.Dydx_Dydz_Dxdx_Dzdz_Spatial.label}`
    }), this.turbulenceJacobianOneMip = this.turbulenceJacobian.map(
      (i, n) => i.createView({
        label: `FFT Wave DisplacementMaps for ${this.turbulenceJacobian[n].label} index ${n}`
      })
    );
  }
  /**
   * The number of mip levels for every map in this collection.
   * @readonly
   */
  get mipLevelCount() {
    return this.Dx_Dy_Dz_Dxdz_Spatial.mipLevelCount;
  }
}
class rt {
  /**
   * Instantiates all the cascades and resources.
   * @param device - The WebGPU device to use.
   * @param globalUBO - The global UBO that will be bound into
   * 	pipelines.
   */
  constructor(e, t, r) {
    /*
     * We produce a discrete spectrum of waves, for which the various values
     * will be stored in square textures. This dimension determines the diameter
     * of that square, so the total number of frequencies we produce. Our
     * spectrum is discrete so we can apply an IDFT algorithm to determine the
     * displacement when rendering the sums of these waves. (x,z) position in
     * this grid uniquely identifies a wave with wave vector k = (k_x,k_z)
     */
    a(this, "gridSize");
    a(this, "cascadeCount");
    a(this, "initialAmplitudeKernel");
    a(this, "timeDependentAmplitudeKernel");
    a(this, "accumulateTurbulenceKernel");
    a(this, "dfftResources");
    a(this, "mipMapGenerator");
    a(this, "cascades");
    /*
     * Final output maps that store the results of the FFT.
     * Is mipmapped and has array layers, one layer for each cascade.
     */
    a(this, "Dx_Dy_Dz_Dxdz_SpatialArray");
    a(this, "Dydx_Dydz_Dxdx_Dzdz_SpatialArray");
    /*
     * Array layer N contains the jacobian computed from layers 1 through N.
     * Each layer is a cascade, so it is done this way in case we only sample the lower cascades.
     * We do not want the turbulence from higher cascades to affect the lower cascades.
     *
     * We need two storage textures since we cannot natively have read_write storage. They are swapped out each frame.
     */
    a(this, "turbulenceJacobianArrays");
    a(this, "turbulenceJacobianGroup1");
    a(this, "turbulenceJacobianIndex", 0);
    a(this, "Dx_Dy_Dz_Dxdz_SpatialArray_MipMapBindings");
    a(this, "Dydx_Dydz_Dxdx_Dzdz_SpatialArray_MipMapBindings");
    a(this, "waveSettings");
    this.gridSize = Math.pow(2, r);
    const i = e.createBindGroupLayout({
      label: "FFT Wave Initial Amplitude h_0(k) Group 0",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: $,
            viewDimension: "2d-array",
            access: "write-only"
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: "unfilterable-float",
            viewDimension: "2d-array"
          }
        }
      ]
    }), n = e.createBindGroupLayout({
      label: "FFT Wave Initial Amplitude h_0(k) Group 1",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "uniform"
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "uniform"
          }
        }
      ]
    }), o = e.createShaderModule({
      label: "FFT Wave",
      code: We
    });
    this.initialAmplitudeKernel = e.createComputePipeline({
      label: "FFT Wave Initial Amplitude h_0(k)",
      layout: e.createPipelineLayout({
        label: "FFT Wave Initial Amplitude h_0(k)",
        bindGroupLayouts: [
          i,
          n
        ]
      }),
      compute: {
        module: o,
        entryPoint: "computeInitialAmplitude"
      }
    }), this.mipMapGenerator = new Ye(e);
    const s = e.createBindGroupLayout(
      {
        label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 0",
        entries: [
          {
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            storageTexture: {
              format: F,
              viewDimension: "2d-array",
              access: "write-only"
            }
          },
          {
            binding: 3,
            visibility: GPUShaderStage.COMPUTE,
            storageTexture: {
              format: F,
              viewDimension: "2d-array",
              access: "write-only"
            }
          },
          {
            binding: 4,
            visibility: GPUShaderStage.COMPUTE,
            texture: {
              sampleType: "unfilterable-float",
              viewDimension: "2d-array"
            }
          }
        ]
      }
    ), l = e.createBindGroupLayout(
      {
        label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 1",
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: "uniform" }
          },
          {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: "uniform" }
          }
        ]
      }
    );
    this.timeDependentAmplitudeKernel = e.createComputePipeline({
      label: "FFT Wave Time Dependent Fourier Amplitude h(k,t)",
      layout: e.createPipelineLayout({
        label: "FFT Wave Time Dependent Fourier Amplitude h(k,t)",
        bindGroupLayouts: [
          s,
          l
        ]
      }),
      compute: {
        module: o,
        entryPoint: "computeTimeDependentAmplitude"
      }
    });
    const _ = e.createBindGroupLayout({
      label: "FFT Wave Accumulate Turbulence Group 0",
      entries: [
        {
          binding: 5,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            viewDimension: "2d-array",
            format: Z
          }
        },
        {
          binding: 6,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            viewDimension: "2d-array",
            sampleType: "unfilterable-float"
          }
        },
        {
          binding: 7,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            viewDimension: "2d-array",
            sampleType: "unfilterable-float"
          }
        },
        {
          binding: 8,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            viewDimension: "2d-array",
            sampleType: "unfilterable-float"
          }
        }
      ]
    }), m = e.createBindGroupLayout({
      label: "FFT Wave Accumulate Turbulence Group 1",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "uniform" }
        }
      ]
    });
    this.accumulateTurbulenceKernel = e.createComputePipeline({
      label: "FFT Wave Accumulate Turbulence",
      layout: e.createPipelineLayout({
        label: "FFT Wave Accumulate Turbulence",
        bindGroupLayouts: [
          _,
          m
        ]
      }),
      compute: {
        module: o,
        entryPoint: "accumulateTurbulence"
      }
    });
    function c(b) {
      const f = 2 * b;
      return 2 * Math.PI / f;
    }
    const v = [200, 50, 10], h = [
      1e-3,
      ...v.map(
        (b) => c(b / this.gridSize)
      ),
      1e3
    ], y = v.map((b, f) => ({
      patchExtentMeters: b,
      waveNumberMinMax: [
        h[f],
        h[f + 1]
      ]
    }));
    this.cascadeCount = y.length, this.dfftResources = new He(
      e,
      r,
      this.cascadeCount
    ), this.Dx_Dy_Dz_Dxdz_SpatialArray = e.createTexture({
      label: "FFT Wave Final Displacement Array",
      format: $e,
      dimension: "2d",
      size: this.textureGridSize,
      mipLevelCount: r,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST
    }), this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray = e.createTexture({
      label: "FFT Wave Final Derivatives Array",
      format: this.Dx_Dy_Dz_Dxdz_SpatialArray.format,
      size: this.textureGridSize,
      mipLevelCount: this.Dx_Dy_Dz_Dxdz_SpatialArray.mipLevelCount,
      usage: this.Dx_Dy_Dz_Dxdz_SpatialArray.usage
    }), this.cascades = this.createCascades(
      e,
      t,
      this.gridSize,
      y
    );
    const d = 15360, g = this.textureGridSize.width * this.textureGridSize.height * this.textureGridSize.depthOrArrayLayers, p = new Uint16Array(
      g * 4
    ).fill(d);
    this.turbulenceJacobianArrays = [0, 0].map((b, f) => e.createTexture({
      label: `FFT Wave (Turbulence,Jacobian) Array ${f}`,
      format: Z,
      size: this.textureGridSize,
      mipLevelCount: r,
      usage: GPUTextureUsage.STORAGE_BINDING | // write to
      GPUTextureUsage.TEXTURE_BINDING | // read from to accumulate turbulence
      GPUTextureUsage.COPY_SRC | // mip map generation
      GPUTextureUsage.COPY_DST
      // initialize/wipe turbulence to 1.0
    })).reduce(
      (b, f, M, P) => {
        e.queue.writeTexture(
          { texture: f },
          p,
          {
            bytesPerRow: this.Dx_Dy_Dz_Dxdz_SpatialArray.width * 8,
            rowsPerImage: this.Dx_Dy_Dz_Dxdz_SpatialArray.height
          },
          this.textureGridSize
        );
        const U = e.createBindGroup({
          layout: this.accumulateTurbulenceKernel.getBindGroupLayout(
            0
          ),
          entries: [
            {
              binding: 5,
              resource: f.createView({
                mipLevelCount: 1
              })
            },
            {
              binding: 6,
              resource: P[(M + 1) % P.length].createView({})
            },
            {
              binding: 7,
              resource: this.Dx_Dy_Dz_Dxdz_SpatialArray.createView(
                {}
              )
            },
            {
              binding: 8,
              resource: this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray.createView(
                {}
              )
            }
          ]
        });
        return b.concat({
          textureArray: f,
          bindGroup: U,
          mipMapBindings: this.mipMapGenerator.createBindGroups(
            e,
            f
          )
        });
      },
      []
    ), this.turbulenceJacobianGroup1 = e.createBindGroup({
      label: "FFT Wave Accumulate Turbulence Group 1",
      layout: this.accumulateTurbulenceKernel.getBindGroupLayout(1),
      entries: [
        {
          binding: 0,
          resource: { buffer: t.buffer }
        }
      ]
    }), this.Dx_Dy_Dz_Dxdz_SpatialArray_MipMapBindings = this.mipMapGenerator.createBindGroups(
      e,
      this.Dx_Dy_Dz_Dxdz_SpatialArray
    ), this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray_MipMapBindings = this.mipMapGenerator.createBindGroups(
      e,
      this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray
    ), this.waveSettings = {
      gravity: 0,
      waveSwell: 0,
      windFetchMeters: 0,
      windSpeedMetersPerSeconds: 0
    };
  }
  /**
   * The extent used by every texture parameterized by the fourier grid.
   */
  get textureGridSize() {
    return {
      width: this.gridSize,
      height: this.gridSize,
      depthOrArrayLayers: this.cascadeCount
    };
  }
  /**
   * Gets the index of the turbulence-jacobian map that will be (or was)
   * written into this frame.
   * @readonly
   */
  get turbulenceMapIndex() {
    return this.turbulenceJacobianIndex;
  }
  createCascades(e, t, r, i) {
    const n = this.textureGridSize, o = n.width * n.height * n.depthOrArrayLayers, s = e.createTexture({
      label: "FFT Wave Gaussian Noise",
      format: Ke,
      size: n,
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
    }), l = 2, _ = 8, m = new Float32Array(
      o * l
    );
    for (let f = 0; f < m.length; f++)
      m[f] = et()[0];
    e.queue.writeTexture(
      { texture: s },
      m,
      {
        bytesPerRow: _ * n.width,
        rowsPerImage: n.height
      },
      n
    );
    const c = new Je(e);
    c.data.fourier_grid_size = r, i.forEach((f, M) => {
      c.data.cascades[M] = {
        wave_number_min_max: T.create(...f.waveNumberMinMax),
        wave_patch_extent_meters: f.patchExtentMeters,
        padding0: 0
      };
    }), c.writeToGPU(e.queue);
    const v = e.createTexture({
      label: "FFT Wave Fourier Amplitude h_0(k)",
      format: $,
      size: n,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
    }), h = e.createBindGroup({
      label: "FFT Wave Initial Amplitude h_0(k) Group 0",
      layout: this.initialAmplitudeKernel.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: v.createView()
        },
        {
          binding: 1,
          resource: s.createView()
        }
      ]
    }), y = e.createBindGroup({
      label: "FFT Wave Initial Amplitude h_0(k) Group 1",
      layout: this.initialAmplitudeKernel.getBindGroupLayout(1),
      entries: [
        {
          binding: 0,
          resource: { buffer: t.buffer }
        },
        {
          binding: 1,
          resource: { buffer: c.buffer }
        }
      ]
    }), d = e.createTexture(
      {
        label: "FFT Wave Packed (Dx + iDy, Dz + iDxdz) Amplitude",
        format: F,
        size: n,
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
      }
    ), g = e.createTexture({
      label: "FFT Wave Packed (Dydx + iDydz, Dxdx + iDzdz) Amplitude",
      format: d.format,
      size: n,
      usage: d.usage
    }), p = e.createBindGroup({
      label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 0",
      layout: this.timeDependentAmplitudeKernel.getBindGroupLayout(0),
      entries: [
        {
          binding: 2,
          resource: d.createView()
        },
        {
          binding: 3,
          resource: g.createView()
        },
        {
          binding: 4,
          resource: v.createView()
        }
      ]
    }), b = e.createBindGroup({
      label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 1",
      layout: this.timeDependentAmplitudeKernel.getBindGroupLayout(1),
      entries: [
        {
          binding: 0,
          resource: { buffer: t.buffer }
        },
        {
          binding: 1,
          resource: { buffer: c.buffer }
        }
      ]
    });
    return {
      gaussianNoiseArray: s,
      initialAmplitudeArray: v,
      waveSettings: c,
      initialAmplitudeGroup0: h,
      initialAmplitudeGroup1: y,
      packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray: d,
      packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray: g,
      timeDependentAmplitudeGroup0: p,
      timeDependentAmplitudeGroup1: b
    };
  }
  /**
   * @returns The views into all the FFT Wave textures, for read-only display
   *  purposes.
   */
  views() {
    return {
      gaussianNoise: new w(
        this.cascades.gaussianNoiseArray
      ),
      initialAmplitude: new w(
        this.cascades.initialAmplitudeArray
      ),
      packed_Dx_plus_iDy_Dz_iDxdz_Amplitude: new w(
        this.cascades.packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray
      ),
      packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude: new w(
        this.cascades.packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray
      ),
      turbulenceJacobian: new w(
        this.turbulenceJacobianArrays[0].textureArray
      ),
      Dx_Dy_Dz_Dxdz_Spatial: new w(
        this.Dx_Dy_Dz_Dxdz_SpatialArray
      ),
      Dydx_Dydz_Dxdx_Dzdz_Spatial: new w(
        this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray
      )
    };
  }
  /**
   * @returns The views into the displacement maps that are the output of the
   *  ocean spectrum.
   */
  displacementMaps() {
    return new tt(
      this.Dx_Dy_Dz_Dxdz_SpatialArray,
      this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray,
      this.turbulenceJacobianArrays.map((e) => e.textureArray)
    );
  }
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
  record(e, t, r, i) {
    if (r.gravity != this.waveSettings.gravity || r.waveSwell != this.waveSettings.waveSwell || r.windSpeedMetersPerSeconds != this.waveSettings.windSpeedMetersPerSeconds || r.windFetchMeters != this.waveSettings.windFetchMeters) {
      this.waveSettings = structuredClone(r);
      const l = t.beginComputePass({
        label: "FFT Wave Initial Amplitude"
      }), _ = this.cascades.waveSettings;
      _.data.wave_swell = this.waveSettings.waveSwell, _.data.wind_fetch_meters = this.waveSettings.windFetchMeters, _.data.wind_speed_meters_per_second = this.waveSettings.windSpeedMetersPerSeconds, _.data.gravity = this.waveSettings.gravity, _.writeToGPU(e.queue), l.setPipeline(this.initialAmplitudeKernel), l.setBindGroup(0, this.cascades.initialAmplitudeGroup0), l.setBindGroup(1, this.cascades.initialAmplitudeGroup1);
      const m = this.textureGridSize;
      l.dispatchWorkgroups(
        m.width / 16,
        m.height / 16,
        m.depthOrArrayLayers / 1
      ), l.end();
    }
    {
      const l = t.beginComputePass({
        label: "FFT Wave Fourier Amplitude Realization",
        timestampWrites: i !== void 0 ? {
          querySet: i.querySet,
          beginningOfPassWriteIndex: i.beginWriteIndex
        } : void 0
      });
      l.setPipeline(this.timeDependentAmplitudeKernel), l.setBindGroup(
        0,
        this.cascades.timeDependentAmplitudeGroup0
      ), l.setBindGroup(
        1,
        this.cascades.timeDependentAmplitudeGroup1
      );
      const _ = this.textureGridSize;
      l.dispatchWorkgroups(
        _.width / 16,
        _.height / 16,
        _.depthOrArrayLayers / 1
      ), l.end();
    }
    this.dfftResources.recordPerform(
      e,
      t,
      this.cascades.packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray,
      this.Dx_Dy_Dz_Dxdz_SpatialArray,
      !0,
      void 0
    ), this.dfftResources.recordPerform(
      e,
      t,
      this.cascades.packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray,
      this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray,
      !0,
      void 0
    );
    const o = t.beginComputePass({
      label: "Turbulence Accumulation"
    });
    o.setPipeline(this.accumulateTurbulenceKernel), o.setBindGroup(
      0,
      this.turbulenceJacobianArrays[this.turbulenceJacobianIndex].bindGroup
    ), o.setBindGroup(1, this.turbulenceJacobianGroup1), o.dispatchWorkgroups(
      this.gridSize / 16,
      this.gridSize / 16,
      this.cascadeCount / 1
    ), o.end();
    const s = t.beginComputePass({
      label: "MipMap Generation",
      timestampWrites: i !== void 0 ? {
        querySet: i.querySet,
        endOfPassWriteIndex: i.endWriteIndex
      } : void 0
    });
    this.mipMapGenerator.recordUpdateMipMaps(
      s,
      this.Dx_Dy_Dz_Dxdz_SpatialArray_MipMapBindings
    ), this.mipMapGenerator.recordUpdateMipMaps(
      s,
      this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray_MipMapBindings
    ), this.mipMapGenerator.recordUpdateMipMaps(
      s,
      this.turbulenceJacobianArrays[this.turbulenceJacobianIndex].mipMapBindings
    ), this.turbulenceJacobianIndex += 1, this.turbulenceJacobianIndex %= this.turbulenceJacobianArrays.length, s.end();
  }
}
const at = `const PI = 3.141592653589793;
const METERS_PER_MM = 1000000;
struct Atmosphere
{
scattering_rayleigh_per_Mm : vec3<f32>,
density_scale_rayleigh_Mm : f32,
absorption_rayleigh_per_Mm : vec3<f32>,
planet_radius_Mm : f32,
scattering_mie_per_Mm : vec3<f32>,
density_scale_mie_Mm : f32,
absorption_mie_per_Mm : vec3<f32>,
atmosphere_radius_Mm : f32,
ground_albedo : vec3<f32>,
padding0 : f32,
scattering_ozone_per_Mm : vec3<f32>,
padding1 : f32,
absorption_ozone_per_Mm : vec3<f32>,
padding2 : f32,
padding3 : vec4<f32>,
}
struct CelestialLight
{
color: vec3<f32>,
strength: f32,
forward: vec3<f32>,
angular_radius: f32,
}
struct Camera
{
inv_proj: mat4x4<f32>,
inv_view: mat4x4<f32>,
proj_view: mat4x4<f32>,
position: vec4<f32>,
forward: vec4<f32>,
padding0: mat2x4<f32>,
}
struct Time
{
padding0: vec2<f32>,
time_seconds: f32,
delta_time_seconds: f32,
}
struct GlobalUBO
{
camera: Camera,
ocean_camera: Camera,
atmosphere: Atmosphere,
light: CelestialLight,
time: Time,
}
struct RaySphereHit
{
hit: bool,
t0: f32,
t1: f32,
}
fn raySphereIntersection(
ray_origin: vec3<f32>,
ray_direction_normalized: vec3<f32>,
radius: f32
) -> RaySphereHit
{
let f: vec3<f32> = ray_origin;
let d: vec3<f32> = ray_direction_normalized;
let b: f32 = -1.0 * dot(f, d);
let center_to_intersection_chord: vec3<f32> = f + b * d;
let discriminant: f32 = radius * radius - dot(center_to_intersection_chord, center_to_intersection_chord);
let c: f32 = dot(f, f) - radius * radius;
var output : RaySphereHit;
output.hit = false;
output.t0 = 0.0;
output.t1 = 0.0;
if (discriminant < 0.0)
{
return output;
}
var q: f32 = b;
if (b < 0.0)
{
q -= sqrt(discriminant);
}
else
{
q += sqrt(discriminant);
}
output.hit = true;
output.t0 = c / q;
output.t1 = q;
if (output.t0 > output.t1)
{
let temp: f32 = output.t0;
output.t0 = output.t1;
output.t1 = temp;
}
return output;
}
struct RayPlaneHit {
hit: bool,
t: f32,
}
fn rayPlaneIntersection(
ray_origin: vec3<f32>,
ray_direction: vec3<f32>,
plane_origin: vec3<f32>,
plane_normal: vec3<f32>
) -> RayPlaneHit
{
var result: RayPlaneHit;
let perp = dot(plane_normal, ray_direction);
result.t = dot(plane_origin - ray_origin, plane_normal) / perp;
result.hit = (abs(perp) > 0.00001) && (result.t > 0.0);
return result;
}
const CASCADE_CAPACITY = 4u;
struct PlaneWave
{
    direction: vec2<f32>,
    amplitude: f32,
    wavelength: f32,
}
struct WaveCascade
{
	padding0: vec3<f32>,
	patch_size_meters: f32,
}
struct WaveSurfaceDisplacementUBO
{
	patch_world_half_extent: f32,
	b_gerstner: u32,
	b_displacement_map: u32,
	vertex_size: u32,
	gbuffer_extent: vec2<f32>,
	foam_scale: f32,
	foam_bias: f32,
	padding_0: vec3<f32>,
	procedural_wave_count: u32,
	cascades: array<WaveCascade, CASCADE_CAPACITY>,
}
@group(0) @binding(0) var<uniform> u_settings: WaveSurfaceDisplacementUBO;
@group(0) @binding(1) var<uniform> u_global: GlobalUBO;
@group(1) @binding(0) var displacement_map_sampler: sampler;
@group(1) @binding(1) var Dx_Dy_Dz_Dxdz_spatial: texture_2d_array<f32>;
@group(1) @binding(2) var Dydx_Dydz_Dxdx_Dzdz_spatial: texture_2d_array<f32>;
@group(1) @binding(3) var<storage> u_waves: array<PlaneWave>;
@group(2) @binding(0) var turbulence_jacobian: texture_2d_array<f32>;
struct OceanSurfaceDisplacement
{
	displacement: vec3<f32>,
}
fn sampleOceanSurfaceDisplacementFromMap(
	global_uv: vec2<f32>,
	cascade_position_weights: array<f32,CASCADE_CAPACITY>,
	gerstner: bool,
) -> OceanSurfaceDisplacement
{
    var result: OceanSurfaceDisplacement;
	result.displacement = vec3<f32>(0.0);
	for(var array_layer = 0u; array_layer <= 3u; array_layer++)
	{
		let position_lambda = cascade_position_weights[array_layer];
		let patch_uv = global_uv / u_settings.cascades[array_layer].patch_size_meters;
		let Dx_Dy_Dz_Dxdz = textureSampleLevel(
			Dx_Dy_Dz_Dxdz_spatial,
			displacement_map_sampler,
			patch_uv,
			array_layer,
			0.0
		);
		var delta_displacement = Dx_Dy_Dz_Dxdz.xyz;
		if(!gerstner)
		{
			delta_displacement.x = 0.0;
			delta_displacement.z = 0.0;
		}
		result.displacement += position_lambda * delta_displacement;
	}
	return result;
}
fn sampleOceanSurfaceDisplacementFromWave(
	wave: PlaneWave,
	time: f32,
	coords: vec2<f32>,
	falloff_distance: f32
) -> OceanSurfaceDisplacement
{
	let falloff_factor = (1.0 - smoothstep(0.0, falloff_distance, length(coords)));
    let wave_amplitude = falloff_factor * wave.amplitude;
    let wave_direction = normalize(wave.direction);
    let wavelength = wave.wavelength;
    let wave_number = 2.0 * 3.141592653589793 / wavelength;
    let gravity = 9.8;
    let angular_frequency = sqrt(gravity * wave_number);
    let wave_vector = wave_direction * wave_number;
    let theta = dot(coords, wave_vector) - angular_frequency * time;
    let sin_theta = sin(theta);
    let cos_theta = cos(theta);
    var result: OceanSurfaceDisplacement;
    let result_xz = -wave_direction * wave_amplitude * sin_theta;
    let result_y = wave_amplitude * cos_theta;
    result.displacement = vec3<f32>(result_xz.x, result_y, result_xz.y);
    return result;
}
fn getOceanSurfaceDisplacement(
	global_uv: vec2<f32>,
	cascade_position_weights: array<f32,CASCADE_CAPACITY>,
) -> OceanSurfaceDisplacement
{
	var result: OceanSurfaceDisplacement;
	result.displacement = vec3<f32>(0.0);
	if(u_settings.b_displacement_map == 1u)
	{
    	let uv = (global_uv + vec2<f32>(0.5,0.5));
		let gerstner = u_settings.b_gerstner == 1u;
		let sample = sampleOceanSurfaceDisplacementFromMap(uv, cascade_position_weights, gerstner);
		result.displacement += sample.displacement;
	}
	else
	{
		var sample: OceanSurfaceDisplacement;
		for (var i = 0u; i < u_settings.procedural_wave_count; i++)
		{
			sample = sampleOceanSurfaceDisplacementFromWave(
				u_waves[i],
				u_global.time.time_seconds,
				global_uv,
				u_settings.patch_world_half_extent
			);
			result.displacement += sample.displacement;
		}
	}
	return result;
}
fn projectNDCToOceanSurface(
	ndc: vec2<f32>,
	horizon_distance: f32,
	camera: Camera,
) -> vec3<f32>
{
	let near_plane = 1.0;
	let direction_view_space = camera.inv_proj * vec4<f32>(
		ndc,
		near_plane,
		1.0
	);
	let direction_world = normalize((camera.inv_view * vec4<f32>(direction_view_space.xyz, 0.0)).xyz);
	let ocean_hit = raySphereIntersection(
		camera.position.xyz + vec3<f32>(0.0, u_global.atmosphere.planet_radius_Mm * METERS_PER_MM, 0.0),
		direction_world,
		u_global.atmosphere.planet_radius_Mm * METERS_PER_MM
	);
	if(!ocean_hit.hit)
	{
		return vec3<f32>(0.0, -100000.0, 0.0);
	}
	let t = mix(
		ocean_hit.t0,
		horizon_distance,
		smoothstep(0.2, 1.0, ocean_hit.t0 / horizon_distance)
	);
	let flat_position = camera.position.xyz + t * direction_world;
	let planet_radius = u_global.atmosphere.planet_radius_Mm * METERS_PER_MM;
	return planet_radius * normalize(flat_position + vec3<f32>(0.0, planet_radius, 0.0))
		- vec3<f32>(0.0, planet_radius, 0.0);
}
fn projectNDCToOceanSurfaceWithPivot(
	ndc: vec2<f32>,
	horizon_distance: f32,
	camera: Camera,
	pivot: vec3<f32>,
) -> vec3<f32>
{
	let world_position = projectNDCToOceanSurface(ndc,horizon_distance,camera);
	let pivot_offset = world_position - pivot;
	let pivot_distance = length(pivot_offset);
	const STRETCH_THRESHOLDS = vec2<f32>(2.0,20.0);
	if(pivot_distance < STRETCH_THRESHOLDS.x || camera.position.y > 100.0)
	{
		return world_position;
	}
	let stretch_parameter = smoothstep(
		STRETCH_THRESHOLDS.x,
		STRETCH_THRESHOLDS.y,
		pivot_distance
	);
	const STRETCH_ABSOLUTE_BIAS = 80.0;
	let stretch = ((pivot_distance + stretch_parameter * STRETCH_ABSOLUTE_BIAS) / pivot_distance);
	return pivot + pivot_offset * stretch;
}
struct VertexOut {
    @builtin(position) position             : vec4<f32>,
	@location(0) surface_normal             : vec3<f32>,
    @location(1) color                      : vec3<f32>,
    @location(2) camera_distance            : f32,
	@location(3) cascade_1234_normal_weights: vec4<f32>,
	@location(5) global_uv                  : vec2<f32>,
}
@vertex
fn screenSpaceWarped(@builtin(vertex_index) index : u32) -> VertexOut
{
	var output : VertexOut;
	let ocean_camera = u_global.ocean_camera;
	let vert_coord = vec2<f32>(
		f32(index % u_settings.vertex_size),
		f32(index / u_settings.vertex_size)
	) / f32(u_settings.vertex_size - 1u);
	let overlap = vec2<f32>(1.05);
	let ndc_horizon_forward =
		ocean_camera.proj_view
		* vec4<f32>(
			ocean_camera.forward.x,
			0.0,
			ocean_camera.forward.z,
			0.0
		);
	let ndc_min = vec2<f32>(-overlap.x, -overlap.y);
	let ndc_max = vec2<f32>(overlap.x, min(ndc_horizon_forward.y / ndc_horizon_forward.w, overlap.y));
	let ndc_space_coord = mix(ndc_min, ndc_max, vert_coord);
	let planet_radius = u_global.atmosphere.planet_radius_Mm * METERS_PER_MM;
	let camera_radius = length(ocean_camera.position.xyz + vec3<f32>(0.0, planet_radius, 0.0));
	let horizon_distance = sqrt(camera_radius * camera_radius - planet_radius * planet_radius);
	let center_position = projectNDCToOceanSurface(
		mix(ndc_min, ndc_max, 0.5),
		horizon_distance,
		ocean_camera,
	);
	let cell_world_position = projectNDCToOceanSurfaceWithPivot(
		ndc_space_coord,
		horizon_distance,
		ocean_camera,
		center_position
	);
	let fraction_to_horizon = distance(cell_world_position, ocean_camera.position.xyz) / horizon_distance;
	let weight = 1.0 - smoothstep(0.3, 0.5, fraction_to_horizon);
	let cascade_position_weights = array<f32, CASCADE_CAPACITY>(weight,weight,weight,weight);
	let cascade_normal_weights = array<f32, CASCADE_CAPACITY>(weight,weight,weight,weight);
	let global_uv = cell_world_position.xz;
	let displacement_result = getOceanSurfaceDisplacement(
		global_uv,
		cascade_position_weights
	);
	let world_position = cell_world_position + displacement_result.displacement;
	output.global_uv = global_uv;
    output.position = u_global.camera.proj_view * vec4<f32>(world_position, 1.0);
    output.camera_distance = distance(u_global.camera.position.xyz, world_position);
	output.position.z /= 1.001;
	output.color = 0.3 * vec3<f32>(16.0 / 255.0, 97.0 / 255.0, 171.0 / 255.0);
	output.surface_normal = normalize(
		world_position
		+ vec3<f32>(0.0, u_global.atmosphere.planet_radius_Mm * METERS_PER_MM, 0.0)
	);
	output.cascade_1234_normal_weights = vec4<f32>(
		cascade_normal_weights[0],
		cascade_normal_weights[1],
		cascade_normal_weights[2],
		cascade_normal_weights[3],
	);
    return output;
}
struct FragmentOut
{
    @location(0) color_with_surface_world_depth_in_alpha: vec4<f32>,
    @location(1) world_normal_with_surface_foam_strength_in_alpha: vec4<f32>,
}
struct OceanSurfaceTangents
{
	tangent: vec3<f32>,
	bitangent: vec3<f32>,
	foam_strength: f32,
}
fn sampleOceanSurfaceTangentDifferentialFromMap(
	global_uv: vec2<f32>,
	cascade_normal_weights: array<f32,CASCADE_CAPACITY>,
	gerstner: bool,
) -> OceanSurfaceTangents
{
    var result: OceanSurfaceTangents;
	result.tangent = vec3<f32>(0.0);
	result.bitangent = vec3<f32>(0.0);
	var turbulence_accumulated = 0.0;
	var turbulence_max = 0.0;
	for(var array_layer = 0u; array_layer < textureNumLayers(Dx_Dy_Dz_Dxdz_spatial); array_layer++)
	{
		let normal_lambda = cascade_normal_weights[array_layer];
		let patch_uv = global_uv / u_settings.cascades[array_layer].patch_size_meters;
		let Dx_Dy_Dz_Dxdz = textureSample(
			Dx_Dy_Dz_Dxdz_spatial,
			displacement_map_sampler,
			patch_uv,
			array_layer
		);
		let Dydx_Dydz_Dxdx_Dzdz = textureSample(
			Dydx_Dydz_Dxdx_Dzdz_spatial,
			displacement_map_sampler,
			patch_uv,
			array_layer
		);
		let Dydx = Dydx_Dydz_Dxdx_Dzdz.x;
		let Dydz = Dydx_Dydz_Dxdx_Dzdz.y;
		let Dxdz = Dx_Dy_Dz_Dxdz.w * f32(gerstner);
		let Dzdx = Dxdz;
		var Dxdx = Dydx_Dydz_Dxdx_Dzdz.z * f32(gerstner);
		var Dzdz = Dydx_Dydz_Dxdx_Dzdz.w * f32(gerstner);
		result.tangent += normal_lambda * vec3<f32>(Dxdx, Dydx, Dzdx);
		result.bitangent += normal_lambda * vec3<f32>(Dxdz, Dydz, Dzdz);
		let turbulence = textureSample(
			turbulence_jacobian,
			displacement_map_sampler,
			patch_uv,
			array_layer
		).x;
		turbulence_accumulated += normal_lambda * clamp(1.0 - turbulence, 0.0, 1.0);
		turbulence_max += max(normal_lambda, 0.1);
	}
	result.foam_strength = clamp(
		u_settings.foam_scale * (turbulence_accumulated / turbulence_max - u_settings.foam_bias),
		0.0,
		1.0
	);
	return result;
}
fn sampleOceanSurfaceTangentDifferentialFromWave(
	global_uv: vec2<f32>,
	wave: PlaneWave,
	time: f32,
	falloff_distance: f32,
	gerstner: bool,
) -> OceanSurfaceTangents
{
	let falloff_factor = (1.0 - smoothstep(0.0, falloff_distance, length(global_uv)));
    let wave_amplitude = falloff_factor * wave.amplitude;
    let wave_direction = normalize(wave.direction);
    let wavelength = wave.wavelength;
    let wave_number = 2.0 * PI / wavelength;
    let gravity = 9.8;
    let angular_frequency = sqrt(gravity * wave_number);
    let wave_vector = wave_direction * wave_number;
    let theta = dot(global_uv, wave_vector) - angular_frequency * time;
    let sin_theta = sin(theta);
    let cos_theta = cos(theta);
    var result: OceanSurfaceTangents;
    result.tangent = vec3<f32>(
        - wave_amplitude * wave_direction.x * cos_theta * wave_vector.x,
        - wave_amplitude * sin_theta * wave_vector.x,
        - wave_amplitude * wave_direction.y * cos_theta * wave_vector.x,
    );
    result.bitangent = vec3<f32>(
        - wave_amplitude * wave_direction.x * cos_theta * wave_vector.y,
        - wave_amplitude * sin_theta * wave_vector.y,
        - wave_amplitude * wave_direction.y * cos_theta * wave_vector.y,
    );
	result.foam_strength = 0.0;
	if(!gerstner)
	{
		result.tangent.x = 0.0;
		result.tangent.z = 0.0;
		result.bitangent.x = 0.0;
		result.bitangent.z = 0.0;
	}
    return result;
}
fn getOceanSurfaceTangents(
	global_uv: vec2<f32>,
	cascade_normal_weights: array<f32,CASCADE_CAPACITY>,
) -> OceanSurfaceTangents
{
	var result: OceanSurfaceTangents;
    result.tangent = vec3<f32>(1.0, 0.0, 0.0);
    result.bitangent = vec3<f32>(0.0, 0.0, 1.0);
	result.foam_strength = 0.0;
	let gerstner = u_settings.b_gerstner == 1u;
	if(u_settings.b_displacement_map == 1u)
	{
		let sample: OceanSurfaceTangents = sampleOceanSurfaceTangentDifferentialFromMap(
			global_uv,
			cascade_normal_weights,
			gerstner
		);
		result.tangent += sample.tangent;
		result.bitangent += sample.bitangent;
		result.foam_strength += sample.foam_strength;
	}
	else
	{
		var sample: OceanSurfaceTangents;
		for (var i = 0u; i < u_settings.procedural_wave_count; i++)
		{
			sample = sampleOceanSurfaceTangentDifferentialFromWave(
				global_uv,
				u_waves[i],
				u_global.time.time_seconds,
				u_settings.patch_world_half_extent,
				gerstner
			);
			result.tangent += sample.tangent;
			result.bitangent += sample.bitangent;
			result.foam_strength += sample.foam_strength
				/ f32(u_settings.procedural_wave_count);
		}
	}
	result.tangent = normalize(result.tangent);
	result.bitangent = normalize(result.bitangent);
	return result;
}
@fragment
fn rasterizationFragment(frag_interpolated: VertexOut) -> FragmentOut
{
    var output : FragmentOut;
    output.color_with_surface_world_depth_in_alpha = vec4<f32>(
		frag_interpolated.color,
		frag_interpolated.camera_distance
	);
	var cascade_normal_weights = array<f32, CASCADE_CAPACITY>();
	cascade_normal_weights[0] = frag_interpolated.cascade_1234_normal_weights.x;
	cascade_normal_weights[1] = frag_interpolated.cascade_1234_normal_weights.y;
	cascade_normal_weights[2] = frag_interpolated.cascade_1234_normal_weights.z;
	cascade_normal_weights[3] = frag_interpolated.cascade_1234_normal_weights.w;
	let surface = getOceanSurfaceTangents(
		frag_interpolated.global_uv,
		cascade_normal_weights,
	);
	let normal = normalize(-cross(surface.tangent, surface.bitangent));
	let surface_normal = normalize(frag_interpolated.surface_normal);
	let tangent = normalize(-cross(vec3<f32>(0.0,0.0,1.0), surface_normal));
	let bitangent = normalize(-cross(surface_normal, tangent));
	let perturbed_normal = normal.x * tangent + normal.y * surface_normal + normal.z * bitangent;
	output.world_normal_with_surface_foam_strength_in_alpha = vec4<f32>(
		normalize(perturbed_normal),
		surface.foam_strength
	);
    return output;
}
`, ee = 4;
class it extends R {
  constructor(t) {
    const r = 12 + 4 * ee;
    super(
      t,
      r,
      "Wave Surface Displacement Patch World Half Extent UBO"
    );
    a(this, "data", {
      patch_world_half_extent: 50,
      b_gerstner: !0,
      b_displacement_map: !0,
      vertex_size: 1e3,
      gbuffer_extent: T.create(1, 1),
      foam_scale: 1,
      foam_bias: 0,
      padding0: S.create(0, 0, 0),
      procedural_wave_count: 12,
      cascades: [
        { patch_size_meters: 200 },
        { patch_size_meters: 50 },
        { patch_size_meters: 10 },
        { patch_size_meters: 0 }
      ]
    });
  }
  packed() {
    const t = new ArrayBuffer(this.buffer.size), r = new DataView(t), i = new Float32Array(t);
    r.setFloat32(0, this.data.patch_world_half_extent, !0), r.setUint32(4, this.data.b_gerstner ? 1 : 0, !0), r.setUint32(8, this.data.b_displacement_map ? 1 : 0, !0), r.setUint32(12, this.data.vertex_size, !0), i.set(this.data.gbuffer_extent, 4), r.setFloat32(24, this.data.foam_scale, !0), r.setFloat32(28, this.data.foam_bias, !0), i.set(this.data.padding0, 8), r.setUint32(44, this.data.procedural_wave_count, !0);
    const n = S.create(0, 0, 0);
    for (let o = 0; o < ee; o++) {
      const s = 12 + o * 4;
      i.set(n, s), r.setFloat32(
        (s + 3) * 4,
        this.data.cascades[o].patch_size_meters,
        !0
      );
    }
    return t;
  }
}
class nt {
  /**
   * Initializes all resources.
   * @param device - The WebGPU device to use.
   * @param globalUBO - The GlobalUBO instance that will be bound
   *  once and referenced in all recordings
   * @param formats - The formats of the gbuffer to use as color
   * 	attachments.
   * @param displacementMaps - 2D array textures
   *  that multiple cascades of ocean wave spectra.
   */
  constructor(e, t, r, i) {
    a(this, "oceanSurfaceRasterizationPipeline");
    /*
     * @group(0) @binding(0) var<uniform> u_settings: WaveSurfaceDisplacementUBO;
     * @group(0) @binding(1) var<uniform> u_global: GlobalUBO;
     */
    a(this, "group0");
    /*
     * @group(1) @binding(0) var displacement_map_sampler: sampler;
     * @group(1) @binding(1) var Dx_Dy_Dz_Dxdz_spatial: texture_2d<f32>;
     * @group(1) @binding(2) var Dydx_Dydz_Dxdx_Dzdz_spatial: texture_2d<f32>;
     * @group(1) @binding(3) var<uniform> u_waves: array<PlaneWave, WAVE_COUNT>;
     */
    a(this, "group1");
    /*
     * @group(2) @binding(0) var turbulence_jacobian: texture_2d_array<f32>;
     */
    a(this, "group2ByTurbulenceMapIndex");
    a(this, "settingsUBO");
    a(this, "baseIndexCount");
    a(this, "indices");
    this.baseIndexCount = 6279174, this.indices = e.createBuffer({
      size: 6279174 * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX,
      label: "Wave Surface Displacement Indices"
    });
    const _ = new Uint32Array(6279174);
    let m = 0;
    for (let D = 0; D < 1023; D++)
      for (let A = 0; A < 1023; A++) {
        const E = A + D * 1024, N = E + 1, L = E + 1024, oe = L + 1, W = new Uint32Array([
          E,
          L,
          N,
          N,
          L,
          oe
        ]);
        _.set(W, m), m += W.length;
      }
    e.queue.writeBuffer(this.indices, 0, _);
    const c = 12, v = 4, h = 4 * v, y = e.createBuffer({
      size: c * h,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
      label: "Wave Surface Displacement Waves"
    }), d = 9.8, g = 60, p = g * g * d / (2 * Math.PI), b = new Array(
      {
        direction: T.create(0.4, 2),
        amplitude: 0.25,
        wavelength: p / (12 * 12)
      },
      {
        direction: T.create(0.6, 2),
        amplitude: 0.3,
        wavelength: p / (14 * 14)
      },
      {
        direction: T.create(0.8, 2),
        amplitude: 0.35,
        wavelength: p / (12 * 12)
      },
      {
        direction: T.create(1, 2),
        amplitude: 0.4,
        wavelength: p / (16 * 16)
      },
      {
        direction: T.create(1.2, 2),
        amplitude: 0.45,
        wavelength: p / (12 * 12)
      },
      {
        direction: T.create(1.4, 2),
        amplitude: 0.4,
        wavelength: p / (14 * 14)
      },
      {
        direction: T.create(1.6, 2),
        amplitude: 0.35,
        wavelength: p / (12 * 12)
      },
      {
        direction: T.create(1.8, 2),
        amplitude: 0.3,
        wavelength: p / (16 * 16)
      },
      {
        direction: T.create(0.8, 1.5),
        amplitude: 0.02,
        wavelength: p / (30 * 30)
      },
      {
        direction: T.create(1.1, 1.5),
        amplitude: 0.02,
        wavelength: p / (30 * 30)
      },
      {
        direction: T.create(1.2, 1.5),
        amplitude: 0.02,
        wavelength: p / (30 * 30)
      },
      {
        direction: T.create(1.3, 1.5),
        amplitude: 0.02,
        wavelength: p / (30 * 30)
      }
    ), f = new Float32Array(c * v);
    let M = 0;
    b.forEach((D) => {
      f.set(D.direction, M), f[M + 2] = D.amplitude, f[M + 3] = D.wavelength, M += 4;
    }), e.queue.writeBuffer(y, 0, f), this.settingsUBO = new it(e), this.settingsUBO.data.vertex_size = 1024, this.settingsUBO.data.procedural_wave_count = b.length;
    const P = e.createBindGroupLayout({
      label: "Wave Surface Displacement Group 1 Compute (Displacement Map)",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          sampler: { type: "filtering" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float", viewDimension: "2d-array" }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float", viewDimension: "2d-array" }
        },
        {
          binding: 3,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "read-only-storage" }
        }
      ]
    });
    this.group1 = e.createBindGroup({
      label: "Wave Surface Displacement Group 1 Compute (Displacement Map)",
      layout: P,
      entries: [
        {
          binding: 0,
          resource: e.createSampler({
            label: "Wave Surface Displacement Group 1 Sampler",
            minFilter: "linear",
            magFilter: "linear",
            mipmapFilter: "linear",
            addressModeU: "repeat",
            addressModeV: "repeat",
            maxAnisotropy: 10
          })
        },
        {
          binding: 1,
          resource: i.Dx_Dy_Dz_Dxdz_SpatialAllMips
        },
        {
          binding: 2,
          resource: i.Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips
        },
        {
          binding: 3,
          resource: { buffer: y }
        }
      ]
    });
    const U = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float", viewDimension: "2d-array" }
        }
      ]
    });
    this.group2ByTurbulenceMapIndex = i.turbulenceJacobianOneMip.map((D, A) => e.createBindGroup({
      label: `Wave Surface Displacement Group 2 Compute (Turbulence) index ${A}`,
      layout: U,
      entries: [
        {
          binding: 0,
          resource: D
        }
      ]
    }));
    const B = e.createBindGroupLayout({
      entries: [
        {
          // settings
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" }
        },
        {
          // global UBO
          binding: 1,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" }
        }
      ],
      label: "Wave Surface Displacement Group 0"
    });
    this.group0 = e.createBindGroup({
      layout: B,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.settingsUBO.buffer
          }
        },
        {
          binding: 1,
          resource: {
            buffer: t.buffer
          }
        }
      ],
      label: "Wave Surface Displacement Group 0"
    });
    const q = e.createShaderModule({
      code: at,
      label: "Wave Surface Displacement"
    });
    this.oceanSurfaceRasterizationPipeline = e.createRenderPipeline({
      layout: e.createPipelineLayout({
        bindGroupLayouts: [B, P, U]
      }),
      vertex: {
        module: q,
        entryPoint: "screenSpaceWarped"
      },
      fragment: {
        module: q,
        entryPoint: "rasterizationFragment",
        targets: [
          {
            format: r.colorWithSurfaceWorldDepthInAlpha
          },
          {
            format: r.normalWithSurfaceFoamStrengthInAlpha
          }
        ]
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
        frontFace: "cw"
      },
      depthStencil: {
        format: r.depth,
        depthWriteEnabled: !0,
        depthCompare: "less"
      },
      label: "Wave Surface Displacement Surface Rasterization"
    });
  }
  /**
   * Fills the provided color/depth attachments with the generated ocean
   * surface.
   * @param device - The WebGPU device to use.
   * @param commandEncoder - The command encoder to record all passes into.
   * @param timestampInterval - The interval to record timing information
   *  into.
   * @param turbulenceMapIndex - The index into which of the already-bound
   *  turbulence maps to use for foam generation, if the option is enabled.
   * @param settings - The settings to use.
   * @param gbuffer - The gbuffer that will be filled with the rasterized
   *  ocean surface.
   */
  record(e, t, r, i, n, o) {
    this.settingsUBO.data.patch_world_half_extent = n.fft ? 100 : 300, this.settingsUBO.data.b_gerstner = n.gerstner, this.settingsUBO.data.b_displacement_map = n.fft, this.settingsUBO.data.foam_bias = n.foamBias, this.settingsUBO.data.gbuffer_extent = T.create(
      o.extent.width,
      o.extent.height
    ), this.settingsUBO.data.foam_scale = n.foamScale, this.settingsUBO.writeToGPU(e.queue);
    const s = t.beginRenderPass({
      label: "Wave Surface Rasterization",
      colorAttachments: [
        {
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear",
          storeOp: "store",
          view: o.colorWithSurfaceWorldDepthInAlphaView
        },
        {
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear",
          storeOp: "store",
          view: o.normalWithSurfaceFoamStrengthInAlphaView
        }
      ],
      depthStencilAttachment: {
        view: o.depthView,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store"
      },
      timestampWrites: r !== void 0 ? {
        querySet: r.querySet,
        beginningOfPassWriteIndex: r.beginWriteIndex,
        endOfPassWriteIndex: r.endWriteIndex
      } : void 0
    });
    s.setPipeline(
      this.oceanSurfaceRasterizationPipeline
    ), s.setBindGroup(0, this.group0), s.setBindGroup(1, this.group1), s.setBindGroup(
      2,
      this.group2ByTurbulenceMapIndex[i]
    ), s.setIndexBuffer(this.indices, "uint32"), s.drawIndexed(this.baseIndexCount, 1), s.end();
  }
}
const st = `@group(0) @binding(0) var b_texture: texture_2d<f32>;
@group(0) @binding(0) var b_texture_array: texture_2d_array<f32>;
@group(0) @binding(0) var b_texture_3d: texture_3d<f32>;
@group(0) @binding(1) var b_sampler: sampler;
struct FullscreenQuadUBO
{
    color_gain: vec4<f32>,
    vertex_scale: vec4<f32>,
	swap_ba_rg: u32,
	channel_mask: u32,
	depth_or_array_layer: f32,
	mip_level: u32,
}
@group(1) @binding(0) var<uniform> u_fullscreen_quad: FullscreenQuadUBO;
const QUAD_VERTICES: array<vec4<f32>, 4> = array<vec4<f32>,4>(
    vec4<f32>(-1.0, -1.0, 0.0, 1.0),
    vec4<f32>(1.0, -1.0, 0.0, 1.0),
    vec4<f32>(1.0, 1.0, 0.0, 1.0),
    vec4<f32>(-1.0, 1.0, 0.0, 1.0),
);
const QUAD_UVS: array<vec2<f32>,4> = array<vec2<f32>,4>(
    vec2<f32>(0.0, 1.0),
    vec2<f32>(1.0, 1.0),
    vec2<f32>(1.0, 0.0),
    vec2<f32>(0.0, 0.0),
);
struct VertexOut {
    @builtin(position) position : vec4<f32>,
    @location(0) uv : vec2<f32>
}
@vertex
fn vertexMain(@builtin(vertex_index) index : u32) -> VertexOut
{
    var output : VertexOut;
    output.position = u_fullscreen_quad.vertex_scale * QUAD_VERTICES[index];
    output.uv = QUAD_UVS[index];
    return output;
}
struct FragmentOut {
	@location(0) color: vec4<f32>
}
fn doFragment(rgba: vec4<f32>) -> FragmentOut
{
	var result: FragmentOut;
	result.color = rgba;
	if(u_fullscreen_quad.swap_ba_rg == 1)
	{
		result.color = result.color.barg;
	}
	result.color.r *= f32((u_fullscreen_quad.channel_mask & 1) > 0);
	result.color.g *= f32((u_fullscreen_quad.channel_mask & 2) > 0);
	result.color.b *= f32((u_fullscreen_quad.channel_mask & 4) > 0);
	result.color *= u_fullscreen_quad.color_gain;
	result.color.a = 1.0;
	return result;
}
@fragment
fn fragmentMain(frag_interpolated: VertexOut) -> FragmentOut
{
    return doFragment(
		textureSampleLevel(
			b_texture,
			b_sampler,
			frag_interpolated.uv,
			f32(u_fullscreen_quad.mip_level)
		)
	);
}
@fragment
fn fragmentMainArray(frag_interpolated: VertexOut) -> FragmentOut
{
	return doFragment(
		textureSampleLevel(
			b_texture_array,
			b_sampler,
			frag_interpolated.uv,
			u32(u_fullscreen_quad.depth_or_array_layer),
			f32(u_fullscreen_quad.mip_level)
		)
	);
}
@fragment
fn fragmentMain3D(frag_interpolated: VertexOut) -> FragmentOut
{
	let coord = vec3<f32>(frag_interpolated.uv, u_fullscreen_quad.depth_or_array_layer / f32(textureDimensions(b_texture_3d).z));
	return doFragment(
		textureSampleLevel(
			b_texture_3d,
			b_sampler,
			coord,
			f32(u_fullscreen_quad.mip_level)
		)
	);
}
`;
class ot {
  constructor() {
    a(this, "color_gain", z.create(1, 1, 1, 1));
    a(this, "vertex_scale", z.create(1, 1, 1, 1));
    a(this, "swap_ba_rg", !1);
    a(this, "channel_mask", 7);
    a(this, "depth_or_array_layer", 0);
    a(this, "mip_level_u32", 0);
  }
}
class ut extends R {
  constructor(t) {
    super(t, 12, "Fullscreen Quad UBO");
    a(this, "data", new ot());
  }
  packed() {
    const t = new ArrayBuffer(this.buffer.size), r = new DataView(t);
    return new Float32Array(t).set(this.data.color_gain, 0 / 4), new Float32Array(t).set(this.data.vertex_scale, 16 / 4), r.setUint32(32, this.data.swap_ba_rg ? 1 : 0, !0), r.setUint32(36, this.data.channel_mask, !0), r.setFloat32(40, this.data.depth_or_array_layer, !0), r.setUint32(44, this.data.mip_level_u32, !0), t;
  }
}
class lt {
  /**
   * Instantiates all resources.
   * @param device - The WebGPU device to use.
   * @param attachmentFormat - The texture format that will be used for the
   *  render pipelines attachments. This must match the format of the texture
   *  view used as the attachment at draw time.
   */
  constructor(e, t) {
    // keep layout for resetting textures when resizing them
    a(this, "group0Layout");
    a(this, "group0LayoutArray");
    a(this, "group0Layout3D");
    a(this, "group0ByOutputTexture");
    a(this, "group0Sampler");
    a(this, "ubo");
    a(this, "fullscreenQuadIndexBuffer");
    a(this, "group1");
    a(this, "pipeline");
    a(this, "pipelineArray");
    a(this, "pipeline3D");
    /**
     * The view format of the texture that will be passed to draw.
     * @see {@link record} for the function that takes in the view of this
     *  format.
     */
    a(this, "attachmentFormat");
    this.attachmentFormat = t;
    const r = new Uint32Array([0, 1, 2, 0, 2, 3]);
    this.fullscreenQuadIndexBuffer = e.createBuffer({
      size: r.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    }), e.queue.writeBuffer(
      this.fullscreenQuadIndexBuffer,
      0,
      r,
      0,
      r.length
    ), this.group0Layout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "unfilterable-float" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: "non-filtering" }
        }
      ],
      label: "Fullscreen Quad Group 0"
    }), this.group0LayoutArray = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {
            viewDimension: "2d-array",
            sampleType: "unfilterable-float"
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: "non-filtering" }
        }
      ],
      label: "Fullscreen Quad Group 0 Array"
    }), this.group0Layout3D = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {
            viewDimension: "3d",
            sampleType: "unfilterable-float"
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: "non-filtering" }
        }
      ],
      label: "Fullscreen Quad Group 0 3D"
    }), this.group0ByOutputTexture = /* @__PURE__ */ new Map(), this.group0Sampler = e.createSampler({
      magFilter: "nearest",
      minFilter: "nearest"
    }), this.ubo = new ut(e);
    const i = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
          buffer: { type: "uniform" }
        }
      ],
      label: "Fullscreen Quad Group 1"
    });
    this.group1 = e.createBindGroup({
      layout: i,
      entries: [
        {
          binding: 0,
          resource: { buffer: this.ubo.buffer }
        }
      ]
    });
    const n = e.createShaderModule({
      code: st,
      label: "Fullscreen Quad"
    });
    this.pipeline = e.createRenderPipeline({
      vertex: {
        module: n,
        entryPoint: "vertexMain"
      },
      fragment: {
        module: n,
        entryPoint: "fragmentMain",
        targets: [
          {
            format: this.attachmentFormat
          }
        ]
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "none",
        frontFace: "ccw"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.group0Layout, i]
      }),
      label: "Fullscreen Quad 2D"
    }), this.pipelineArray = e.createRenderPipeline({
      vertex: {
        module: n,
        entryPoint: "vertexMain"
      },
      fragment: {
        module: n,
        entryPoint: "fragmentMainArray",
        targets: [
          {
            format: this.attachmentFormat
          }
        ]
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "none",
        frontFace: "ccw"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.group0LayoutArray, i]
      }),
      label: "Fullscreen Quad 2D Array"
    }), this.pipeline3D = e.createRenderPipeline({
      vertex: {
        module: n,
        entryPoint: "vertexMain"
      },
      fragment: {
        module: n,
        entryPoint: "fragmentMain3D",
        targets: [
          {
            format: this.attachmentFormat
          }
        ]
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "none",
        frontFace: "ccw"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.group0Layout3D, i]
      }),
      label: "Fullscreen Quad 3D"
    });
  }
  /**
   * Generate and save bind groups for a given tag, so it can be read at
   * draw time.
   * @param device - The WebGPU device to use.
   * @param tag - The tag that can be passed
   * 	at draw time to use this texture for sampling.
   * @param texture - The texture to generate bindings
   * 	for.
   */
  setOutput(e, t, r) {
    let i = this.group0Layout;
    switch (r.viewDimension) {
      case "2d": {
        i = this.group0Layout;
        break;
      }
      case "2d-array": {
        i = this.group0LayoutArray;
        break;
      }
      case "3d": {
        i = this.group0Layout3D;
        break;
      }
      default:
        throw new RangeError(
          `Unsupported texture dimension '${r.viewDimension}'`
        );
    }
    this.group0ByOutputTexture.set(t, {
      texture: r,
      bindGroup: e.createBindGroup({
        layout: i,
        entries: [
          {
            binding: 0,
            resource: r.view
          },
          {
            binding: 1,
            resource: this.group0Sampler
          }
        ],
        label: `Fullscreen Quad Group 0 Texture '${r.view.label}'`
      })
    });
  }
  /**
   * Enumerates properties of bound textures by tag. Useful for reflecting in
   * UI without references to the underlying textures.
   * @returns Returns an iterable of all the properties and tag of each
   *  texture that is bound. Tag will be unique across all elements.
   */
  getAllTextureProperties() {
    return [...this.group0ByOutputTexture.entries()].map(
      ([e, { texture: t }]) => ({
        tag: e,
        mipLevelCount: t.mipLevelCount,
        depthOrArrayLayerCount: t.extent.depthOrArrayLayers
      })
    );
  }
  /**
   * Record the rendering of a fullscreen quad, sampling the texture that
   * has been bound to the requested tag.
   * @see {@link setOutput} for how to bind the texture that will used here.
   * @param device - The WebGPU device to use.
   * @param commandEncoder - The command encoder to record
   * 	into.
   * @param presentView - The texture view to use as the
   * 	output attachment.
   * @param tag - The tag selecting the bound
   * 	texture to use.
   * @param transform - The transformation to apply to
   * 	the sampled texture values in the fragment stage.
   * @param timestamps - The interval to record
   * 	timing information into.
   */
  record(e, t, r, i, n, o) {
    const s = { r: 0, g: 0, b: 0, a: 1 }, l = this.group0ByOutputTexture.get(i);
    if (l === void 0) {
      console.warn("FullscreenQuadPass: No texture to output.");
      return;
    }
    const _ = t.beginRenderPass({
      colorAttachments: [
        {
          clearValue: s,
          loadOp: "clear",
          storeOp: "store",
          view: r
        }
      ],
      timestampWrites: o !== void 0 ? {
        querySet: o.querySet,
        beginningOfPassWriteIndex: o.beginWriteIndex,
        endOfPassWriteIndex: o.endWriteIndex
      } : void 0,
      label: "Fullscreen Pass"
    });
    switch (this.ubo.data.color_gain = z.create(
      n.colorGain.r,
      n.colorGain.g,
      n.colorGain.b,
      1
    ), this.ubo.data.vertex_scale = z.create(
      1,
      n.flip ? -1 : 1,
      1,
      1
    ), this.ubo.data.mip_level_u32 = Math.round(n.mipLevel), this.ubo.data.depth_or_array_layer = n.arrayLayer, this.ubo.data.channel_mask = (n.channelMasks.r ? 1 : 0) + (n.channelMasks.g ? 2 : 0) + (n.channelMasks.b ? 4 : 0), this.ubo.data.swap_ba_rg = n.swapBARG, this.ubo.writeToGPU(e.queue), _.setIndexBuffer(
      this.fullscreenQuadIndexBuffer,
      "uint32",
      0,
      this.fullscreenQuadIndexBuffer.size
    ), _.setBindGroup(1, this.group1), l.texture.viewDimension) {
      case "2d": {
        _.setPipeline(this.pipeline);
        break;
      }
      case "2d-array": {
        _.setPipeline(this.pipelineArray);
        break;
      }
      case "3d": {
        _.setPipeline(this.pipeline3D);
        break;
      }
      default:
        throw new Error(
          `Unsupported texture dimension '${l.texture.viewDimension}'`
        );
    }
    _.setBindGroup(0, l.bindGroup), _.drawIndexed(6, 1, 0, 0, 0), _.end();
  }
}
const I = [
  "SkyviewLUT",
  "AerialPerspectiveLUT",
  "FFTWaves",
  "OceanSurface",
  "AtmosphereCamera",
  "FullscreenQuad"
], te = ["DrawToDraw", ...I];
class re {
  constructor(e) {
    a(this, "values");
    a(this, "sum", 0);
    a(this, "average_", 0);
    /*
     * Count how many values are valid. Starts at zero, goes to values.length,
     * and stays there. Necessary to keep runningSum valid before the buffer can
     * be filled once.
     */
    a(this, "count", 0);
    /*
     * Index into values of next value to write
     */
    a(this, "index", 0);
    this.values = new Array(e).fill(0);
  }
  /**
   * Returns the average of stored values.
   * @readonly
   */
  get average() {
    return this.average_;
  }
  /**
   * Pushes a new value into the buffer, dropping the oldest if there is more
   * than the buffer can fit.
   * @param value - The new value.
   */
  push(e) {
    this.index >= this.values.length && (this.index = 0), this.index < this.count && (this.sum -= this.values[this.index]), this.values[this.index] = e, this.sum += e, this.count = Math.min(this.values.length, this.count + 1), this.average_ = this.sum / this.count, this.index += 1;
  }
}
class _t {
  constructor(e) {
    // Defined only when timestamp querying is supported
    a(this, "queryBuffers");
    a(this, "frametimeAverages");
    a(this, "timestampIndexMapping", /* @__PURE__ */ new Map());
    a(this, "timestampQueryIndex", 0);
    a(this, "uiDisplay");
    a(this, "initialized");
    if (this.frametimeAverages = /* @__PURE__ */ new Map([
      ["DrawToDraw", new re(400)]
    ]), this.uiDisplay = {
      averageFPS: 0,
      frametimeControllers: /* @__PURE__ */ new Map()
    }, !e.features.has("timestamp-query")) {
      console.warn(
        "WebGPU feature 'timestamp-query' is not supported. Continuing, but without performance information about specific stages."
      ), this.initialized = !0;
      return;
    }
    const r = 8, i = 2 * I.length;
    this.queryBuffers = {
      querySet: e.createQuerySet({
        type: "timestamp",
        count: i
      }),
      writeBuffer: e.createBuffer({
        size: r * i,
        usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.QUERY_RESOLVE
      }),
      readBuffer: e.createBuffer({
        size: r * i,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
      })
    }, I.forEach((n) => {
      this.frametimeAverages.set(
        n,
        new re(400)
      );
    }), this.initialized = !0;
  }
  get averageFPS() {
    return this.uiDisplay.averageFPS;
  }
  destroy() {
    var e, t, r;
    (e = this.queryBuffers) == null || e.querySet.destroy(), (t = this.queryBuffers) == null || t.writeBuffer.destroy(), (r = this.queryBuffers) == null || r.readBuffer.destroy(), this.initialized = !1;
  }
  /**
   * Bind the frametime values and averageFPS to the passed UI, under a single
   * top-level folder.
   * @param gui - The GUI to bind to
   */
  setupUI(e) {
    const t = e.addFolder("Performance").close();
    t.add(this.uiDisplay, "averageFPS").decimals(1).disable().name("Average FPS").listen(), te.forEach((r) => {
      this.uiDisplay.frametimeControllers.set(
        r,
        t.add({ value: 0 }, "value").name(`${r} (ms)`).decimals(6).disable()
      );
    });
  }
  /**
   * Begin each frame by calling this before any other methods. This also
   * records the host's frame-to-frame time.
   * @param deltaTimeMilliseconds - The time since last frame, to be
   *  recorded for displaying the overall average FPS.
   */
  beginFrame(e) {
    var t;
    (t = this.frametimeAverages.get("DrawToDraw")) == null || t.push(e), this.timestampQueryIndex = 0, this.timestampIndexMapping.clear();
  }
  /**
   * Call this before recording each interval of GPU work you wish to time. If
   * timestamp querying is supported, this will return a query set and two
   * indices that should be passed to the WebGPU api when starting
   * render/compute passes. If the interval of work you wish to time spans
   * multiple passes, pass the begin index as the start of the first pass and
   * the end index as the end of the last pass.
   * @see {@link GPUComputePassTimestampWrites} or
   *  {@link GPURenderPassTimestampWrites} for how the returned value needs to
   *  be consumed by WebGPU.
   * @param category - The category that the GPU timestamps will be recorded
   *  under. Calling this twice for the same category will overwrite the old
   *  timestamps, and may lead to an overflow of the memory of the query set
   *  causing a crash in the WebGPU instance.
   * @returns Returns the device query set and indices that should be written
   *  into, or `undefined` if querying is not supported.
   */
  queueTimestampInterval(e) {
    if (this.queryBuffers === void 0)
      return;
    this.timestampIndexMapping.set(e, this.timestampQueryIndex);
    const t = this.timestampQueryIndex, r = t + 1;
    return this.timestampQueryIndex += 2, {
      querySet: this.queryBuffers.querySet,
      beginWriteIndex: t,
      endWriteIndex: r
    };
  }
  /**
   * Call this once all timed commands have been recorded. The encoder's
   * current recording point needs to be logically after all work being timed
   * so that there is no race-condition on the copied timestamps. This usually
   * means just putting all the work for each `PerformanceTracker` on the same
   * encoder.
   * @param commandEncoder - The command encoder to record
   * 	into.
   */
  preSubmitCommands(e) {
    this.queryBuffers == null || this.queryBuffers.readBuffer.mapState !== "unmapped" || (e.resolveQuerySet(
      this.queryBuffers.querySet,
      0,
      this.timestampQueryIndex,
      this.queryBuffers.writeBuffer,
      0
    ), e.copyBufferToBuffer(
      this.queryBuffers.writeBuffer,
      0,
      this.queryBuffers.readBuffer,
      0,
      this.queryBuffers.readBuffer.size
    ));
  }
  /**
   * Call this after executing all command buffers with commands that touch
   * the timing data that will be read by `PerformanceTracker`. This copies
   * all the timing and updates the bound UI.
   */
  postSubmitCommands() {
    var t;
    if (this.uiDisplay.averageFPS = 1e3 / (((t = this.frametimeAverages.get("DrawToDraw")) == null ? void 0 : t.average) ?? 1e3), this.queryBuffers == null || this.queryBuffers.readBuffer.mapState !== "unmapped")
      return;
    const e = this.queryBuffers.readBuffer;
    e.mapAsync(GPUMapMode.READ, 0, e.size).then(() => {
      const r = new BigInt64Array(
        e.getMappedRange(0, e.size)
      );
      this.timestampIndexMapping.forEach((i, n) => {
        var l;
        const s = Number(
          r.at(i + 1) - r.at(i)
        ) / 1e6;
        (l = this.frametimeAverages.get(n)) == null || l.push(s);
      }), te.forEach((i) => {
        var o, s;
        const n = (o = this.frametimeAverages.get(i)) == null ? void 0 : o.average;
        n !== void 0 && ((s = this.uiDisplay.frametimeControllers.get(i)) == null || s.setValue(n));
      }), e.unmap();
    }).catch((r) => {
      this.initialized && console.error(
        new Error(
          "Failed while retrieving frametime values from GPU:",
          { cause: r }
        )
      );
    });
  }
}
const ct = { width: 2048, height: 1024 }, mt = { width: 1024, height: 1024 }, dt = { width: 1024, height: 512 }, pt = {
  width: 32,
  height: 32,
  depthOrArrayLayers: 32
}, se = [0.25, 0.3333, 0.5, 0.75, 1, 1.5, 2, 4], O = /* @__PURE__ */ new Map([
  [
    "bad",
    {
      renderScale: 0.5,
      fftGridSizeLog2: 5,
      // 32
      oceanSurfaceVertexSize: 128
    }
  ],
  [
    "good",
    {
      renderScale: 1,
      fftGridSizeLog2: 9,
      // 512
      oceanSurfaceVertexSize: 1024
    }
  ]
]);
function ft(u, e, t) {
  u.add(e, "renderScale", se).name("Render Resolution Scale").decimals(1).onFinishChange((_) => {
    t();
  }).listen();
  const r = u.addFolder("Camera").open();
  r.add(e.oceanCamera, "translationX").name("Camera X").min(-100).max(100), r.add(e.oceanCamera, "translationY").name("Camera Y").min(10).max(2e3), r.add(e.oceanCamera, "translationZ").name("Camera Z").min(-100).max(100);
  const i = 0.01;
  r.add(e.oceanCamera, "eulerAnglesX").name("Camera Pitch").min(-Math.PI / 2 + i).max(Math.PI / 2 - i), r.add(e.oceanCamera, "eulerAnglesY").name("Camera Yaw").min(-Math.PI).max(Math.PI);
  const n = u.addFolder("Sun").open();
  n.add(e.orbit, "timeHours").min(0).max(24).name("Time in Hours").listen(), n.add(e.orbit, "timeSpeedupFactor").min(1).max(5e4).step(1).name("Time Multiplier"), n.add(e.orbit, "paused").name("Pause Sun"), n.add(
    {
      fn: () => {
        e.orbit.timeHours = e.orbit.reversed ? 18 + 0.5 : 6 - 0.5;
      }
    },
    "fn"
  ).name("Skip to Sunrise"), n.add(
    {
      fn: () => {
        e.orbit.timeHours = e.orbit.reversed ? 6 + 0.5 : 18 - 0.5;
      }
    },
    "fn"
  ).name("Skip to Sunset"), n.add(e.orbit, "reversed").name("Reverse Sun"), n.add(e.orbit, "sunsetAzimuthRadians").name("Sun Azimuth").min(0).max(2 * Math.PI), n.add(e.orbit, "inclinationRadians").name("Sun Inclination").min(0).max(Math.PI);
  const o = u.addFolder("Ocean").close();
  o.add(e.oceanSurfaceSettings, "gerstner").name("Gerstner Waves"), o.add(e.oceanSurfaceSettings, "fft").name("FFT Accelerated Waves"), o.add(e.time, "pause").name("Pause Waves"), o.add(e.oceanSurfaceSettings, "foamScale").name("Foam Scale").min(-30).max(30), o.add(e.oceanSurfaceSettings, "foamBias").name("Foam Bias").min(-1).max(1), o.add(e.fourierWavesSettings, "gravity").name("Gravity (m / s^2)").min(0.01).max(20), o.add(e.fourierWavesSettings, "waveSwell").name("Wave Swell").min(0.01).max(1), o.add(e.fourierWavesSettings, "windFetchMeters").name("Wind Fetch (m)").min(10 * 1e3).max(100 * 1e3), o.add(e.fourierWavesSettings, "windSpeedMetersPerSeconds").name("Wind Speed (m/s)").min(0.01).max(50);
  const s = u.addFolder("Debug").close(), l = [];
  s.add(e, "renderFromOceanPOV").name("Render from Ocean POV").onFinishChange((_) => {
    l.forEach((m) => {
      m.enable(!_);
    });
  }), l.push(
    s.add(e.debugCamera, "translationX").name("Camera X").min(-5e3).max(5e3),
    s.add(e.debugCamera, "translationY").name("Camera Y").min(10).max(5e3),
    s.add(e.debugCamera, "translationZ").name("Camera Z").min(-5e3).max(5e3),
    s.add(e.debugCamera, "eulerAnglesX").name("Camera Pitch").min(-Math.PI / 2 + i).max(Math.PI / 2 - i),
    s.add(e.debugCamera, "eulerAnglesY").name("Camera Yaw").min(-Math.PI).max(Math.PI),
    /* Non-zero camera roll breaks certain horizon calculations in shaders
    debugFolder
    	.add(this.settings.cameraSettings.debugCamera, "eulerAnglesZ")
    	.name("Camera Roll")
    	.min(-Math.PI)
    	.max(Math.PI),
    */
    s.add(
      {
        fn: () => {
          Object.assign(
            e.debugCamera,
            structuredClone(e.oceanCamera)
          ), s.controllers.forEach((_) => {
            _.updateDisplay();
          });
        }
      },
      "fn"
    ).name("Reset to match main camera")
  ), l.forEach((_) => _.enable(!1));
}
function ae(u, e, t) {
  const r = new ne(u, { width: 1, height: 1 }), i = new Te(u);
  i.writeToGPU(u.queue);
  const n = new ze(
    u,
    ct,
    i
  ), o = u.features.has("float32-filterable"), s = new Pe(
    u,
    mt,
    n.view,
    o,
    i
  ), l = new Re(
    u,
    dt,
    n.view,
    s.view,
    o,
    i
  ), _ = new Ce(
    u,
    pt,
    n.view,
    s.view,
    o,
    i
  ), m = new rt(
    u,
    i,
    e.fftGridSizeLog2
  ), c = m.views(), v = new nt(
    u,
    i,
    r.formats,
    m.displacementMaps()
  ), h = new Ee(
    u,
    r.readGroupLayout,
    n.view,
    s.view,
    l.view,
    _.view,
    o,
    i
  ), y = new lt(
    u,
    t
  ), d = r.colorRenderables();
  [
    [
      "Scene",
      new w(
        h.outputColor
      )
    ],
    [
      "GBufferColor",
      d.colorWithSurfaceWorldDepthInAlpha
    ],
    [
      "GBufferNormal",
      d.normalWithSurfaceFoamStrengthInAlpha
    ],
    [
      "AtmosphereTransmittanceLUT",
      new w(n.texture)
    ],
    [
      "AtmosphereMultiscatterLUT",
      new w(s.texture)
    ],
    [
      "AtmosphereSkyviewLUT",
      new w(l.texture)
    ],
    [
      "AtmosphereAerialPerspectiveLUT",
      new w(
        _.texture
      )
    ],
    ["FFTWaveSpectrumGaussianNoise", c.gaussianNoise],
    ["FFTWaveInitialAmplitude", c.initialAmplitude],
    [
      "FFTWaveDx_plus_iDy_Dz_iDxdz_Amplitude",
      c.packed_Dx_plus_iDy_Dz_iDxdz_Amplitude
    ],
    [
      "FFTWaveDydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude",
      c.packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude
    ],
    ["FFTWaveTurbulenceJacobian", c.turbulenceJacobian],
    [
      "FFTWaveDx_Dy_Dz_Dxdz_Spatial",
      c.Dx_Dy_Dz_Dxdz_Spatial
    ],
    [
      "FFTWaveDydx_Dydz_Dxdx_Dzdz_Spatial",
      c.Dydx_Dydz_Dxdx_Dzdz_Spatial
    ]
  ].forEach(([p, b]) => {
    y.setOutput(u, p, b);
  });
  const g = u.createCommandEncoder({
    label: "Atmosphere LUT Initialization"
  });
  return n.record(g), s.record(g), u.queue.submit([g.finish()]), {
    aerialPerspectiveLUTPassResources: _,
    atmosphereCameraPassResources: h,
    fftWaveSpectrumResources: m,
    fullscreenQuadPassResources: y,
    gbuffer: r,
    globalUBO: i,
    multiscatterLUTPassResources: s,
    skyviewLUTPassResources: l,
    transmittanceLUTPassResources: n,
    waveSurfaceDisplacementPassResources: v
  };
}
function ie(u) {
  switch (u) {
    case "bgra8unorm":
      return "bgra8unorm-srgb";
    case "rgba8unorm":
      return "rgba8unorm-srgb";
    default:
      return console.warn(
        `Using unsupported canvas format "${u}", color encoding will be off.`
      ), u;
  }
}
function ht(u, e, t, r) {
  e.data.time.deltaTimeSeconds = t.time.deltaTimeSeconds, e.data.time.timeSeconds = t.time.timeSeconds;
  const i = 2 * Math.PI / 24, n = (12 - t.orbit.timeHours) * i, o = S.create(
    -Math.sin(t.orbit.sunsetAzimuthRadians),
    0,
    Math.cos(t.orbit.sunsetAzimuthRadians)
  ), s = S.create(
    Math.cos(t.orbit.sunsetAzimuthRadians) * Math.cos(t.orbit.inclinationRadians),
    Math.sin(t.orbit.inclinationRadians),
    Math.sin(t.orbit.sunsetAzimuthRadians) * Math.cos(t.orbit.inclinationRadians)
  ), l = S.add(
    S.scale(o, Math.sin(n)),
    S.scale(s, Math.cos(n))
  );
  S.scale(l, -1, e.data.light.forward);
  const _ = 60 * Math.PI / 180, v = x.perspective(_, r, 0.1, 1e3), h = (y, d) => {
    const g = [
      d.translationX,
      d.translationY,
      d.translationZ,
      1
    ], p = x.rotationX(d.eulerAnglesX), b = x.rotationY(d.eulerAnglesY), f = x.rotationZ(d.eulerAnglesZ), M = x.mul(
      x.translation(z.create(...g)),
      x.mul(b, x.mul(p, f))
    ), P = x.inverse(M);
    Object.assign(y, {
      invProj: x.inverse(v),
      invView: M,
      projView: x.mul(v, P),
      position: z.create(...g),
      forward: z.create(
        ...x.multiply(M, z.create(0, 0, -1, 0))
      )
    });
  };
  h(e.data.ocean_camera, t.oceanCamera), h(
    e.data.camera,
    t.renderFromOceanPOV ? t.oceanCamera : t.debugCamera
  ), e.writeToGPU(u);
}
class gt {
  constructor(e, t) {
    a(this, "resources");
    a(this, "unscaledResolution");
    a(this, "renderOutputController");
    a(this, "parameters");
    a(this, "performance");
    a(this, "performanceConfig");
    a(this, "device");
    a(this, "quit", !1);
    a(this, "dummyFrameCounter");
    a(this, "canvasTextureFormat");
    this.device = e, this.canvasTextureFormat = t, this.performanceConfig = O.get("good"), this.renderOutputController = new Ie(), this.parameters = {
      oceanSurfaceSettings: {
        gerstner: !0,
        fft: !0,
        foamScale: 15,
        foamBias: 0.25
      },
      renderFromOceanPOV: !0,
      oceanCamera: {
        translationX: 0,
        translationY: 20,
        translationZ: 0,
        eulerAnglesX: -0.2,
        eulerAnglesY: 0,
        eulerAnglesZ: 0
      },
      debugCamera: {
        translationX: 0,
        translationY: 40,
        translationZ: -20,
        eulerAnglesX: -0.4,
        eulerAnglesY: 0,
        eulerAnglesZ: 0
      },
      fourierWavesSettings: {
        gravity: 9.8,
        windSpeedMetersPerSeconds: 15,
        windFetchMeters: 40 * 1e3,
        waveSwell: 0.3
      },
      time: {
        pause: !1,
        timeSeconds: 0,
        deltaTimeSeconds: 0
      },
      orbit: {
        timeHours: 5.6,
        timeSpeedupFactor: 200,
        paused: !1,
        reversed: !1,
        inclinationRadians: Math.PI / 2,
        sunsetAzimuthRadians: Math.PI
      },
      renderScale: 1
    }, this.resources = ae(
      this.device,
      this.performanceConfig,
      ie(t)
    );
    for (const r of this.resources.fullscreenQuadPassResources.getAllTextureProperties())
      this.renderOutputController.setTextureProperties(r);
    this.unscaledResolution = { width: 128, height: 128 }, this.performance = new _t(this.device), this.dummyFrameCounter = 10;
  }
  destroy() {
    this.performance.destroy(), this.device.destroy();
  }
  presentationInterface() {
    return {
      device: this.device,
      format: this.canvasTextureFormat,
      viewFormats: [
        this.resources.fullscreenQuadPassResources.attachmentFormat
      ]
    };
  }
  setupUI(e) {
    ft(e, this.parameters, () => {
      this.updateResizableResources();
    }), this.renderOutputController.setupUI(e), this.performance.setupUI(e);
  }
  setPerformanceConfig(e) {
    const t = O.get(e) ?? O.get("bad");
    if (t.fftGridSizeLog2 !== this.performanceConfig.fftGridSizeLog2 || t.oceanSurfaceVertexSize !== this.performanceConfig.oceanSurfaceVertexSize || t.renderScale !== this.performanceConfig.renderScale) {
      this.performanceConfig = t, this.resources = ae(
        this.device,
        this.performanceConfig,
        ie(this.canvasTextureFormat)
      ), this.parameters.renderScale = this.performanceConfig.renderScale, this.updateResizableResources();
      for (const i of this.resources.fullscreenQuadPassResources.getAllTextureProperties())
        this.renderOutputController.setTextureProperties(i);
    }
  }
  setLowPerformanceMode(e) {
    const t = e ? "bad" : "good";
    this.setPerformanceConfig(t);
  }
  tickTime(e) {
    const i = this.parameters.oceanSurfaceSettings.fft ? 100 : 60, n = this.parameters.time;
    n.pause ? n.deltaTimeSeconds = 0 : (n.deltaTimeSeconds = e / 1e3, n.timeSeconds += n.deltaTimeSeconds), n.timeSeconds -= Math.floor(n.timeSeconds / i) * i;
    const o = this.parameters.orbit;
    o.paused || (o.timeHours += (o.reversed ? -1 : 1) * o.timeSpeedupFactor * e / 36e5, o.timeHours = o.timeHours - Math.floor(o.timeHours / 24) * 24);
  }
  draw(e, t, r, i) {
    if (this.resources === void 0)
      return;
    if (this.dummyFrameCounter > 0) {
      this.dummyFrameCounter -= 1;
      return;
    }
    const n = e.createView({
      format: "bgra8unorm-srgb"
    });
    this.performance.beginFrame(i), this.tickTime(i), ht(
      this.device.queue,
      this.resources.globalUBO,
      this.parameters,
      t
    );
    const o = this.device.createCommandEncoder({
      label: "Main"
    });
    this.resources.fftWaveSpectrumResources.record(
      this.device,
      o,
      this.parameters.fourierWavesSettings,
      this.performance.queueTimestampInterval("FFTWaves")
    ), this.resources.waveSurfaceDisplacementPassResources.record(
      this.device,
      o,
      this.performance.queueTimestampInterval("OceanSurface"),
      this.resources.fftWaveSpectrumResources.turbulenceMapIndex,
      {
        gerstner: this.parameters.oceanSurfaceSettings.gerstner,
        fft: this.parameters.oceanSurfaceSettings.fft,
        foamBias: this.parameters.oceanSurfaceSettings.foamBias,
        foamScale: this.parameters.oceanSurfaceSettings.foamScale
      },
      this.resources.gbuffer
    ), this.resources.skyviewLUTPassResources.record(
      o,
      this.performance.queueTimestampInterval("SkyviewLUT")
    ), this.resources.aerialPerspectiveLUTPassResources.record(
      o,
      this.performance.queueTimestampInterval("AerialPerspectiveLUT")
    ), this.resources.atmosphereCameraPassResources.record(
      o,
      this.performance.queueTimestampInterval("AtmosphereCamera"),
      this.resources.gbuffer
    );
    const s = this.renderOutputController.current();
    this.resources.fullscreenQuadPassResources.record(
      this.device,
      o,
      n,
      s.tag,
      s.transform,
      this.performance.queueTimestampInterval("FullscreenQuad")
    ), this.performance.preSubmitCommands(o), this.device.queue.submit([o.finish()]), this.performance.postSubmitCommands();
  }
  updateResizableResources() {
    if (this.resources === void 0)
      return;
    const e = (s) => ({
      width: Math.floor(this.unscaledResolution.width * s),
      height: Math.floor(
        this.unscaledResolution.height * s
      )
    }), t = (s) => s.width < 8192 && s.height < 8192 && s.width * s.height * 16 < 268435456;
    let r = this.parameters.renderScale;
    const i = e(r);
    t(i) || (se.slice().reverse().some((s) => {
      if (t(e(s)))
        return r = s, !0;
    }), console.warn(
      `During resize: Texture size (${i.width},${i.height}) exceeds WebGPU guaranteed limit (8192, 8192).
					Defaulting to highest possible render scale of ${r}`
    )), this.parameters.renderScale = r;
    const n = e(this.parameters.renderScale);
    console.log(
      `Resizing to (${n.width},${n.height})`
    ), this.resources.gbuffer = new ne(
      this.device,
      n,
      this.resources.gbuffer
    );
    const o = this.resources.gbuffer.colorRenderables();
    this.resources.fullscreenQuadPassResources.setOutput(
      this.device,
      "GBufferColor",
      o.colorWithSurfaceWorldDepthInAlpha
    ), this.resources.fullscreenQuadPassResources.setOutput(
      this.device,
      "GBufferNormal",
      o.normalWithSurfaceFoamStrengthInAlpha
    ), this.resources.atmosphereCameraPassResources.resize(
      n,
      this.device,
      this.resources.transmittanceLUTPassResources.view,
      this.resources.multiscatterLUTPassResources.view,
      this.resources.skyviewLUTPassResources.view,
      this.resources.aerialPerspectiveLUTPassResources.view
    ), this.resources.fullscreenQuadPassResources.setOutput(
      this.device,
      "Scene",
      new w(
        this.resources.atmosphereCameraPassResources.outputColor
      )
    );
    for (const s of this.resources.fullscreenQuadPassResources.getAllTextureProperties())
      this.renderOutputController.setTextureProperties(s);
  }
  handleResize(e, t) {
    this.unscaledResolution.width === e && this.unscaledResolution.height === t || (this.unscaledResolution.width = e, this.unscaledResolution.height = t, this.updateResizableResources());
  }
}
const xt = (u, e) => new gt(u, e);
export {
  xt as SkySeaAppConstructor
};
