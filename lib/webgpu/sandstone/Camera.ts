import { Mat4, mat4, Vec4, vec4 } from "wgpu-matrix";
import { UBO } from "../sky-sea/util/UBO";

interface CameraParameters {
	cartesian: {
		translationX: number;
		translationY: number;
		translationZ: number;

		eulerAnglesX: number;
		eulerAnglesY: number;
	};
	polar: {
		eulerAnglesX: number;
		eulerAnglesY: number;

		distanceFromOrigin: number;
	};
	// Needs to be updated each frame
	aspectRatio: number;
	style: CameraStyle;
}

export const CameraStyle = ["Cartesian", "Polar"] as const;
export type CameraStyle = (typeof CameraStyle)[number];

const buildTranslationRotationCartesian = (
	cartesian: CameraParameters["cartesian"]
): { rotation: Mat4; translation: Vec4 } => {
	const translation = vec4.create(
		cartesian.translationX,
		cartesian.translationY,
		cartesian.translationZ,
		1
	);
	const rotationX = mat4.rotationX(cartesian.eulerAnglesX);
	const rotationY = mat4.rotationY(cartesian.eulerAnglesY);

	const rotation = mat4.mul(rotationY, rotationX);

	return { rotation, translation };
};
const buildTranslationRotationPolar = (
	polar: CameraParameters["polar"]
): { rotation: Mat4; translation: Vec4 } => {
	const rotationX = mat4.rotationX(polar.eulerAnglesX);
	const rotationY = mat4.rotationY(polar.eulerAnglesY);
	const rotation = mat4.mul(rotationY, rotationX);

	const translation = vec4.add(
		vec4.transformMat4(
			vec4.create(0.0, 0.0, polar.distanceFromOrigin, 1.0),
			rotation
		),
		vec4.create(6.4, 6.4, 6.4, 0.0)
	);

	return { rotation, translation };
};

export const Camera = Object.freeze({
	buildTransform: ({ polar, cartesian, style }: CameraParameters): Mat4 => {
		switch (style) {
			case "Cartesian": {
				const { translation, rotation } =
					buildTranslationRotationCartesian(cartesian);

				return mat4.mul(mat4.translation(translation), rotation);
			}
			case "Polar": {
				const { translation, rotation } =
					buildTranslationRotationPolar(polar);

				return mat4.mul(mat4.translation(translation), rotation);
			}
		}
	},
});

export class CameraUBO extends UBO {
	/**
	 * The data that will be packed and laid out in proper byte order in
	 * {@link packed}, to be written to the GPU.
	 */
	public readonly data: CameraParameters = {
		cartesian: {
			translationX: 0,
			translationY: 0,
			translationZ: 30,
			eulerAnglesX: 0,
			eulerAnglesY: 0,
		},
		polar: {
			eulerAnglesX: 0,
			eulerAnglesY: 0,
			distanceFromOrigin: 30.0,
		},
		aspectRatio: 1,
		style: "Polar",
	};

	constructor(device: GPUDevice) {
		const SIZEOF_CAMERA_UBO = 5 * 64;
		const BYTES_PER_FLOAT32 = 4;
		super(device, SIZEOF_CAMERA_UBO / BYTES_PER_FLOAT32, "Camera UBO");
	}

	protected override packed(): Float32Array {
		const vec2_zeroed = new Float32Array(2).fill(0.0);
		const mat2x4_zeroed = new Float32Array(4 * 2).fill(0.0);

		const transform = Camera.buildTransform(this.data);

		const view = mat4.inverse(transform);
		const fov = (60 * Math.PI) / 180;
		const far = 0.1;
		const near = 1000;

		const proj = mat4.perspective(fov, this.data.aspectRatio, near, far);
		const projView = mat4.mul(proj, view);
		const focalLength = 1.0;

		const translation = vec4.create(...mat4.getTranslation(transform), 1.0);

		return new Float32Array([
			...view,
			...projView,
			...translation,
			...vec2_zeroed,
			this.data.aspectRatio,
			focalLength,
			...mat2x4_zeroed,
			...proj,
			...transform,
		]);
	}
}
