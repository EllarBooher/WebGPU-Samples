// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const buildSizeOf = () => {
	const f32 = 4;
	const u32 = 4;
	const vec2_u32 = 2 * u32;
	const vec4_f32 = 4 * f32;
	const vec3_u32 = 3 * u32;
	const vec4_u32 = 4 * u32;
	const particle = 13 * vec4_f32;
	const gridPoint = vec4_f32;
	const pointNeighborhood = vec4_f32 + vec4_f32 * 5;
	const drawIndexedIndirectParameters = 2 * vec4_f32;
	const dispatchIndirectParameters = vec4_u32;

	const mpmGridPoint = 2 * vec4_f32;
	const mpmGridHeader = vec4_f32;

	const mat3x3_f32 = 3 * vec4_f32;
	const mat4x4_f32 = 4 * vec4_f32;

	const cameraUBO = 5 * mat4x4_f32;
	const globalUniforms = cameraUBO + vec4_u32;

	return {
		f32,
		u32,
		vec2_u32,
		vec4_f32,
		vec3_u32,
		vec4_u32,
		mat3x3_f32,
		drawIndexedIndirectParameters,
		dispatchIndirectParameters,
		particle,
		gridPoint,
		cameraUBO,
		globalUniforms,
		pointNeighborhood,
		mpmGridPoint,
		mpmGridHeader,
	};
};
export const SIZEOF = Object.freeze(buildSizeOf());
