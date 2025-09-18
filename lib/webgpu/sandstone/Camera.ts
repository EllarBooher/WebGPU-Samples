import { mat4, vec4 } from "wgpu-matrix";
import { UBO } from "../sky-sea/util/UBO";

interface CameraParameters {
	// Applied in order Y * X
	// X first, Y second
	eulerAnglesX: number;
	eulerAnglesY: number;
	distanceFromOrigin: number;
	// Needs to be updated each frame
	aspectRatio: number;
}
export class CameraUBO extends UBO {
	/**
	 * The data that will be packed and laid out in proper byte order in
	 * {@link packed}, to be written to the GPU.
	 */
	public readonly data: CameraParameters = {
		eulerAnglesX: 0,
		eulerAnglesY: 0,
		distanceFromOrigin: 30.0,
		aspectRatio: 1,
	};

	constructor(device: GPUDevice) {
		const SIZEOF_CAMERA_UBO = 5 * 64;
		const BYTES_PER_FLOAT32 = 4;
		super(device, SIZEOF_CAMERA_UBO / BYTES_PER_FLOAT32, "Camera UBO");
	}

	protected override packed(): Float32Array {
		const vec2_zeroed = new Float32Array(2).fill(0.0);
		const mat2x4_zeroed = new Float32Array(4 * 2).fill(0.0);

		const rotationX = mat4.rotationX(this.data.eulerAnglesX);
		const rotationY = mat4.rotationY(this.data.eulerAnglesY);
		const rotation = mat4.mul(rotationY, rotationX);

		const position = vec4.add(
			vec4.transformMat4(
				vec4.create(0.0, 0.0, this.data.distanceFromOrigin, 1.0),
				rotation
			),
			vec4.create(6.4, 6.4, 6.4, 0.0)
		);

		const transform = mat4.mul(
			mat4.translation(vec4.create(...position)),
			mat4.mul(rotationY, rotationX)
		);
		const view = mat4.inverse(transform);
		const fov = (60 * Math.PI) / 180;
		const far = 0.1;
		const near = 1000;

		const proj = mat4.perspective(fov, this.data.aspectRatio, near, far);
		const projView = mat4.mul(proj, view);
		const focalLength = 1.0;

		return new Float32Array([
			...view,
			...projView,
			...position,
			...vec2_zeroed,
			this.data.aspectRatio,
			focalLength,
			...mat2x4_zeroed,
			...proj,
			...transform,
		]);
	}
}
