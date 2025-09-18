// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const buildSizeOf = () => {
	const f32 = 4;
	const u32 = 4;
	const vec2_u32 = 2 * u32;
	const vec4_f32 = 4 * f32;
	const mat3x3_f32 = 48;
	const particle = 3 * vec4_f32;
	const gridPoint = vec4_f32;
	const pointNeighborhood = vec4_f32 + vec4_f32 * 5;
	const drawIndexedIndirectParameters = 2 * vec4_f32;

	return {
		f32,
		u32,
		vec2_u32,
		vec4_f32,
		mat3x3_f32,
		drawIndexedIndirectParameters,
		particle,
		gridPoint,
		pointNeighborhood,
	};
};
export const SIZEOF = Object.freeze(buildSizeOf());
