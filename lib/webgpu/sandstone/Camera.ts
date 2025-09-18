import { Mat4, mat4, vec4 } from "wgpu-matrix";
import { UBO } from "../sky-sea/util/UBO";
import { KeyCode, KeyState } from "./Input";

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

const EULER_ANGLES_X_SAFETY_MARGIN = 0.01;
export const CAMERA_PARAMETER_BOUNDS = {
	distanceFromOrigin: [0.0, 100.0],
	eulerAnglesX: [
		-Math.PI / 2.0 + EULER_ANGLES_X_SAFETY_MARGIN,
		Math.PI / 2.0 - EULER_ANGLES_X_SAFETY_MARGIN,
	],
	eulerAnglesY: [-Math.PI, Math.PI],
};

export const Camera = Object.freeze({
	buildTransform: ({ polar, cartesian, style }: CameraParameters): Mat4 => {
		switch (style) {
			case "Cartesian": {
				const translation = vec4.create(
					cartesian.translationX,
					cartesian.translationY,
					cartesian.translationZ,
					1
				);
				const rotationX = mat4.rotationX(cartesian.eulerAnglesX);
				const rotationY = mat4.rotationY(cartesian.eulerAnglesY);

				const rotation = mat4.mul(rotationY, rotationX);

				return mat4.mul(mat4.translation(translation), rotation);
			}
			case "Polar": {
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

				return mat4.mul(mat4.translation(translation), rotation);
			}
		}
	},
	update: (
		parameters: CameraParameters,
		inputState: Record<KeyCode, KeyState>,
		deltaTimeMilliseconds: number
	): void => {
		switch (parameters.style) {
			case "Cartesian": {
				const movementAxes: [number, number, number] = [0, 0, 0];

				const sensDistance = 1 / 20;
				const sensEulerX = 1 / 1000;
				const sensEulerY = 1 / 800;

				const rotationMode = inputState.Space.down;
				if (rotationMode) {
					if (inputState.KeyA.down) {
						movementAxes[0] += 1;
					}
					if (inputState.KeyD.down) {
						movementAxes[0] -= 1;
					}
					if (inputState.KeyW.down) {
						movementAxes[1] += 1;
					}
					if (inputState.KeyS.down) {
						movementAxes[1] -= 1;
					}
				} else {
					if (inputState.KeyA.down) {
						movementAxes[0] -= 1;
					}
					if (inputState.KeyD.down) {
						movementAxes[0] += 1;
					}
					if (inputState.KeyW.down) {
						movementAxes[2] -= 1;
					}
					if (inputState.KeyS.down) {
						movementAxes[2] += 1;
					}

					const cameraTransform = Camera.buildTransform(parameters);

					const cameraRight = vec4.transformMat4(
						vec4.create(1.0, 0.0, 0.0, 0.0),
						cameraTransform
					);
					const cameraForward = vec4.transformMat4(
						vec4.create(0.0, 0.0, 1.0, 0.0),
						cameraTransform
					);
					const x =
						movementAxes[0] * cameraRight[0] +
						movementAxes[2] * cameraForward[0];
					const y =
						movementAxes[0] * cameraRight[1] +
						movementAxes[2] * cameraForward[1];
					const z =
						movementAxes[0] * cameraRight[2] +
						movementAxes[2] * cameraForward[2];
					// console.log(cameraRight);
					// console.log(cameraForward);

					movementAxes[0] = x;
					movementAxes[1] = y;
					movementAxes[2] = z;
				}

				if (inputState.ShiftLeft.down || inputState.ShiftRight.down) {
					movementAxes[0] *= 0.2;
					movementAxes[1] *= 0.2;
					movementAxes[2] *= 0.2;
				}

				if (rotationMode) {
					{
						const [min, max] = CAMERA_PARAMETER_BOUNDS.eulerAnglesX;
						const value =
							parameters.cartesian.eulerAnglesX +
							sensEulerX *
								deltaTimeMilliseconds *
								movementAxes[1];
						parameters.cartesian.eulerAnglesX = Math.max(
							Math.min(value, max),
							min
						);
					}
					{
						const [min, max] = CAMERA_PARAMETER_BOUNDS.eulerAnglesY;
						let value =
							parameters.cartesian.eulerAnglesY +
							sensEulerY *
								deltaTimeMilliseconds *
								movementAxes[0];

						if (value > max) {
							value -=
								Math.ceil(value / (max - min)) * (max - min);
						} else if (value < min) {
							value +=
								Math.ceil(Math.abs(value / (max - min))) *
								(max - min);
						}

						parameters.cartesian.eulerAnglesY = Math.max(
							Math.min(max, value),
							min
						);
					}
				} else {
					{
						const [min, max] = [
							-CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1],
							CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1],
						];
						const value =
							parameters.cartesian.translationX +
							sensDistance *
								deltaTimeMilliseconds *
								movementAxes[0];
						parameters.cartesian.translationX = Math.max(
							Math.min(value, max),
							min
						);
					}
					{
						const [min, max] = [
							-CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1],
							CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1],
						];
						const value =
							parameters.cartesian.translationY +
							sensDistance *
								deltaTimeMilliseconds *
								movementAxes[1];
						parameters.cartesian.translationY = Math.max(
							Math.min(value, max),
							min
						);
					}
					{
						const [min, max] = [
							-CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1],
							CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1],
						];
						const value =
							parameters.cartesian.translationZ +
							sensDistance *
								deltaTimeMilliseconds *
								movementAxes[2];
						parameters.cartesian.translationZ = Math.max(
							Math.min(value, max),
							min
						);
					}
				}

				break;
			}
			case "Polar": {
				const movementAxes: [number, number, number] = [0, 0, 0];

				const sensDistance = 1 / 20;
				const sensEulerX = 1 / 1000;
				const sensEulerY = 1 / 800;

				if (inputState.KeyW.down && !inputState.Space.down) {
					movementAxes[1] -= 1;
				}
				if (inputState.KeyS.down && !inputState.Space.down) {
					movementAxes[1] += 1;
				}
				if (inputState.KeyA.down) {
					movementAxes[0] -= 1;
				}
				if (inputState.KeyD.down) {
					movementAxes[0] += 1;
				}
				if (inputState.KeyW.down && inputState.Space.down) {
					movementAxes[2] -= 1;
				}
				if (inputState.KeyS.down && inputState.Space.down) {
					movementAxes[2] += 1;
				}

				if (inputState.ShiftLeft.down || inputState.ShiftRight.down) {
					movementAxes[0] *= 0.2;
					movementAxes[1] *= 0.2;
					movementAxes[2] *= 0.2;
				}

				{
					const [min, max] = CAMERA_PARAMETER_BOUNDS.eulerAnglesX;
					const value =
						parameters.polar.eulerAnglesX +
						sensEulerX * deltaTimeMilliseconds * movementAxes[1];
					parameters.polar.eulerAnglesX = Math.max(
						Math.min(value, max),
						min
					);
				}
				{
					const [min, max] = CAMERA_PARAMETER_BOUNDS.eulerAnglesY;
					let value =
						parameters.polar.eulerAnglesY +
						sensEulerY * deltaTimeMilliseconds * movementAxes[0];

					if (value > max) {
						value -= Math.ceil(value / (max - min)) * (max - min);
					} else if (value < min) {
						value +=
							Math.ceil(Math.abs(value / (max - min))) *
							(max - min);
					}

					parameters.polar.eulerAnglesY = Math.max(
						Math.min(max, value),
						min
					);
				}
				{
					const [min, max] =
						CAMERA_PARAMETER_BOUNDS.distanceFromOrigin;
					const value =
						parameters.polar.distanceFromOrigin +
						sensDistance * deltaTimeMilliseconds * movementAxes[2];
					parameters.polar.distanceFromOrigin = Math.max(
						Math.min(max, value),
						min
					);
				}
				break;
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
