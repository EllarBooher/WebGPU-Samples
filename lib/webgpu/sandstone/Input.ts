export interface KeyState {
	edge: boolean;
	down: boolean;
}
export const KeyCode = [
	"KeyW",
	"KeyA",
	"KeyS",
	"KeyD",
	"KeyR",
	"ControlLeft",
	"ControlRight",
	"Space",
	"ShiftLeft",
	"ShiftRight",
	"AltLeft",
	"AltRight",
] as const;
export type KeyCode = (typeof KeyCode)[number];

export const KeyState = Object.freeze({
	wasPressed: ({ down, edge }: KeyState) => down && edge,
	wasReleased: ({ down, edge }: KeyState) => !down && edge,
});
