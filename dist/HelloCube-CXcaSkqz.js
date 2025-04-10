var b = Object.defineProperty;
var w = (i, e, t) => e in i ? b(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var r = (i, e, t) => w(i, typeof e != "symbol" ? e + "" : e, t);
import { m as u } from "./wgpu-matrix.module-CE_7eKYK.js";
const P = `struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f
}
@group(0) @binding(0)
var<uniform> projViewModel: mat4x4<f32>;
@vertex
fn vertex_main(@location(0) position: vec4f,
               @location(1) color: vec4f) -> VertexOut
{
  var output : VertexOut;
  output.position = projViewModel * position;
  output.color = color;
  return output;
}
@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  return fragData.color;
}
`, V = /* @__PURE__ */ new Set([
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
  "dual-source-blending"
]);
class y {
  constructor(e, t) {
    r(this, "quit", !1);
    r(this, "device");
    r(this, "pipeline");
    r(this, "presentFormat");
    r(this, "vertexBuffer");
    r(this, "indexBuffer");
    r(this, "indexCount");
    r(this, "projViewModelBuffer");
    r(this, "projViewModelBindGroup");
    r(this, "supportedFeatures");
    this.device = e, this.presentFormat = t, this.supportedFeatures = e.features;
    const o = this.device.createShaderModule({
      code: P
    }), a = new Float32Array([
      -1,
      -1,
      -1,
      1,
      0,
      0,
      0,
      1,
      1,
      -1,
      -1,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      -1,
      1,
      1,
      1,
      0,
      1,
      -1,
      1,
      -1,
      1,
      0,
      1,
      0,
      1,
      -1,
      -1,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      -1,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      -1,
      1,
      1,
      1,
      0,
      1,
      1,
      1
    ]), s = new Uint32Array([
      // -Z
      0,
      1,
      2,
      0,
      2,
      3,
      // +X
      1,
      5,
      6,
      1,
      6,
      2,
      // +Y
      2,
      6,
      7,
      2,
      7,
      3,
      // +Z
      4,
      7,
      6,
      4,
      6,
      5,
      // -X
      0,
      3,
      7,
      0,
      7,
      4,
      // -Y
      0,
      4,
      5,
      0,
      5,
      1
    ]);
    this.indexCount = s.length, this.vertexBuffer = this.device.createBuffer({
      size: a.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    }), this.device.queue.writeBuffer(
      this.vertexBuffer,
      0,
      a,
      0,
      a.length
    );
    const d = [
      {
        attributes: [
          { shaderLocation: 0, offset: 0, format: "float32x4" },
          { shaderLocation: 1, offset: 16, format: "float32x4" }
        ],
        arrayStride: 2 * 16,
        stepMode: "vertex"
      }
    ];
    this.indexBuffer = this.device.createBuffer({
      size: s.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    }), this.device.queue.writeBuffer(
      this.indexBuffer,
      0,
      s,
      0,
      s.length
    );
    const l = 16 * 4;
    this.projViewModelBuffer = this.device.createBuffer({
      size: l,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    const c = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "uniform"
          }
        }
      ]
    });
    this.projViewModelBindGroup = this.device.createBindGroup({
      layout: c,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.projViewModelBuffer
          }
        }
      ]
    });
    const f = {
      vertex: {
        module: o,
        entryPoint: "vertex_main",
        buffers: d
      },
      fragment: {
        module: o,
        entryPoint: "fragment_main",
        targets: [
          {
            format: t
          }
        ]
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
        frontFace: "cw"
      },
      layout: this.device.createPipelineLayout({
        bindGroupLayouts: [c]
      })
    };
    this.pipeline = this.device.createRenderPipeline(f);
  }
  destroy() {
    this.device.destroy();
  }
  presentationInterface() {
    return {
      device: this.device,
      format: this.presentFormat
    };
  }
  setupUI(e) {
    V.forEach((t) => {
      const o = this.supportedFeatures.has(t);
      e.add({ enabled: o }, "enabled").name(t).disable(!0);
    });
  }
  draw(e, t, o) {
    const a = e.createView(), s = 60 * Math.PI / 180, c = u.perspective(s, t, 0.1, 1e3), f = [3, 5, 10], m = [0, 0, 0], v = [0, 1, 0], B = u.lookAt(f, m, v), g = u.axisRotation([1, 1, 0], o / 1e3), p = u.mul(c, u.mul(B, g));
    this.device.queue.writeBuffer(
      this.projViewModelBuffer,
      0,
      p,
      0,
      p.length
    );
    const h = this.device.createCommandEncoder(), x = { r: 0.5, g: 0.5, b: 0.5, a: 0 }, n = h.beginRenderPass({
      colorAttachments: [
        {
          clearValue: x,
          loadOp: "clear",
          storeOp: "store",
          view: a
        }
      ]
    });
    n.setPipeline(this.pipeline), n.setVertexBuffer(0, this.vertexBuffer), n.setIndexBuffer(
      this.indexBuffer,
      "uint32",
      0,
      this.indexBuffer.size
    ), n.setBindGroup(0, this.projViewModelBindGroup), n.drawIndexed(this.indexCount, 1, 0, 0, 0), n.end(), this.device.queue.submit([h.finish()]);
  }
}
const G = (i, e) => new y(i, e);
export {
  G as HelloCubeAppConstructor
};
