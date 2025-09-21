import { mat4, vec4 } from "wgpu-matrix";
import { Camera } from "./Camera";
import { SIZEOF } from "./Sizeof";

interface GlobalUniforms {
	buffer: GPUBuffer;
}

interface GlobalUniformsData {
	camera: Camera;
	aspectRatio: number;
	debugParticleIdx: number;
}

export const build = (device: GPUDevice): GlobalUniforms => {
	return {
		buffer: device.createBuffer({
			size: SIZEOF.globalUniforms,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
			label: "GlobalUniforms",
		}),
	};
};

export const writeToGPU = (
	globalUniforms: GlobalUniforms,
	data: GlobalUniformsData,
	queue: GPUQueue
): void => {
	const offsets = {
		camera: 0,
		debugParticleIdx: SIZEOF.cameraUBO,
	};

	const vec2_zeroed = new Float32Array(2).fill(0.0);
	const mat2x4_zeroed = new Float32Array(4 * 2).fill(0.0);
	const zeroes_u32 = new Uint32Array(4 * 4).fill(0);

	{
		const transform = Camera.buildTransform(data.camera);

		const view = mat4.inverse(transform);
		const fov = (60 * Math.PI) / 180;
		const far = 0.1;
		const near = 1000;

		const proj = mat4.perspective(fov, data.aspectRatio, near, far);
		const projView = mat4.mul(proj, view);
		const focalLength = 1.0;

		const translation = vec4.create(...mat4.getTranslation(transform), 1.0);

		queue.writeBuffer(
			globalUniforms.buffer,
			offsets.camera,
			new Float32Array([
				...view,
				...projView,
				...translation,
				...vec2_zeroed,
				data.aspectRatio,
				focalLength,
				...mat2x4_zeroed,
				...proj,
				...transform,
			])
		);
	}

	{
		queue.writeBuffer(
			globalUniforms.buffer,
			offsets.debugParticleIdx,
			new Uint32Array([...zeroes_u32.slice(0, 3), data.debugParticleIdx])
		);
	}
};
