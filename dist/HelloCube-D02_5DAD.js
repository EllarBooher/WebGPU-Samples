import { m as n } from "./wgpu-matrix.module-aHNSNER6.js";
import { P as x } from "./main-B-9XFVmh.js";
const b = `struct VertexOut {
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
`;
class w {
  quit = !1;
  device;
  pipeline;
  presentFormat;
  vertexBuffer;
  indexBuffer;
  indexCount;
  projViewModelBuffer;
  projViewModelBindGroup;
  supportedFeatures;
  destroy() {
    this.device.destroy();
  }
  presentationInterface() {
    return {
      device: this.device,
      format: this.presentFormat
    };
  }
  constructor(e, t) {
    this.device = e, this.presentFormat = t, this.supportedFeatures = e.features;
    const r = this.device.createShaderModule({
      code: b
    }), s = new Float32Array([
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
    ]), i = new Uint32Array([
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
    this.indexCount = i.length, this.vertexBuffer = this.device.createBuffer({
      size: s.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    }), this.device.queue.writeBuffer(
      this.vertexBuffer,
      0,
      s,
      0,
      s.length
    );
    const d = [
      {
        attributes: [
          { shaderLocation: 0, offset: 0, format: "float32x4" },
          { shaderLocation: 1, offset: 16, format: "float32x4" }
        ],
        arrayStride: 32,
        stepMode: "vertex"
      }
    ];
    this.indexBuffer = this.device.createBuffer({
      size: i.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    }), this.device.queue.writeBuffer(
      this.indexBuffer,
      0,
      i,
      0,
      i.length
    );
    const p = 64;
    this.projViewModelBuffer = this.device.createBuffer({
      size: p,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    const a = this.device.createBindGroupLayout({
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
      layout: a,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.projViewModelBuffer
          }
        }
      ]
    });
    const u = {
      vertex: {
        module: r,
        entryPoint: "vertex_main",
        buffers: d
      },
      fragment: {
        module: r,
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
        bindGroupLayouts: [a]
      })
    };
    this.pipeline = this.device.createRenderPipeline(u);
  }
  setupUI(e) {
    x.forEach((t) => {
      const r = this.supportedFeatures.has(t);
      e.add({ enabled: r }, "enabled").name(t).disable(!0);
    });
  }
  draw(e, t, r) {
    const s = e.createView(), i = 60 * Math.PI / 180, a = n.perspective(i, t, 0.1, 1e3), u = [3, 5, 10], h = [0, 0, 0], v = [0, 1, 0], B = n.lookAt(u, h, v), m = n.axisRotation([1, 1, 0], r / 1e3), f = n.mul(a, n.mul(B, m));
    this.device.queue.writeBuffer(
      this.projViewModelBuffer,
      0,
      f.buffer,
      f.byteOffset,
      f.byteLength
    );
    const l = this.device.createCommandEncoder(), g = { r: 0.5, g: 0.5, b: 0.5, a: 0 }, o = l.beginRenderPass({
      colorAttachments: [
        {
          clearValue: g,
          loadOp: "clear",
          storeOp: "store",
          view: s
        }
      ]
    });
    o.setPipeline(this.pipeline), o.setVertexBuffer(0, this.vertexBuffer), o.setIndexBuffer(
      this.indexBuffer,
      "uint32",
      0,
      this.indexBuffer.size
    ), o.setBindGroup(0, this.projViewModelBindGroup), o.drawIndexed(this.indexCount, 1, 0, 0, 0), o.end(), this.device.queue.submit([l.finish()]);
  }
}
const V = (c, e) => new w(c, e);
export {
  V as HelloCubeAppConstructor
};
