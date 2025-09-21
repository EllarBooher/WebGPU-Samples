import { Mat4, mat4, vec4 } from "wgpu-matrix";
import { KeyCode, KeyState } from "./Input";

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

export interface Camera {
	Cartesian: {
		translationX: number;
		translationY: number;
		translationZ: number;

		eulerAnglesX: number;
		eulerAnglesY: number;
	};
	Polar: {
		eulerAnglesX: number;
		eulerAnglesY: number;

		distanceFromOrigin: number;
	};
	style: CameraStyle;
}
export const Camera = Object.freeze({
	build: (): Camera => {
		return {
			Cartesian: {
				translationX: 0,
				translationY: 0,
				translationZ: 30,
				eulerAnglesX: 0,
				eulerAnglesY: 0,
			},
			Polar: {
				eulerAnglesX: 0,
				eulerAnglesY: 0,
				distanceFromOrigin: 30.0,
			},
			style: "Polar",
		};
	},
	buildTransform: ({ Polar, Cartesian, style }: Camera): Mat4 => {
		switch (style) {
			case "Cartesian": {
				const translation = vec4.create(
					Cartesian.translationX,
					Cartesian.translationY,
					Cartesian.translationZ,
					1
				);
				const rotationX = mat4.rotationX(Cartesian.eulerAnglesX);
				const rotationY = mat4.rotationY(Cartesian.eulerAnglesY);

				const rotation = mat4.mul(rotationY, rotationX);

				return mat4.mul(mat4.translation(translation), rotation);
			}
			case "Polar": {
				const rotationX = mat4.rotationX(Polar.eulerAnglesX);
				const rotationY = mat4.rotationY(Polar.eulerAnglesY);
				const rotation = mat4.mul(rotationY, rotationX);

				const translation = vec4.add(
					vec4.transformMat4(
						vec4.create(0.0, 0.0, Polar.distanceFromOrigin, 1.0),
						rotation
					),
					vec4.create(6.4, 6.4, 6.4, 0.0)
				);

				return mat4.mul(mat4.translation(translation), rotation);
			}
		}
	},
	update: (
		camera: Camera,
		inputState: Record<KeyCode, KeyState>,
		deltaTimeMilliseconds: number
	): void => {
		switch (camera.style) {
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

					const cameraTransform = Camera.buildTransform(camera);

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
							camera.Cartesian.eulerAnglesX +
							sensEulerX *
								deltaTimeMilliseconds *
								movementAxes[1];
						camera.Cartesian.eulerAnglesX = Math.max(
							Math.min(value, max),
							min
						);
					}
					{
						const [min, max] = CAMERA_PARAMETER_BOUNDS.eulerAnglesY;
						let value =
							camera.Cartesian.eulerAnglesY +
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

						camera.Cartesian.eulerAnglesY = Math.max(
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
							camera.Cartesian.translationX +
							sensDistance *
								deltaTimeMilliseconds *
								movementAxes[0];
						camera.Cartesian.translationX = Math.max(
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
							camera.Cartesian.translationY +
							sensDistance *
								deltaTimeMilliseconds *
								movementAxes[1];
						camera.Cartesian.translationY = Math.max(
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
							camera.Cartesian.translationZ +
							sensDistance *
								deltaTimeMilliseconds *
								movementAxes[2];
						camera.Cartesian.translationZ = Math.max(
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
						camera.Polar.eulerAnglesX +
						sensEulerX * deltaTimeMilliseconds * movementAxes[1];
					camera.Polar.eulerAnglesX = Math.max(
						Math.min(value, max),
						min
					);
				}
				{
					const [min, max] = CAMERA_PARAMETER_BOUNDS.eulerAnglesY;
					let value =
						camera.Polar.eulerAnglesY +
						sensEulerY * deltaTimeMilliseconds * movementAxes[0];

					if (value > max) {
						value -= Math.ceil(value / (max - min)) * (max - min);
					} else if (value < min) {
						value +=
							Math.ceil(Math.abs(value / (max - min))) *
							(max - min);
					}

					camera.Polar.eulerAnglesY = Math.max(
						Math.min(max, value),
						min
					);
				}
				{
					const [min, max] =
						CAMERA_PARAMETER_BOUNDS.distanceFromOrigin;
					const value =
						camera.Polar.distanceFromOrigin +
						sensDistance * deltaTimeMilliseconds * movementAxes[2];
					camera.Polar.distanceFromOrigin = Math.max(
						Math.min(max, value),
						min
					);
				}
				break;
			}
		}
	},
});
