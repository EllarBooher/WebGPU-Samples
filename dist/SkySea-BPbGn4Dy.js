import { v as M, m as y, a as b, b as S } from "./wgpu-matrix.module-aHNSNER6.js";
const oe = 4;
class A {
  /**
   * The device buffer that is uploaded to.
   */
  buffer;
  /**
   * Allocates the backing buffer with a given size.
   * @param device - The WebGPU device to use.
   * @param lengthFloat32 - The length of the buffer in 32-bit
   *  (4-byte) floats.
   * @param label - A label for debugging purposes, used by WebGPU.
   */
  constructor(e, t, r) {
    this.buffer = e.createBuffer({
      size: t * oe,
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
    ), e.writeBuffer(
      this.buffer,
      0,
      t.buffer,
      t.byteOffset,
      t.byteLength
    );
  }
}
function ue() {
  return {
    rayleighMm: {
      scattering: b.create(5.802, 13.558, 33.1),
      absorption: b.create(0, 0, 0),
      densityScale: 8e-3
    },
    mieMm: {
      scattering: b.create(3.996, 3.996, 3.996),
      absorption: b.create(4.4, 4.4, 4.4),
      densityScale: 12e-4
    },
    ozoneMm: {
      scattering: b.create(0, 0, 0),
      absorption: b.create(0.65, 1.881, 0.085)
    },
    planetRadiusMm: 6.36,
    atmosphereRadiusMm: 6.42,
    // Unitless albedo
    // Values are arbitrary
    groundAlbedo: b.create(0.3 * 1, 0.3 * 0.75, 0.3 * 0.4)
  };
}
function le() {
  return {
    color: b.create(1, 1, 1),
    strength: 10,
    forward: b.create(0, -1, 0),
    angularRadius: 16 / 60 * (3.141592653589793 / 180)
  };
}
const _e = 16, ce = 128, de = 16, me = 32, pe = 16, W = 256, fe = 16, he = 16;
function ge(o, e) {
  return Math.ceil(e / o) * o;
}
const ve = Math.max(
  _e,
  de,
  pe,
  fe
), ye = ge(
  ve,
  W + W + ce + me + he
);
class xe extends A {
  /**
   * The data that will be packed and laid out in proper byte order in
   * {@link packed}, to be written to the GPU.
   */
  data = {
    atmosphere: ue(),
    light: le(),
    camera: {
      invProj: y.identity(),
      invView: y.identity(),
      projView: y.identity(),
      position: M.create(0, 0, 0, 1),
      forward: M.create(0, 0, -1, 0)
    },
    ocean_camera: {
      invProj: y.identity(),
      invView: y.identity(),
      projView: y.identity(),
      position: M.create(0, 0, 0, 1),
      forward: M.create(0, 0, -1, 0)
    },
    time: {
      timeSeconds: 0,
      deltaTimeSeconds: 0
    }
  };
  constructor(e) {
    super(e, ye / 4, "Global UBO");
  }
  packed() {
    const e = new Float32Array(2).fill(0), t = new Float32Array(4).fill(0), r = new Float32Array(8).fill(0), a = this.data.atmosphere, i = a.rayleighMm, s = a.mieMm, n = new Float32Array([
      ...i.scattering,
      i.densityScale,
      ...i.absorption,
      a.planetRadiusMm,
      ...s.scattering,
      s.densityScale,
      ...s.absorption,
      a.atmosphereRadiusMm,
      ...a.groundAlbedo,
      0,
      ...a.ozoneMm.scattering,
      0,
      ...a.ozoneMm.absorption,
      0,
      ...t
    ]), u = this.data.light, l = new Float32Array([
      ...u.color,
      u.strength,
      ...u.forward,
      u.angularRadius
    ]), _ = this.data.camera, c = new Float32Array([
      ..._.invProj,
      ..._.invView,
      ..._.projView,
      ..._.position,
      ..._.forward,
      ...r
    ]), d = this.data.ocean_camera, v = new Float32Array([
      ...d.invProj,
      ...d.invView,
      ...d.projView,
      ...d.position,
      ...d.forward,
      ...r
    ]), g = this.data.time, m = new Float32Array([
      ...e,
      g.timeSeconds,
      g.deltaTimeSeconds
    ]);
    return new Float32Array([
      ...c,
      ...v,
      ...n,
      ...l,
      ...m
    ]);
  }
}
const be = `struct Atmosphere
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
`, Se = "rgba32float";
class Te {
  /**
   * The transmittance lookup table texture.
   */
  texture;
  /**
   * The view into {@link texture}.
   */
  view;
  /*
   * @group(0) @binding(0) var transmittance_lut: texture_storage_2d<rgba32float, write>;
   *
   * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
   */
  pipeline;
  group0;
  group1;
  /**
   * Initializes all resources related to the transmittance lookup table.
   * @param device - The WebGPU device to use.
   * @param dimensions - The dimensions to use for the LUT texture.
   * @param globalUBO - The global UBO to bind and use when
   * 	rendering the LUT.
   */
  constructor(e, t, r) {
    this.texture = e.createTexture({
      size: t,
      dimension: "2d",
      format: Se,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Transmittance LUT"
    }), this.view = this.texture.createView({ label: "Transmittance LUT" });
    const a = e.createBindGroupLayout({
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
    }), i = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {}
        }
      ],
      label: "Transmittance LUT Group 1"
    }), s = e.createShaderModule({
      code: be,
      label: "Transmittance LUT"
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: s,
        entryPoint: "computeTransmittance"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [a, i]
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
`, k = "rgba32float";
class Me {
  /**
   * The multiscatter lookup table texture.
   */
  texture;
  /**
   * The view into {@link texture}.
   */
  view;
  /*
   * @group(0) @binding(0) var multiscatter_lut: texture_storage_2d<rgba32float, write>;
   * @group(0) @binding(1) var lut_sampler: sampler;
   * @group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
   *
   * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
   */
  pipeline;
  group0;
  group1;
  /**
   * Initializes all resources related to the multiscatter lookup table.
   * @param device - The WebGPU device to use.
   * @param dimensions - The dimensions of the LUT texture.
   * @param transmittanceLUT - The transmittance LUT to bind and read from.
   * @param filterableLUT - Whether or not the LUTs are filterable.
   * @param globalUBO - The global UBO to bind and read from.
   */
  constructor(e, t, r, a, i) {
    const s = "Multiscatter LUT";
    this.texture = e.createTexture({
      size: t,
      dimension: "2d",
      format: k,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Multiscatter LUT"
    }), this.view = this.texture.createView({ label: s });
    const n = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            access: "write-only",
            format: k
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          sampler: {
            type: a ? "filtering" : "non-filtering"
          }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: a ? "float" : "unfilterable-float"
          }
        }
      ],
      label: "Multiscatter LUT Group 0"
    });
    this.group0 = e.createBindGroup({
      layout: n,
      entries: [
        {
          binding: 0,
          resource: this.view
        },
        {
          binding: 1,
          resource: e.createSampler({
            magFilter: a ? "linear" : "nearest",
            minFilter: a ? "linear" : "nearest"
          })
        },
        {
          binding: 2,
          resource: r
        }
      ],
      label: "Multiscatter LUT Group 0"
    });
    const u = e.createBindGroupLayout({
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
      layout: u,
      entries: [
        {
          binding: 0,
          resource: { buffer: i.buffer }
        }
      ],
      label: "Multiscatter LUT Group 1"
    });
    const l = e.createShaderModule({
      code: we,
      label: s
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: l,
        entryPoint: "computeMultiscattering"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [n, u]
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
const ze = `struct Atmosphere
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
`, V = "rgba32float";
class De {
  texture;
  view;
  /*
  	@group(0) @binding(0) var skyview_lut: texture_storage_2d<rgba32float, write>;
  	@group(0) @binding(1) var lut_sampler: sampler;
  	@group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
  	@group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
  
  	@group(1) @binding(0) var<uniform> u_global: GlobalUBO;
  	*/
  group0;
  group1;
  pipeline;
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
  constructor(e, t, r, a, i, s) {
    this.texture = e.createTexture({
      size: t,
      dimension: "2d",
      format: V,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Skyview LUT"
    }), this.view = this.texture.createView({ label: "Skyview LUT" });
    const n = e.createBindGroupLayout({
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
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: i ? "float" : "unfilterable-float"
          }
        }
      ],
      label: "Skyview LUT"
    });
    this.group0 = e.createBindGroup({
      layout: n,
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
        },
        {
          binding: 3,
          resource: a
        }
      ],
      label: "Skyview LUT Group 0"
    });
    const u = e.createBindGroupLayout({
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
      layout: u,
      entries: [
        {
          binding: 0,
          resource: { buffer: s.buffer }
        }
      ],
      label: "Skyview LUT Group 1"
    });
    const l = e.createShaderModule({
      code: ze
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: l,
        entryPoint: "computeSkyViewLuminance"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [n, u]
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
const Pe = `struct Atmosphere
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
`, H = "rgba16float";
class Ae {
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
  group0Layout;
  group1Layout;
  lutSampler;
  group0;
  group1;
  outputColor;
  outputColorView;
  pipeline;
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
  constructor(e, t, r, a, i, s, n, u) {
    this.group0Layout = e.createBindGroupLayout({
      entries: [
        {
          // output texture
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: H
          }
        },
        {
          // sampler for the LUTs
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          sampler: {
            type: n ? "filtering" : "non-filtering"
          }
        },
        {
          // transmittance
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: n ? "float" : "unfilterable-float",
            viewDimension: "2d"
          }
        },
        {
          // multiscatter
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: n ? "float" : "unfilterable-float",
            viewDimension: "2d"
          }
        },
        {
          // skyview
          binding: 4,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: n ? "float" : "unfilterable-float",
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
      format: H,
      size: { width: 1, height: 1 },
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Atmosphere Camera Output Color"
    }), this.outputColorView = this.outputColor.createView(), this.lutSampler = e.createSampler({
      label: "Atmosphere Camera LUT Sampler",
      magFilter: n ? "linear" : "nearest",
      minFilter: n ? "linear" : "nearest"
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
          resource: a
        },
        {
          binding: 4,
          resource: i
        },
        {
          binding: 5,
          resource: s
        }
      ],
      label: "Atmosphere Camera Group 0"
    }), this.group1 = e.createBindGroup({
      layout: this.group1Layout,
      entries: [
        {
          binding: 0,
          resource: { buffer: u.buffer }
        }
      ],
      label: "Atmosphere Camera Group 1"
    });
    const l = e.createShaderModule({
      code: Pe,
      label: "Atmosphere Camera"
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: l,
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
  resize(e, t, r, a, i, s) {
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
          resource: a
        },
        {
          binding: 4,
          resource: i
        },
        {
          binding: 5,
          resource: s
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
    const a = e.beginComputePass({
      timestampWrites: t !== void 0 ? {
        querySet: t.querySet,
        beginningOfPassWriteIndex: t.beginWriteIndex,
        endOfPassWriteIndex: t.endWriteIndex
      } : void 0,
      label: "Atmosphere Camera"
    });
    a.setPipeline(this.pipeline), a.setBindGroup(0, this.group0), a.setBindGroup(1, this.group1), a.setBindGroup(2, r.readGroup), a.dispatchWorkgroups(
      Math.ceil(this.outputColor.width / 16),
      Math.ceil(this.outputColor.height / 16)
    ), a.end();
  }
}
const Re = `const PI = 3.141592653589793;
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
`, j = "rgba16float";
class Ue {
  /**
   * The aerial perspective lookup table texture.
   */
  texture;
  /**
   * The view into {@link texture}.
   */
  view;
  /*
   * @group(0) @binding(0) var aerial_perspective_lut: texture_storage_3d<rgba16float, write>;
   * @group(0) @binding(1) var lut_sampler: sampler;
   * @group(0) @binding(2) var transmittance_lut: texture_2d<f32>;
   * @group(0) @binding(3) var multiscatter_lut: texture_2d<f32>;
   *
   * @group(1) @binding(0) var<uniform> u_global: GlobalUBO;
   */
  group0;
  group1;
  pipeline;
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
  constructor(e, t, r, a, i, s) {
    this.texture = e.createTexture({
      size: t,
      dimension: "3d",
      format: j,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
      label: "Aerial Perspective LUT"
    }), this.view = this.texture.createView({
      label: this.texture.label,
      dimension: "3d"
    });
    const n = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            access: "write-only",
            viewDimension: "3d",
            format: j
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
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          texture: {
            sampleType: i ? "float" : "unfilterable-float"
          }
        }
      ],
      label: "Aerial Perspective LUT"
    });
    this.group0 = e.createBindGroup({
      layout: n,
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
        },
        {
          binding: 3,
          resource: a
        }
      ],
      label: "Aerial Perspective LUT Group 0"
    });
    const u = e.createBindGroupLayout({
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
      layout: u,
      entries: [
        {
          binding: 0,
          resource: { buffer: s.buffer }
        }
      ],
      label: "Aerial Perspective LUT Group 1"
    });
    const l = e.createShaderModule({
      code: Re
    });
    this.pipeline = e.createComputePipeline({
      compute: {
        module: l,
        entryPoint: "computeAerialPerspective"
      },
      layout: e.createPipelineLayout({
        bindGroupLayouts: [n, u]
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
const Ee = [
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
class T {
  texture;
  view;
  viewDimension;
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
  /**
   * Uses the passed texture to create a view, while storing the texture
   * object so that the properties can be queried later. The resulting view
   * will have dimension "1d", "2d", "2d-array", or "3d" and will match the
   * texture.
   * @param texture - The texture to store and create a view of.
   */
  constructor(e) {
    this.texture = e;
    let t = 1, r = this.texture.dimension;
    this.texture.dimension == "2d" && this.texture.depthOrArrayLayers > 1 && (t = this.texture.depthOrArrayLayers, r = "2d-array"), this.viewDimension = r, this.view = e.createView({
      label: `Render Output View for '${e.label}'`,
      dimension: this.viewDimension,
      arrayLayerCount: t,
      baseArrayLayer: 0
    });
  }
}
class Le {
  flip = !1;
  colorGain = { r: 1, g: 1, b: 1 };
  channelMasks = { r: !0, g: !0, b: !0 };
  swapBARG = !1;
  mipLevel = 0;
  arrayLayer = 0;
}
const Ce = [
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
class Ge {
  options;
  textureProperties;
  controllers;
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
    }).name("Render Output").listen().onFinishChange((h) => {
      this.setOutput(h);
    });
    const r = this.options.renderOutputTransforms.get(
      this.options.outputTexture
    ), a = t.add(r, "flip").name("Flip Image").listen(), i = t.add(r, "mipLevel").min(0).max(0).step(1).name("Mip Level").listen(), s = t.add(r, "arrayLayer").min(0).max(0).step(1).name("Array Layer").listen(), n = -1e4, u = 1e4;
    t.add({ scale: 0 }, "scale").name("Uniform Scale").min(n).max(u).onChange((h) => {
      this.setUniformColorScale(h);
    });
    const l = t.add(r.channelMasks, "r").name("R").listen(), _ = t.add(r.colorGain, "r").name("").min(n).max(u).listen(), c = t.add(r.channelMasks, "g").name("G").listen(), d = t.add(r.colorGain, "g").name("").min(n).max(u).listen(), v = t.add(r.channelMasks, "b").name("B").listen(), g = t.add(r.colorGain, "b").name("").min(n).max(u).listen(), m = t.add(r, "swapBARG").name("Swap Blue-Alpha and Red-Green Pairs").listen();
    this.controllers = {
      flip: a,
      colorGain: {
        r: _,
        g: d,
        b: g
      },
      channelMasks: {
        r: l,
        g: c,
        b: v
      },
      swapBARG: m,
      mipLevel: i,
      arrayLayer: s
    };
  }
  constructor() {
    this.options = {
      outputTexture: "Scene",
      renderOutputTransforms: new Map(
        Ee.map((e) => [e, new Le()])
      )
    }, Ce.forEach(
      ({ id: e, ...t }) => {
        const r = this.options.renderOutputTransforms.get(e);
        this.options.renderOutputTransforms.set(e, {
          ...r,
          ...t
        });
      }
    ), this.textureProperties = /* @__PURE__ */ new Map();
  }
}
const Y = "rgba16float", Fe = "float", Oe = "depth32float", X = "rgba16float", Ie = "float";
class ie {
  colorWithSurfaceWorldDepthInAlpha;
  colorWithSurfaceWorldDepthInAlphaView;
  normalWithSurfaceFoamStrengthInAlpha;
  normalWithSurfaceFoamStrengthInAlphaView;
  // Depth used for graphics pipelines that render into the gbuffer
  depth;
  depthView;
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
      colorWithSurfaceWorldDepthInAlpha: new T(
        this.colorWithSurfaceWorldDepthInAlpha
      ),
      normalWithSurfaceFoamStrengthInAlpha: new T(
        this.normalWithSurfaceFoamStrengthInAlpha
      )
    };
  }
  /**
   * Contains all bindings for reading the GBuffer in a shader.
   * @see {@link GBuffer} for descriptions of the targets including formats.
   */
  readGroupLayout;
  /**
   * @see {@link readGroupLayout}
   */
  readGroup;
  writeGroupLayout;
  /**
   * Contains all bindings for writing to the GBuffer in a shader.
   * @see {@link GBuffer} for descriptions of the targets including formats.
   */
  writeGroup;
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
    this.colorWithSurfaceWorldDepthInAlpha = e.createTexture({
      size: t,
      dimension: "2d",
      format: Y,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      label: "GBuffer ColorWithSurfaceWorldDepthInAlpha"
    }), this.colorWithSurfaceWorldDepthInAlphaView = this.colorWithSurfaceWorldDepthInAlpha.createView({
      label: "GBuffer ColorWithSurfaceWorldDepthInAlpha"
    }), this.normalWithSurfaceFoamStrengthInAlpha = e.createTexture({
      size: t,
      dimension: "2d",
      format: X,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      label: "GBuffer Normal"
    }), this.normalWithSurfaceFoamStrengthInAlphaView = this.normalWithSurfaceFoamStrengthInAlpha.createView({
      label: "GBuffer Normal"
    }), this.readGroupLayout = r?.readGroupLayout ?? e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
          texture: { sampleType: Fe }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
          texture: { sampleType: Ie }
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
    }), this.writeGroupLayout = r?.writeGroupLayout ?? e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
          storageTexture: {
            access: "write-only",
            format: Y
          }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
          storageTexture: {
            access: "write-only",
            format: X
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
      format: Oe,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      label: "GBuffer Depth"
    }), this.depthView = this.depth.createView({ label: "GBuffer Depth" });
  }
}
const Be = `const PI = 3.141592653589793;
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
`, qe = `const TWO_PI = 6.28318530717958647693;
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
class Ne extends A {
  data = {
    log_2_size: 1,
    size: 2,
    b_inverse: !1
  };
  constructor(e) {
    super(e, 3, "DFFT Parameters UBO");
  }
  packed() {
    const e = new ArrayBuffer(this.buffer.size), t = new DataView(e);
    return t.setUint32(0, this.data.log_2_size, !0), t.setUint32(4, this.data.size, !0), t.setFloat32(8, this.data.b_inverse ? 1 : 0, !0), t;
  }
}
const Q = 16, L = "rgba16float";
class We {
  parametersUBO;
  butterfliesBuffer;
  gridSize3D;
  /*
   * We work with buffers instead of textures, since webgpu is restrictive on
   * which storage textures can be read_write without extensions. A possible
   * workaround is using two functions for the perform kernel, identical up to
   * swapping source/destination buffer. This would save copying during IO, but
   * might not be necessary.
   */
  complexBuffer0;
  complexBuffer1;
  stepCounterBuffer;
  outputTexture;
  /*
   * @group(0) @binding(0) var<uniform> u_parameters: DFFTParameters;
   * @group(0) @binding(1) var<storage, write> out_butterflies_log2n_by_n: array<TwoPointButterfly>;
   */
  butterfliesBindGroup;
  computeButterfliesKernel;
  /*
   * @group(0) @binding(0) var<uniform> u_parameters: DFFTParameters;
   * @group(0) @binding(1) var<storage, read> butterflies_log2n_by_n: array<TwoPointButterfly>;
   * @group(0) @binding(2) var<storage, read_write> buffer_0: array<vec2<f32>>;
   * @group(0) @binding(3) var<storage, read_write> buffer_1: array<vec2<f32>>;
   * @group(0) @binding(4) var<uniform> step_counter: u32;
   * @group(0) @binding(5) var<uniform, read_write> out_half_precision_buffer: array<vec4<f16>>;
   */
  performBindGroup;
  performKernel;
  performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel;
  /*
   * @group(0) @binding(0) var<storage, read_write> out_step_counter: u32;
   */
  stepCounterBindGroup;
  incrementStepCounterKernel;
  resetStepCounterKernel;
  /**
   * Initializes all the pipelines and intermediate buffers for the
   * performance of the DFFT on a square grid of size 2^N, where N is
   * {@link log2GridSize}.
   * @param device - The WebGPU device to use.
   * @param log2GridSize - The exponent used to calculate the grid
   *  size. Must be greater than 4.
   */
  constructor(e, t, r) {
    if (t < 5)
      throw new RangeError("gridSizeExponent must be greater than 4.");
    if (!Number.isFinite(r) || r < 1)
      throw new RangeError(`layerCount of ${r} is invalid`);
    const a = Math.pow(2, t);
    this.gridSize3D = {
      width: a,
      height: a,
      depthOrArrayLayers: r
    };
    const i = this.gridSize3D.width * this.gridSize3D.height * this.gridSize3D.depthOrArrayLayers;
    this.parametersUBO = new Ne(e), this.parametersUBO.data.log_2_size = t, this.parametersUBO.data.size = a, this.parametersUBO.data.b_inverse = !1, this.parametersUBO.writeToGPU(e.queue);
    const s = 16;
    this.butterfliesBuffer = e.createBuffer({
      label: "DFFT Precompute Stage Steps",
      size: t * a * s,
      usage: GPUBufferUsage.STORAGE
    });
    const n = e.createShaderModule({
      label: "DFFT Precompute Stage",
      code: qe
    }), u = e.createBindGroupLayout({
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
      layout: u,
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
    const l = e.createPipelineLayout({
      label: "DFFT Precompute Steps Kernel",
      bindGroupLayouts: [u]
    });
    this.computeButterfliesKernel = e.createComputePipeline({
      label: "DFFT Precompute Stage",
      compute: {
        module: n,
        entryPoint: "precomputeDFFTInstructions"
      },
      layout: l
    });
    const _ = e.createBindGroupLayout({
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
            format: L,
            viewDimension: "2d-array",
            access: "write-only"
          }
        }
      ]
    });
    this.complexBuffer0 = e.createBuffer({
      label: "DFFT Buffer 0",
      size: i * Q,
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
    const d = new Uint32Array(1);
    d[0] = 0, e.queue.writeBuffer(this.stepCounterBuffer, 0, d), this.outputTexture = e.createTexture({
      label: "DFFT Output Texture",
      format: L,
      size: this.gridSize3D,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC
    }), this.performBindGroup = e.createBindGroup({
      label: "DFFT Perform Group 0",
      layout: _,
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
    const v = e.createPipelineLayout({
      label: "DFFT Perform",
      bindGroupLayouts: [_]
    });
    this.performKernel = e.createComputePipeline({
      label: "DFFT Perform DFFT Step",
      compute: {
        module: n,
        entryPoint: "performDFFTStep"
      },
      layout: v
    }), this.performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel = e.createComputePipeline({
      label: "DFFT Perform Swap Even Signs",
      compute: {
        module: n,
        entryPoint: "performSwapEvenSignsAndCopyToHalfPrecisionOutput"
      },
      layout: v
    });
    const g = e.createBindGroupLayout({
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
      layout: g,
      entries: [
        {
          binding: 7,
          resource: { buffer: this.stepCounterBuffer }
        }
      ]
    });
    const m = e.createPipelineLayout({
      label: "DFFT Step Counter",
      bindGroupLayouts: [g]
    });
    this.incrementStepCounterKernel = e.createComputePipeline({
      label: "DFFT Increment Step Counter Kernel",
      layout: m,
      compute: {
        module: n,
        entryPoint: "incrementStepCounter"
      }
    }), this.resetStepCounterKernel = e.createComputePipeline({
      label: "DFFT Reset Step Counter Kernel",
      layout: m,
      compute: {
        module: n,
        entryPoint: "resetStepCounter"
      }
    }), this.parametersUBO.data.b_inverse = !0, this.parametersUBO.writeToGPU(e.queue);
    const h = e.createCommandEncoder({
      label: "DFFT Precompute"
    }), p = h.beginComputePass({
      label: "DFFT Precompute Steps"
    });
    p.setPipeline(this.computeButterfliesKernel), p.setBindGroup(0, this.butterfliesBindGroup), p.dispatchWorkgroups(a / 2 / 2, 1), p.end(), e.queue.submit([h.finish()]);
  }
  recordPerformOnBuffer0(e, t) {
    const r = 2 * this.parametersUBO.data.log_2_size, a = e.beginComputePass({
      label: "DFFT Perform",
      timestampWrites: t
    });
    for (let i = 0; i < r; i++)
      i === 0 ? (a.setPipeline(this.resetStepCounterKernel), a.setBindGroup(0, this.stepCounterBindGroup), a.dispatchWorkgroups(1)) : (a.setPipeline(this.incrementStepCounterKernel), a.setBindGroup(0, this.stepCounterBindGroup), a.dispatchWorkgroups(1)), a.setPipeline(this.performKernel), a.setBindGroup(0, this.performBindGroup), a.dispatchWorkgroups(
        this.gridSize3D.width / 16,
        this.gridSize3D.height / 16,
        this.gridSize3D.depthOrArrayLayers / 1
      );
    a.setPipeline(
      this.performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel
    ), a.setBindGroup(0, this.performBindGroup), a.dispatchWorkgroups(
      this.gridSize3D.width / 16,
      this.gridSize3D.height / 16,
      this.gridSize3D.depthOrArrayLayers / 1
    ), a.end();
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
  recordPerform(e, t, r, a, i, s) {
    const n = "rgba32float";
    if (r.format != n)
      throw RangeError(
        `sourceTexture (format ${r.format}) must be ${n}`
      );
    if (a.format != L)
      throw RangeError(
        `destinationArray (format ${r.format}) must be ${n}`
      );
    if (r.width != a.width || r.height != a.height || r.depthOrArrayLayers != a.depthOrArrayLayers)
      throw RangeError(
        `SourceTexture ${r.label} does not match destination texture ${a.label} extent`
      );
    this.parametersUBO.data.b_inverse = i, this.parametersUBO.writeToGPU(e.queue), t.copyTextureToBuffer(
      { texture: r },
      {
        buffer: this.complexBuffer0,
        bytesPerRow: this.gridSize3D.width * Q,
        rowsPerImage: this.gridSize3D.height
      },
      this.gridSize3D
    ), this.recordPerformOnBuffer0(t, s), t.copyTextureToTexture(
      {
        texture: this.outputTexture
      },
      {
        texture: a
      },
      this.gridSize3D
    );
  }
}
const ke = `@group(0) @binding(0) var out_next_mip_level: texture_storage_2d_array<rgba16float, write>;
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
`, C = "rgba16float";
class Ve {
  /*
   * @group(0) @binding(0) var out_next_mip_level: texture_storage_2d<rgba16float, write>;
   * @group(0) @binding(1) var in_previous_mip_level: texture_2d<f32>;
   */
  fillMipMapTextureInOutLayout;
  // private fillMipMapTextureBindGroups: GPUBindGroup[];
  // private baseSize: { width: number; height: number };
  // Workgroup size is (16,16,1)
  fillMipMapKernel;
  // Workgroup size is (1,1,1)
  fillMipMapSmallerKernel;
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
    if (t.format != C)
      throw new RangeError(
        `Invalid source texture (label ${t.label}) for MipMap generation`,
        {
          cause: `Source format is ${t.format} when expected ${C}`
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
      ].map((a, i) => {
        const s = i + 1, n = i;
        return e.createBindGroup({
          label: `MipMap Generation for '${t.label}' IO Bind Group '${n} => ${s}'`,
          layout: this.fillMipMapTextureInOutLayout,
          entries: [
            {
              binding: 0,
              resource: t.createView({
                dimension: "2d-array",
                baseMipLevel: s,
                mipLevelCount: 1
              })
            },
            {
              binding: 1,
              resource: t.createView({
                dimension: "2d-array",
                baseMipLevel: n,
                mipLevelCount: 1
              })
            }
          ]
        });
      }),
      arrayLevelCount: t.depthOrArrayLayers
    };
  }
  constructor(e) {
    this.fillMipMapTextureInOutLayout = e.createBindGroupLayout({
      label: "MipMap Generation fillMipMap Texture In-Out",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: C,
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
      code: ke
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
    t.bindGroupsByMipLevel.forEach((r, a) => {
      e.setBindGroup(0, r);
      const i = 1 << a, s = t.level0Size.width / i, n = t.level0Size.height / i;
      s >= 16 && n >= 16 ? (e.setPipeline(this.fillMipMapKernel), e.dispatchWorkgroups(
        s / 16,
        n / 16,
        t.arrayLevelCount
      )) : (e.setPipeline(this.fillMipMapSmallerKernel), e.dispatchWorkgroups(
        s,
        n,
        t.arrayLevelCount
      ));
    });
  }
}
const He = 9.8, je = 100, Ye = "rg32float", K = "rg32float", Xe = "rgba16float", $ = "rgba16float", G = "rgba32float", Qe = 4, Z = 4;
class Ke extends A {
  data = {
    fourier_grid_size: 1,
    gravity: He,
    padding0: 0,
    wave_period_seconds: je,
    wind_speed_meters_per_second: 10,
    wind_fetch_meters: 10 * 1e3,
    wave_swell: 0.3,
    padding1: 0,
    cascades: new Array(4)
  };
  constructor(e) {
    super(
      e,
      8 + Qe * Z,
      "Fourier Waves UBO"
    );
  }
  packed() {
    const e = new ArrayBuffer(this.buffer.size), t = new DataView(e), r = new Float32Array(e);
    t.setUint32(0, this.data.fourier_grid_size, !0), t.setFloat32(4, this.data.gravity, !0), t.setFloat32(8, this.data.padding0, !0), t.setFloat32(12, this.data.wave_period_seconds, !0), t.setFloat32(16, this.data.wind_speed_meters_per_second, !0), t.setFloat32(20, this.data.wind_fetch_meters, !0), t.setFloat32(24, this.data.wave_swell, !0), t.setFloat32(28, this.data.padding1, !0);
    const a = 8;
    return this.data.cascades.forEach((i, s) => {
      const n = a + s * Z;
      r.set(i.wave_number_min_max, n), r[n + 2] = i.wave_patch_extent_meters, r[n + 3] = 0;
    }), t;
  }
}
function $e() {
  const o = Math.random(), e = Math.random(), t = Math.sqrt(-2 * Math.log(o)), r = 2 * Math.PI * e, a = t * Math.cos(r), i = t * Math.sin(r);
  return [a, i];
}
class Ze {
  Dx_Dy_Dz_Dxdz_Spatial;
  Dydx_Dydz_Dxdx_Dzdz_Spatial;
  turbulenceJacobian;
  /**
   * The number of mip levels for every map in this collection.
   * @readonly
   */
  get mipLevelCount() {
    return this.Dx_Dy_Dz_Dxdz_Spatial.mipLevelCount;
  }
  /**
   * Contains `(Dx,Dy,Dz,d/dz Dx)` packed in RGBA, where `(Dx,Dy,Dz)` is the
   * displacement of the ocean surface at the sampled point and `d/di` is the
   * partial derivative with respect to coordinate `i`. The dimension is
   * `2d-array`, and each array layer represents one cascade.
   * @readonly
   */
  Dx_Dy_Dz_Dxdz_SpatialAllMips;
  /**
   * Contains `(d/dx Dy,d/dz Dy,d/dx Dx,d/dz Dz)` packed in RGBA, where
   * `(Dx,Dy,Dz)` is the displacement of the ocean surface at the sampled
   * point and `d/di` is the partial derivative with respect to coordinate
   * `i`. The dimension is `2d-array`, and each array layer represents one
   * cascade.
   */
  Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips;
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
  turbulenceJacobianOneMip;
  constructor(e, t, r) {
    e.mipLevelCount != t.mipLevelCount && console.warn(
      `FFT Wave Displacement maps do not have identical mip levels. ${e.mipLevelCount} vs ${t.mipLevelCount}`
    ), this.Dx_Dy_Dz_Dxdz_Spatial = e, this.Dydx_Dydz_Dxdx_Dzdz_Spatial = t, this.turbulenceJacobian = r, this.Dx_Dy_Dz_Dxdz_SpatialAllMips = this.Dx_Dy_Dz_Dxdz_Spatial.createView({
      label: `FFT Wave DisplacementMaps for ${this.Dx_Dy_Dz_Dxdz_Spatial.label}`
    }), this.Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips = this.Dydx_Dydz_Dxdx_Dzdz_Spatial.createView({
      label: `FFT Wave DisplacementMaps for ${this.Dydx_Dydz_Dxdx_Dzdz_Spatial.label}`
    }), this.turbulenceJacobianOneMip = this.turbulenceJacobian.map(
      (a, i) => a.createView({
        label: `FFT Wave DisplacementMaps for ${this.turbulenceJacobian[i].label} index ${i}`
      })
    );
  }
}
class Je {
  /*
   * We produce a discrete spectrum of waves, for which the various values
   * will be stored in square textures. This dimension determines the diameter
   * of that square, so the total number of frequencies we produce. Our
   * spectrum is discrete so we can apply an IDFT algorithm to determine the
   * displacement when rendering the sums of these waves. (x,z) position in
   * this grid uniquely identifies a wave with wave vector k = (k_x,k_z)
   */
  gridSize;
  cascadeCount;
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
  initialAmplitudeKernel;
  timeDependentAmplitudeKernel;
  accumulateTurbulenceKernel;
  dfftResources;
  mipMapGenerator;
  cascades;
  /*
   * Final output maps that store the results of the FFT.
   * Is mipmapped and has array layers, one layer for each cascade.
   */
  Dx_Dy_Dz_Dxdz_SpatialArray;
  Dydx_Dydz_Dxdx_Dzdz_SpatialArray;
  /*
   * Array layer N contains the jacobian computed from layers 1 through N.
   * Each layer is a cascade, so it is done this way in case we only sample the lower cascades.
   * We do not want the turbulence from higher cascades to affect the lower cascades.
   *
   * We need two storage textures since we cannot natively have read_write storage. They are swapped out each frame.
   */
  turbulenceJacobianArrays;
  turbulenceJacobianGroup1;
  turbulenceJacobianIndex = 0;
  /**
   * Gets the index of the turbulence-jacobian map that will be (or was)
   * written into this frame.
   * @readonly
   */
  get turbulenceMapIndex() {
    return this.turbulenceJacobianIndex;
  }
  Dx_Dy_Dz_Dxdz_SpatialArray_MipMapBindings;
  Dydx_Dydz_Dxdx_Dzdz_SpatialArray_MipMapBindings;
  waveSettings;
  createCascades(e, t, r, a) {
    const i = this.textureGridSize, s = i.width * i.height * i.depthOrArrayLayers, n = e.createTexture({
      label: "FFT Wave Gaussian Noise",
      format: Ye,
      size: i,
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
    }), u = 2, l = 8, _ = new Float32Array(
      s * u
    );
    for (let f = 0; f < _.length; f++)
      _[f] = $e()[0];
    e.queue.writeTexture(
      { texture: n },
      _,
      {
        bytesPerRow: l * i.width,
        rowsPerImage: i.height
      },
      i
    );
    const c = new Ke(e);
    c.data.fourier_grid_size = r, a.forEach((f, w) => {
      c.data.cascades[w] = {
        wave_number_min_max: S.create(...f.waveNumberMinMax),
        wave_patch_extent_meters: f.patchExtentMeters,
        padding0: 0
      };
    }), c.writeToGPU(e.queue);
    const d = e.createTexture({
      label: "FFT Wave Fourier Amplitude h_0(k)",
      format: K,
      size: i,
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
    }), v = e.createBindGroup({
      label: "FFT Wave Initial Amplitude h_0(k) Group 0",
      layout: this.initialAmplitudeKernel.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: d.createView()
        },
        {
          binding: 1,
          resource: n.createView()
        }
      ]
    }), g = e.createBindGroup({
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
    }), m = e.createTexture(
      {
        label: "FFT Wave Packed (Dx + iDy, Dz + iDxdz) Amplitude",
        format: G,
        size: i,
        usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
      }
    ), h = e.createTexture({
      label: "FFT Wave Packed (Dydx + iDydz, Dxdx + iDzdz) Amplitude",
      format: m.format,
      size: i,
      usage: m.usage
    }), p = e.createBindGroup({
      label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 0",
      layout: this.timeDependentAmplitudeKernel.getBindGroupLayout(0),
      entries: [
        {
          binding: 2,
          resource: m.createView()
        },
        {
          binding: 3,
          resource: h.createView()
        },
        {
          binding: 4,
          resource: d.createView()
        }
      ]
    }), x = e.createBindGroup({
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
      gaussianNoiseArray: n,
      initialAmplitudeArray: d,
      waveSettings: c,
      initialAmplitudeGroup0: v,
      initialAmplitudeGroup1: g,
      packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray: m,
      packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray: h,
      timeDependentAmplitudeGroup0: p,
      timeDependentAmplitudeGroup1: x
    };
  }
  /**
   * Instantiates all the cascades and resources.
   * @param device - The WebGPU device to use.
   * @param globalUBO - The global UBO that will be bound into
   * 	pipelines.
   */
  constructor(e, t, r) {
    this.gridSize = Math.pow(2, r);
    const a = e.createBindGroupLayout({
      label: "FFT Wave Initial Amplitude h_0(k) Group 0",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            format: K,
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
    }), i = e.createBindGroupLayout({
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
    }), s = e.createShaderModule({
      label: "FFT Wave",
      code: Be
    });
    this.initialAmplitudeKernel = e.createComputePipeline({
      label: "FFT Wave Initial Amplitude h_0(k)",
      layout: e.createPipelineLayout({
        label: "FFT Wave Initial Amplitude h_0(k)",
        bindGroupLayouts: [
          a,
          i
        ]
      }),
      compute: {
        module: s,
        entryPoint: "computeInitialAmplitude"
      }
    }), this.mipMapGenerator = new Ve(e);
    const n = e.createBindGroupLayout(
      {
        label: "FFT Wave Time Dependent Fourier Amplitude h(k,t) Group 0",
        entries: [
          {
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            storageTexture: {
              format: G,
              viewDimension: "2d-array",
              access: "write-only"
            }
          },
          {
            binding: 3,
            visibility: GPUShaderStage.COMPUTE,
            storageTexture: {
              format: G,
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
    ), u = e.createBindGroupLayout(
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
          n,
          u
        ]
      }),
      compute: {
        module: s,
        entryPoint: "computeTimeDependentAmplitude"
      }
    });
    const l = e.createBindGroupLayout({
      label: "FFT Wave Accumulate Turbulence Group 0",
      entries: [
        {
          binding: 5,
          visibility: GPUShaderStage.COMPUTE,
          storageTexture: {
            viewDimension: "2d-array",
            format: $
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
    }), _ = e.createBindGroupLayout({
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
          l,
          _
        ]
      }),
      compute: {
        module: s,
        entryPoint: "accumulateTurbulence"
      }
    });
    function c(x) {
      const f = 2 * x;
      return 2 * Math.PI / f;
    }
    const d = [200, 50, 10], v = [
      1e-3,
      ...d.map(
        (x) => c(x / this.gridSize)
      ),
      1e3
    ], g = d.map((x, f) => ({
      patchExtentMeters: x,
      waveNumberMinMax: [
        v[f],
        v[f + 1]
      ]
    }));
    this.cascadeCount = g.length, this.dfftResources = new We(
      e,
      r,
      this.cascadeCount
    ), this.Dx_Dy_Dz_Dxdz_SpatialArray = e.createTexture({
      label: "FFT Wave Final Displacement Array",
      format: Xe,
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
      g
    );
    const m = 15360, h = this.textureGridSize.width * this.textureGridSize.height * this.textureGridSize.depthOrArrayLayers, p = new Uint16Array(
      h * 4
    ).fill(m);
    this.turbulenceJacobianArrays = [0, 0].map((x, f) => e.createTexture({
      label: `FFT Wave (Turbulence,Jacobian) Array ${f}`,
      format: $,
      size: this.textureGridSize,
      mipLevelCount: r,
      usage: GPUTextureUsage.STORAGE_BINDING | // write to
      GPUTextureUsage.TEXTURE_BINDING | // read from to accumulate turbulence
      GPUTextureUsage.COPY_SRC | // mip map generation
      GPUTextureUsage.COPY_DST
      // initialize/wipe turbulence to 1.0
    })).reduce(
      (x, f, w, D) => {
        e.queue.writeTexture(
          { texture: f },
          p,
          {
            bytesPerRow: this.Dx_Dy_Dz_Dxdz_SpatialArray.width * 8,
            rowsPerImage: this.Dx_Dy_Dz_Dxdz_SpatialArray.height
          },
          this.textureGridSize
        );
        const R = e.createBindGroup({
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
              resource: D[(w + 1) % D.length].createView({})
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
        return x.concat({
          textureArray: f,
          bindGroup: R,
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
   * @returns The views into all the FFT Wave textures, for read-only display
   *  purposes.
   */
  views() {
    return {
      gaussianNoise: new T(
        this.cascades.gaussianNoiseArray
      ),
      initialAmplitude: new T(
        this.cascades.initialAmplitudeArray
      ),
      packed_Dx_plus_iDy_Dz_iDxdz_Amplitude: new T(
        this.cascades.packed_Dx_plus_iDy_Dz_iDxdz_AmplitudeArray
      ),
      packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude: new T(
        this.cascades.packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_AmplitudeArray
      ),
      turbulenceJacobian: new T(
        this.turbulenceJacobianArrays[0].textureArray
      ),
      Dx_Dy_Dz_Dxdz_Spatial: new T(
        this.Dx_Dy_Dz_Dxdz_SpatialArray
      ),
      Dydx_Dydz_Dxdx_Dzdz_Spatial: new T(
        this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray
      )
    };
  }
  /**
   * @returns The views into the displacement maps that are the output of the
   *  ocean spectrum.
   */
  displacementMaps() {
    return new Ze(
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
  record(e, t, r, a) {
    if (r.gravity != this.waveSettings.gravity || r.waveSwell != this.waveSettings.waveSwell || r.windSpeedMetersPerSeconds != this.waveSettings.windSpeedMetersPerSeconds || r.windFetchMeters != this.waveSettings.windFetchMeters) {
      this.waveSettings = structuredClone(r);
      const u = t.beginComputePass({
        label: "FFT Wave Initial Amplitude"
      }), l = this.cascades.waveSettings;
      l.data.wave_swell = this.waveSettings.waveSwell, l.data.wind_fetch_meters = this.waveSettings.windFetchMeters, l.data.wind_speed_meters_per_second = this.waveSettings.windSpeedMetersPerSeconds, l.data.gravity = this.waveSettings.gravity, l.writeToGPU(e.queue), u.setPipeline(this.initialAmplitudeKernel), u.setBindGroup(0, this.cascades.initialAmplitudeGroup0), u.setBindGroup(1, this.cascades.initialAmplitudeGroup1);
      const _ = this.textureGridSize;
      u.dispatchWorkgroups(
        _.width / 16,
        _.height / 16,
        _.depthOrArrayLayers / 1
      ), u.end();
    }
    {
      const u = t.beginComputePass({
        label: "FFT Wave Fourier Amplitude Realization",
        timestampWrites: a !== void 0 ? {
          querySet: a.querySet,
          beginningOfPassWriteIndex: a.beginWriteIndex
        } : void 0
      });
      u.setPipeline(this.timeDependentAmplitudeKernel), u.setBindGroup(
        0,
        this.cascades.timeDependentAmplitudeGroup0
      ), u.setBindGroup(
        1,
        this.cascades.timeDependentAmplitudeGroup1
      );
      const l = this.textureGridSize;
      u.dispatchWorkgroups(
        l.width / 16,
        l.height / 16,
        l.depthOrArrayLayers / 1
      ), u.end();
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
    const s = t.beginComputePass({
      label: "Turbulence Accumulation"
    });
    s.setPipeline(this.accumulateTurbulenceKernel), s.setBindGroup(
      0,
      this.turbulenceJacobianArrays[this.turbulenceJacobianIndex].bindGroup
    ), s.setBindGroup(1, this.turbulenceJacobianGroup1), s.dispatchWorkgroups(
      this.gridSize / 16,
      this.gridSize / 16,
      this.cascadeCount / 1
    ), s.end();
    const n = t.beginComputePass({
      label: "MipMap Generation",
      timestampWrites: a !== void 0 ? {
        querySet: a.querySet,
        endOfPassWriteIndex: a.endWriteIndex
      } : void 0
    });
    this.mipMapGenerator.recordUpdateMipMaps(
      n,
      this.Dx_Dy_Dz_Dxdz_SpatialArray_MipMapBindings
    ), this.mipMapGenerator.recordUpdateMipMaps(
      n,
      this.Dydx_Dydz_Dxdx_Dzdz_SpatialArray_MipMapBindings
    ), this.mipMapGenerator.recordUpdateMipMaps(
      n,
      this.turbulenceJacobianArrays[this.turbulenceJacobianIndex].mipMapBindings
    ), this.turbulenceJacobianIndex += 1, this.turbulenceJacobianIndex %= this.turbulenceJacobianArrays.length, n.end();
  }
}
const et = `const PI = 3.141592653589793;
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
`, J = 4;
class tt extends A {
  data = {
    patch_world_half_extent: 50,
    b_gerstner: !0,
    b_displacement_map: !0,
    vertex_size: 1e3,
    gbuffer_extent: S.create(1, 1),
    foam_scale: 1,
    foam_bias: 0,
    padding0: b.create(0, 0, 0),
    procedural_wave_count: 12,
    cascades: [
      { patch_size_meters: 200 },
      { patch_size_meters: 50 },
      { patch_size_meters: 10 },
      { patch_size_meters: 0 }
    ]
  };
  constructor(e) {
    const t = 12 + 4 * J;
    super(
      e,
      t,
      "Wave Surface Displacement Patch World Half Extent UBO"
    );
  }
  packed() {
    const e = new ArrayBuffer(this.buffer.size), t = new DataView(e), r = new Float32Array(e);
    t.setFloat32(0, this.data.patch_world_half_extent, !0), t.setUint32(4, this.data.b_gerstner ? 1 : 0, !0), t.setUint32(8, this.data.b_displacement_map ? 1 : 0, !0), t.setUint32(12, this.data.vertex_size, !0), r.set(this.data.gbuffer_extent, 4), t.setFloat32(24, this.data.foam_scale, !0), t.setFloat32(28, this.data.foam_bias, !0), r.set(this.data.padding0, 8), t.setUint32(44, this.data.procedural_wave_count, !0);
    const a = b.create(0, 0, 0);
    for (let i = 0; i < J; i++) {
      const s = 12 + i * 4;
      r.set(a, s), t.setFloat32(
        (s + 3) * 4,
        this.data.cascades[i].patch_size_meters,
        !0
      );
    }
    return t;
  }
}
class rt {
  oceanSurfaceRasterizationPipeline;
  /*
   * @group(0) @binding(0) var<uniform> u_settings: WaveSurfaceDisplacementUBO;
   * @group(0) @binding(1) var<uniform> u_global: GlobalUBO;
   */
  group0;
  /*
   * @group(1) @binding(0) var displacement_map_sampler: sampler;
   * @group(1) @binding(1) var Dx_Dy_Dz_Dxdz_spatial: texture_2d<f32>;
   * @group(1) @binding(2) var Dydx_Dydz_Dxdx_Dzdz_spatial: texture_2d<f32>;
   * @group(1) @binding(3) var<uniform> u_waves: array<PlaneWave, WAVE_COUNT>;
   */
  group1;
  /*
   * @group(2) @binding(0) var turbulence_jacobian: texture_2d_array<f32>;
   */
  group2ByTurbulenceMapIndex;
  settingsUBO;
  baseIndexCount;
  indices;
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
  constructor(e, t, r, a) {
    this.baseIndexCount = 6279174, this.indices = e.createBuffer({
      size: 6279174 * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX,
      label: "Wave Surface Displacement Indices"
    });
    const l = new Uint32Array(6279174);
    let _ = 0;
    for (let z = 0; z < 1023; z++)
      for (let P = 0; P < 1023; P++) {
        const U = P + z * 1024, q = U + 1, E = U + 1024, se = E + 1, N = new Uint32Array([
          U,
          E,
          q,
          q,
          E,
          se
        ]);
        l.set(N, _), _ += N.length;
      }
    e.queue.writeBuffer(this.indices, 0, l);
    const c = 12, d = 4, v = 4 * d, g = e.createBuffer({
      size: c * v,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
      label: "Wave Surface Displacement Waves"
    }), m = 9.8, h = 60, p = h * h * m / (2 * Math.PI), x = new Array(
      {
        direction: S.create(0.4, 2),
        amplitude: 0.25,
        wavelength: p / 144
      },
      {
        direction: S.create(0.6, 2),
        amplitude: 0.3,
        wavelength: p / 196
      },
      {
        direction: S.create(0.8, 2),
        amplitude: 0.35,
        wavelength: p / 144
      },
      {
        direction: S.create(1, 2),
        amplitude: 0.4,
        wavelength: p / 256
      },
      {
        direction: S.create(1.2, 2),
        amplitude: 0.45,
        wavelength: p / 144
      },
      {
        direction: S.create(1.4, 2),
        amplitude: 0.4,
        wavelength: p / 196
      },
      {
        direction: S.create(1.6, 2),
        amplitude: 0.35,
        wavelength: p / 144
      },
      {
        direction: S.create(1.8, 2),
        amplitude: 0.3,
        wavelength: p / 256
      },
      {
        direction: S.create(0.8, 1.5),
        amplitude: 0.02,
        wavelength: p / 900
      },
      {
        direction: S.create(1.1, 1.5),
        amplitude: 0.02,
        wavelength: p / 900
      },
      {
        direction: S.create(1.2, 1.5),
        amplitude: 0.02,
        wavelength: p / 900
      },
      {
        direction: S.create(1.3, 1.5),
        amplitude: 0.02,
        wavelength: p / 900
      }
    ), f = new Float32Array(c * d);
    let w = 0;
    x.forEach((z) => {
      f.set(z.direction, w), f[w + 2] = z.amplitude, f[w + 3] = z.wavelength, w += 4;
    }), e.queue.writeBuffer(g, 0, f), this.settingsUBO = new tt(e), this.settingsUBO.data.vertex_size = 1024, this.settingsUBO.data.procedural_wave_count = x.length;
    const D = e.createBindGroupLayout({
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
      layout: D,
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
          resource: a.Dx_Dy_Dz_Dxdz_SpatialAllMips
        },
        {
          binding: 2,
          resource: a.Dydx_Dydz_Dxdx_Dzdz_SpatialAllMips
        },
        {
          binding: 3,
          resource: { buffer: g }
        }
      ]
    });
    const R = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float", viewDimension: "2d-array" }
        }
      ]
    });
    this.group2ByTurbulenceMapIndex = a.turbulenceJacobianOneMip.map((z, P) => e.createBindGroup({
      label: `Wave Surface Displacement Group 2 Compute (Turbulence) index ${P}`,
      layout: R,
      entries: [
        {
          binding: 0,
          resource: z
        }
      ]
    }));
    const I = e.createBindGroupLayout({
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
      layout: I,
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
    const B = e.createShaderModule({
      code: et,
      label: "Wave Surface Displacement"
    });
    this.oceanSurfaceRasterizationPipeline = e.createRenderPipeline({
      layout: e.createPipelineLayout({
        bindGroupLayouts: [I, D, R]
      }),
      vertex: {
        module: B,
        entryPoint: "screenSpaceWarped"
      },
      fragment: {
        module: B,
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
  record(e, t, r, a, i, s) {
    this.settingsUBO.data.patch_world_half_extent = i.fft ? 100 : 300, this.settingsUBO.data.b_gerstner = i.gerstner, this.settingsUBO.data.b_displacement_map = i.fft, this.settingsUBO.data.foam_bias = i.foamBias, this.settingsUBO.data.gbuffer_extent = S.create(
      s.extent.width,
      s.extent.height
    ), this.settingsUBO.data.foam_scale = i.foamScale, this.settingsUBO.writeToGPU(e.queue);
    const n = t.beginRenderPass({
      label: "Wave Surface Rasterization",
      colorAttachments: [
        {
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear",
          storeOp: "store",
          view: s.colorWithSurfaceWorldDepthInAlphaView
        },
        {
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear",
          storeOp: "store",
          view: s.normalWithSurfaceFoamStrengthInAlphaView
        }
      ],
      depthStencilAttachment: {
        view: s.depthView,
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
    n.setPipeline(
      this.oceanSurfaceRasterizationPipeline
    ), n.setBindGroup(0, this.group0), n.setBindGroup(1, this.group1), n.setBindGroup(
      2,
      this.group2ByTurbulenceMapIndex[a]
    ), n.setIndexBuffer(this.indices, "uint32"), n.drawIndexed(this.baseIndexCount, 1), n.end();
  }
}
const at = `@group(0) @binding(0) var b_texture: texture_2d<f32>;
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
class it {
  color_gain = M.create(1, 1, 1, 1);
  vertex_scale = M.create(1, 1, 1, 1);
  swap_ba_rg = !1;
  channel_mask = 7;
  depth_or_array_layer = 0;
  mip_level_u32 = 0;
}
class nt extends A {
  data = new it();
  constructor(e) {
    super(e, 12, "Fullscreen Quad UBO");
  }
  packed() {
    const e = new ArrayBuffer(this.buffer.size), t = new DataView(e);
    return new Float32Array(e).set(this.data.color_gain, 0 / 4), new Float32Array(e).set(this.data.vertex_scale, 16 / 4), t.setUint32(32, this.data.swap_ba_rg ? 1 : 0, !0), t.setUint32(36, this.data.channel_mask, !0), t.setFloat32(40, this.data.depth_or_array_layer, !0), t.setUint32(44, this.data.mip_level_u32, !0), t;
  }
}
class st {
  // keep layout for resetting textures when resizing them
  group0Layout;
  group0LayoutArray;
  group0Layout3D;
  group0ByOutputTexture;
  group0Sampler;
  ubo;
  fullscreenQuadIndexBuffer;
  group1;
  pipeline;
  pipelineArray;
  pipeline3D;
  /**
   * The view format of the texture that will be passed to draw.
   * @see {@link record} for the function that takes in the view of this
   *  format.
   */
  attachmentFormat;
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
    let a = this.group0Layout;
    switch (r.viewDimension) {
      case "2d": {
        a = this.group0Layout;
        break;
      }
      case "2d-array": {
        a = this.group0LayoutArray;
        break;
      }
      case "3d": {
        a = this.group0Layout3D;
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
        layout: a,
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
   * Instantiates all resources.
   * @param device - The WebGPU device to use.
   * @param attachmentFormat - The texture format that will be used for the
   *  render pipelines attachments. This must match the format of the texture
   *  view used as the attachment at draw time.
   */
  constructor(e, t) {
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
    }), this.ubo = new nt(e);
    const a = e.createBindGroupLayout({
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
      layout: a,
      entries: [
        {
          binding: 0,
          resource: { buffer: this.ubo.buffer }
        }
      ]
    });
    const i = e.createShaderModule({
      code: at,
      label: "Fullscreen Quad"
    });
    this.pipeline = e.createRenderPipeline({
      vertex: {
        module: i,
        entryPoint: "vertexMain"
      },
      fragment: {
        module: i,
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
        bindGroupLayouts: [this.group0Layout, a]
      }),
      label: "Fullscreen Quad 2D"
    }), this.pipelineArray = e.createRenderPipeline({
      vertex: {
        module: i,
        entryPoint: "vertexMain"
      },
      fragment: {
        module: i,
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
        bindGroupLayouts: [this.group0LayoutArray, a]
      }),
      label: "Fullscreen Quad 2D Array"
    }), this.pipeline3D = e.createRenderPipeline({
      vertex: {
        module: i,
        entryPoint: "vertexMain"
      },
      fragment: {
        module: i,
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
        bindGroupLayouts: [this.group0Layout3D, a]
      }),
      label: "Fullscreen Quad 3D"
    });
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
  record(e, t, r, a, i, s) {
    const n = { r: 0, g: 0, b: 0, a: 1 }, u = this.group0ByOutputTexture.get(a);
    if (u === void 0) {
      console.warn("FullscreenQuadPass: No texture to output.");
      return;
    }
    const l = t.beginRenderPass({
      colorAttachments: [
        {
          clearValue: n,
          loadOp: "clear",
          storeOp: "store",
          view: r
        }
      ],
      timestampWrites: s !== void 0 ? {
        querySet: s.querySet,
        beginningOfPassWriteIndex: s.beginWriteIndex,
        endOfPassWriteIndex: s.endWriteIndex
      } : void 0,
      label: "Fullscreen Pass"
    });
    switch (this.ubo.data.color_gain = M.create(
      i.colorGain.r,
      i.colorGain.g,
      i.colorGain.b,
      1
    ), this.ubo.data.vertex_scale = M.create(
      1,
      i.flip ? -1 : 1,
      1,
      1
    ), this.ubo.data.mip_level_u32 = Math.round(i.mipLevel), this.ubo.data.depth_or_array_layer = i.arrayLayer, this.ubo.data.channel_mask = (i.channelMasks.r ? 1 : 0) + (i.channelMasks.g ? 2 : 0) + (i.channelMasks.b ? 4 : 0), this.ubo.data.swap_ba_rg = i.swapBARG, this.ubo.writeToGPU(e.queue), l.setIndexBuffer(
      this.fullscreenQuadIndexBuffer,
      "uint32",
      0,
      this.fullscreenQuadIndexBuffer.size
    ), l.setBindGroup(1, this.group1), u.texture.viewDimension) {
      case "2d": {
        l.setPipeline(this.pipeline);
        break;
      }
      case "2d-array": {
        l.setPipeline(this.pipelineArray);
        break;
      }
      case "3d": {
        l.setPipeline(this.pipeline3D);
        break;
      }
      default:
        throw new Error(
          `Unsupported texture dimension '${u.texture.viewDimension}'`
        );
    }
    l.setBindGroup(0, u.bindGroup), l.drawIndexed(6, 1, 0, 0, 0), l.end();
  }
}
const O = [
  "SkyviewLUT",
  "AerialPerspectiveLUT",
  "FFTWaves",
  "OceanSurface",
  "AtmosphereCamera",
  "FullscreenQuad"
], ee = ["DrawToDraw", ...O];
class te {
  values;
  sum = 0;
  average_ = 0;
  /*
   * Count how many values are valid. Starts at zero, goes to values.length,
   * and stays there. Necessary to keep runningSum valid before the buffer can
   * be filled once.
   */
  count = 0;
  /*
   * Index into values of next value to write
   */
  index = 0;
  constructor(e) {
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
class ot {
  // Defined only when timestamp querying is supported
  queryBuffers;
  frametimeAverages;
  timestampIndexMapping = /* @__PURE__ */ new Map();
  timestampQueryIndex = 0;
  uiDisplay;
  initialized;
  get averageFPS() {
    return this.uiDisplay.averageFPS;
  }
  destroy() {
    this.queryBuffers?.querySet.destroy(), this.queryBuffers?.writeBuffer.destroy(), this.queryBuffers?.readBuffer.destroy(), this.initialized = !1;
  }
  /**
   * Bind the frametime values and averageFPS to the passed UI, under a single
   * top-level folder.
   * @param gui - The GUI to bind to
   */
  setupUI(e) {
    const t = e.addFolder("Performance").close();
    t.add(this.uiDisplay, "averageFPS").decimals(1).disable().name("Average FPS").listen(), ee.forEach((r) => {
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
    this.frametimeAverages.get("DrawToDraw")?.push(e), this.timestampQueryIndex = 0, this.timestampIndexMapping.clear();
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
    if (this.uiDisplay.averageFPS = 1e3 / (this.frametimeAverages.get("DrawToDraw")?.average ?? 1e3), this.queryBuffers == null || this.queryBuffers.readBuffer.mapState !== "unmapped")
      return;
    const e = this.queryBuffers.readBuffer;
    e.mapAsync(GPUMapMode.READ, 0, e.size).then(() => {
      const t = new BigInt64Array(
        e.getMappedRange(0, e.size)
      );
      this.timestampIndexMapping.forEach((r, a) => {
        const s = Number(
          t.at(r + 1) - t.at(r)
        ) / 1e6;
        this.frametimeAverages.get(a)?.push(s);
      }), ee.forEach((r) => {
        const a = this.frametimeAverages.get(r)?.average;
        a !== void 0 && this.uiDisplay.frametimeControllers.get(r)?.setValue(a);
      }), e.unmap();
    }).catch((t) => {
      this.initialized && console.error(
        new Error(
          "Failed while retrieving frametime values from GPU:",
          { cause: t }
        )
      );
    });
  }
  constructor(e) {
    if (this.frametimeAverages = /* @__PURE__ */ new Map([
      ["DrawToDraw", new te(400)]
    ]), this.uiDisplay = {
      averageFPS: 0,
      frametimeControllers: /* @__PURE__ */ new Map()
    }, !e.features.has("timestamp-query")) {
      console.warn(
        "WebGPU feature 'timestamp-query' is not supported. Continuing, but without performance information about specific stages."
      ), this.initialized = !0;
      return;
    }
    const r = 8, a = 2 * O.length;
    this.queryBuffers = {
      querySet: e.createQuerySet({
        type: "timestamp",
        count: a
      }),
      writeBuffer: e.createBuffer({
        size: r * a,
        usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.QUERY_RESOLVE
      }),
      readBuffer: e.createBuffer({
        size: r * a,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
      })
    }, O.forEach((i) => {
      this.frametimeAverages.set(
        i,
        new te(400)
      );
    }), this.initialized = !0;
  }
}
const ut = { width: 2048, height: 1024 }, lt = { width: 1024, height: 1024 }, _t = { width: 1024, height: 512 }, ct = {
  width: 32,
  height: 32,
  depthOrArrayLayers: 32
}, ne = [0.25, 0.3333, 0.5, 0.75, 1, 1.5, 2, 4], F = /* @__PURE__ */ new Map([
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
function dt(o, e, t) {
  o.add(e, "renderScale", ne).name("Render Resolution Scale").decimals(1).onFinishChange((l) => {
    t();
  }).listen();
  const r = o.addFolder("Camera").open();
  r.add(e.oceanCamera, "translationX").name("Camera X").min(-100).max(100), r.add(e.oceanCamera, "translationY").name("Camera Y").min(10).max(2e3), r.add(e.oceanCamera, "translationZ").name("Camera Z").min(-100).max(100);
  const a = 0.01;
  r.add(e.oceanCamera, "eulerAnglesX").name("Camera Pitch").min(-Math.PI / 2 + a).max(Math.PI / 2 - a), r.add(e.oceanCamera, "eulerAnglesY").name("Camera Yaw").min(-Math.PI).max(Math.PI);
  const i = o.addFolder("Sun").open();
  i.add(e.orbit, "timeHours").min(0).max(24).name("Time in Hours").listen(), i.add(e.orbit, "timeSpeedupFactor").min(1).max(5e4).step(1).name("Time Multiplier"), i.add(e.orbit, "paused").name("Pause Sun"), i.add(
    {
      fn: () => {
        e.orbit.timeHours = e.orbit.reversed ? 18 + 0.5 : 6 - 0.5;
      }
    },
    "fn"
  ).name("Skip to Sunrise"), i.add(
    {
      fn: () => {
        e.orbit.timeHours = e.orbit.reversed ? 6 + 0.5 : 18 - 0.5;
      }
    },
    "fn"
  ).name("Skip to Sunset"), i.add(e.orbit, "reversed").name("Reverse Sun"), i.add(e.orbit, "sunsetAzimuthRadians").name("Sun Azimuth").min(0).max(2 * Math.PI), i.add(e.orbit, "inclinationRadians").name("Sun Inclination").min(0).max(Math.PI);
  const s = o.addFolder("Ocean").close();
  s.add(e.oceanSurfaceSettings, "gerstner").name("Gerstner Waves"), s.add(e.oceanSurfaceSettings, "fft").name("FFT Accelerated Waves"), s.add(e.time, "pause").name("Pause Waves"), s.add(e.oceanSurfaceSettings, "foamScale").name("Foam Scale").min(-30).max(30), s.add(e.oceanSurfaceSettings, "foamBias").name("Foam Bias").min(-1).max(1), s.add(e.fourierWavesSettings, "gravity").name("Gravity (m / s^2)").min(0.01).max(20), s.add(e.fourierWavesSettings, "waveSwell").name("Wave Swell").min(0.01).max(1), s.add(e.fourierWavesSettings, "windFetchMeters").name("Wind Fetch (m)").min(10 * 1e3).max(100 * 1e3), s.add(e.fourierWavesSettings, "windSpeedMetersPerSeconds").name("Wind Speed (m/s)").min(0.01).max(50);
  const n = o.addFolder("Debug").close(), u = [];
  n.add(e, "renderFromOceanPOV").name("Render from Ocean POV").onFinishChange((l) => {
    u.forEach((_) => {
      _.enable(!l);
    });
  }), u.push(
    n.add(e.debugCamera, "translationX").name("Camera X").min(-5e3).max(5e3),
    n.add(e.debugCamera, "translationY").name("Camera Y").min(10).max(5e3),
    n.add(e.debugCamera, "translationZ").name("Camera Z").min(-5e3).max(5e3),
    n.add(e.debugCamera, "eulerAnglesX").name("Camera Pitch").min(-Math.PI / 2 + a).max(Math.PI / 2 - a),
    n.add(e.debugCamera, "eulerAnglesY").name("Camera Yaw").min(-Math.PI).max(Math.PI),
    /* Non-zero camera roll breaks certain horizon calculations in shaders
    debugFolder
    	.add(this.settings.cameraSettings.debugCamera, "eulerAnglesZ")
    	.name("Camera Roll")
    	.min(-Math.PI)
    	.max(Math.PI),
    */
    n.add(
      {
        fn: () => {
          Object.assign(
            e.debugCamera,
            structuredClone(e.oceanCamera)
          ), n.controllers.forEach((l) => {
            l.updateDisplay();
          });
        }
      },
      "fn"
    ).name("Reset to match main camera")
  ), u.forEach((l) => l.enable(!1));
}
function re(o, e, t) {
  const r = new ie(o, { width: 1, height: 1 }), a = new xe(o);
  a.writeToGPU(o.queue);
  const i = new Te(
    o,
    ut,
    a
  ), s = o.features.has("float32-filterable"), n = new Me(
    o,
    lt,
    i.view,
    s,
    a
  ), u = new De(
    o,
    _t,
    i.view,
    n.view,
    s,
    a
  ), l = new Ue(
    o,
    ct,
    i.view,
    n.view,
    s,
    a
  ), _ = new Je(
    o,
    a,
    e.fftGridSizeLog2
  ), c = _.views(), d = new rt(
    o,
    a,
    r.formats,
    _.displacementMaps()
  ), v = new Ae(
    o,
    r.readGroupLayout,
    i.view,
    n.view,
    u.view,
    l.view,
    s,
    a
  ), g = new st(
    o,
    t
  ), m = r.colorRenderables();
  [
    [
      "Scene",
      new T(
        v.outputColor
      )
    ],
    [
      "GBufferColor",
      m.colorWithSurfaceWorldDepthInAlpha
    ],
    [
      "GBufferNormal",
      m.normalWithSurfaceFoamStrengthInAlpha
    ],
    [
      "AtmosphereTransmittanceLUT",
      new T(i.texture)
    ],
    [
      "AtmosphereMultiscatterLUT",
      new T(n.texture)
    ],
    [
      "AtmosphereSkyviewLUT",
      new T(u.texture)
    ],
    [
      "AtmosphereAerialPerspectiveLUT",
      new T(
        l.texture
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
  ].forEach(([p, x]) => {
    g.setOutput(o, p, x);
  });
  const h = o.createCommandEncoder({
    label: "Atmosphere LUT Initialization"
  });
  return i.record(h), n.record(h), o.queue.submit([h.finish()]), {
    aerialPerspectiveLUTPassResources: l,
    atmosphereCameraPassResources: v,
    fftWaveSpectrumResources: _,
    fullscreenQuadPassResources: g,
    gbuffer: r,
    globalUBO: a,
    multiscatterLUTPassResources: n,
    skyviewLUTPassResources: u,
    transmittanceLUTPassResources: i,
    waveSurfaceDisplacementPassResources: d
  };
}
function ae(o) {
  switch (o) {
    case "bgra8unorm":
      return "bgra8unorm-srgb";
    case "rgba8unorm":
      return "rgba8unorm-srgb";
    default:
      return console.warn(
        `Using unsupported canvas format "${o}", color encoding will be off.`
      ), o;
  }
}
function mt(o, e, t, r) {
  e.data.time.deltaTimeSeconds = t.time.deltaTimeSeconds, e.data.time.timeSeconds = t.time.timeSeconds;
  const a = 2 * Math.PI / 24, i = (12 - t.orbit.timeHours) * a, s = b.create(
    -Math.sin(t.orbit.sunsetAzimuthRadians),
    0,
    Math.cos(t.orbit.sunsetAzimuthRadians)
  ), n = b.create(
    Math.cos(t.orbit.sunsetAzimuthRadians) * Math.cos(t.orbit.inclinationRadians),
    Math.sin(t.orbit.inclinationRadians),
    Math.sin(t.orbit.sunsetAzimuthRadians) * Math.cos(t.orbit.inclinationRadians)
  ), u = b.add(
    b.scale(s, Math.sin(i)),
    b.scale(n, Math.cos(i))
  );
  b.scale(u, -1, e.data.light.forward);
  const l = 60 * Math.PI / 180, d = y.perspective(l, r, 0.1, 1e3), v = (g, m) => {
    const h = [
      m.translationX,
      m.translationY,
      m.translationZ,
      1
    ], p = y.rotationX(m.eulerAnglesX), x = y.rotationY(m.eulerAnglesY), f = y.rotationZ(m.eulerAnglesZ), w = y.mul(
      y.translation(M.create(...h)),
      y.mul(x, y.mul(p, f))
    ), D = y.inverse(w);
    Object.assign(g, {
      invProj: y.inverse(d),
      invView: w,
      projView: y.mul(d, D),
      position: M.create(...h),
      forward: M.create(
        ...y.multiply(w, M.create(0, 0, -1, 0))
      )
    });
  };
  v(e.data.ocean_camera, t.oceanCamera), v(
    e.data.camera,
    t.renderFromOceanPOV ? t.oceanCamera : t.debugCamera
  ), e.writeToGPU(o);
}
class pt {
  resources;
  unscaledResolution;
  renderOutputController;
  parameters;
  performance;
  performanceConfig;
  device;
  quit = !1;
  dummyFrameCounter;
  canvasTextureFormat;
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
    dt(e, this.parameters, () => {
      this.updateResizableResources();
    }), this.renderOutputController.setupUI(e), this.performance.setupUI(e);
  }
  setPerformanceConfig(e) {
    const t = F.get(e) ?? F.get("bad");
    if (t.fftGridSizeLog2 !== this.performanceConfig.fftGridSizeLog2 || t.oceanSurfaceVertexSize !== this.performanceConfig.oceanSurfaceVertexSize || t.renderScale !== this.performanceConfig.renderScale) {
      this.performanceConfig = t, this.resources = re(
        this.device,
        this.performanceConfig,
        ae(this.canvasTextureFormat)
      ), this.parameters.renderScale = this.performanceConfig.renderScale, this.updateResizableResources();
      for (const a of this.resources.fullscreenQuadPassResources.getAllTextureProperties())
        this.renderOutputController.setTextureProperties(a);
    }
  }
  setLowPerformanceMode(e) {
    const t = e ? "bad" : "good";
    this.setPerformanceConfig(t);
  }
  constructor(e, t) {
    this.device = e, this.canvasTextureFormat = t, this.performanceConfig = F.get("good"), this.renderOutputController = new Ge(), this.parameters = {
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
    }, this.resources = re(
      this.device,
      this.performanceConfig,
      ae(t)
    );
    for (const r of this.resources.fullscreenQuadPassResources.getAllTextureProperties())
      this.renderOutputController.setTextureProperties(r);
    this.unscaledResolution = { width: 128, height: 128 }, this.performance = new ot(this.device), this.dummyFrameCounter = 10;
  }
  tickTime(e) {
    const a = this.parameters.oceanSurfaceSettings.fft ? 100 : 60, i = this.parameters.time;
    i.pause ? i.deltaTimeSeconds = 0 : (i.deltaTimeSeconds = e / 1e3, i.timeSeconds += i.deltaTimeSeconds), i.timeSeconds -= Math.floor(i.timeSeconds / a) * a;
    const s = this.parameters.orbit;
    s.paused || (s.timeHours += (s.reversed ? -1 : 1) * s.timeSpeedupFactor * e / 36e5, s.timeHours = s.timeHours - Math.floor(s.timeHours / 24) * 24);
  }
  draw(e, t, r, a) {
    if (this.resources === void 0)
      return;
    if (this.dummyFrameCounter > 0) {
      this.dummyFrameCounter -= 1;
      return;
    }
    const i = e.createView({
      format: "bgra8unorm-srgb"
    });
    this.performance.beginFrame(a), this.tickTime(a), mt(
      this.device.queue,
      this.resources.globalUBO,
      this.parameters,
      t
    );
    const s = this.device.createCommandEncoder({
      label: "Main"
    });
    this.resources.fftWaveSpectrumResources.record(
      this.device,
      s,
      this.parameters.fourierWavesSettings,
      this.performance.queueTimestampInterval("FFTWaves")
    ), this.resources.waveSurfaceDisplacementPassResources.record(
      this.device,
      s,
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
      s,
      this.performance.queueTimestampInterval("SkyviewLUT")
    ), this.resources.aerialPerspectiveLUTPassResources.record(
      s,
      this.performance.queueTimestampInterval("AerialPerspectiveLUT")
    ), this.resources.atmosphereCameraPassResources.record(
      s,
      this.performance.queueTimestampInterval("AtmosphereCamera"),
      this.resources.gbuffer
    );
    const n = this.renderOutputController.current();
    this.resources.fullscreenQuadPassResources.record(
      this.device,
      s,
      i,
      n.tag,
      n.transform,
      this.performance.queueTimestampInterval("FullscreenQuad")
    ), this.performance.preSubmitCommands(s), this.device.queue.submit([s.finish()]), this.performance.postSubmitCommands();
  }
  updateResizableResources() {
    if (this.resources === void 0)
      return;
    const e = (n) => ({
      width: Math.floor(this.unscaledResolution.width * n),
      height: Math.floor(
        this.unscaledResolution.height * n
      )
    }), t = (n) => n.width < 8192 && n.height < 8192 && n.width * n.height * 16 < 268435456;
    let r = this.parameters.renderScale;
    const a = e(r);
    t(a) || (ne.slice().reverse().some((n) => {
      if (t(e(n)))
        return r = n, !0;
    }), console.warn(
      `During resize: Texture size (${a.width},${a.height}) exceeds WebGPU guaranteed limit (8192, 8192).
					Defaulting to highest possible render scale of ${r}`
    )), this.parameters.renderScale = r;
    const i = e(this.parameters.renderScale);
    console.log(
      `Resizing to (${i.width},${i.height})`
    ), this.resources.gbuffer = new ie(
      this.device,
      i,
      this.resources.gbuffer
    );
    const s = this.resources.gbuffer.colorRenderables();
    this.resources.fullscreenQuadPassResources.setOutput(
      this.device,
      "GBufferColor",
      s.colorWithSurfaceWorldDepthInAlpha
    ), this.resources.fullscreenQuadPassResources.setOutput(
      this.device,
      "GBufferNormal",
      s.normalWithSurfaceFoamStrengthInAlpha
    ), this.resources.atmosphereCameraPassResources.resize(
      i,
      this.device,
      this.resources.transmittanceLUTPassResources.view,
      this.resources.multiscatterLUTPassResources.view,
      this.resources.skyviewLUTPassResources.view,
      this.resources.aerialPerspectiveLUTPassResources.view
    ), this.resources.fullscreenQuadPassResources.setOutput(
      this.device,
      "Scene",
      new T(
        this.resources.atmosphereCameraPassResources.outputColor
      )
    );
    for (const n of this.resources.fullscreenQuadPassResources.getAllTextureProperties())
      this.renderOutputController.setTextureProperties(n);
  }
  handleResize(e, t) {
    this.unscaledResolution.width === e && this.unscaledResolution.height === t || (this.unscaledResolution.width = e, this.unscaledResolution.height = t, this.updateResizableResources());
  }
}
const ht = (o, e) => new pt(o, e);
export {
  ht as SkySeaAppConstructor
};
