import { RendererApp, RendererAppConstructor } from "../RendererApp";
import UVRainbowComputePak from "../../shaders/shared/uv_rainbow_compute.wgsl";
import { FullscreenQuadPassResources } from "../sky-sea/FullscreenQuad";
import { RenderOutputTexture } from "../sky-sea/RenderOutputController";

interface Extent2D {
	width: number;
	height: number;
}

interface OutputColorResources {
	texture: RenderOutputTexture;
	destroy: () => void;
}

const FORMAT = "rgba16float";

const buildOutputColorResources = (
	device: GPUDevice,
	resolution: Extent2D,
	label: string
): OutputColorResources => {
	const texture = device.createTexture({
		size: resolution,
		format: FORMAT,
		usage:
			GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
		label: `${label} OutputColorResources.texture`,
	});

	return {
		texture: new RenderOutputTexture(texture),
		destroy: (): void => {
			texture.destroy();
		},
	};
};

export const SandstoneAppConstructor: RendererAppConstructor = (
	device,
	presentFormat
): RendererApp => {
	console.log(presentFormat);

	const group0Layout = device.createBindGroupLayout({
		entries: [
			{
				binding: 0,
				visibility: GPUShaderStage.COMPUTE,
				storageTexture: { format: FORMAT },
			},
		],
		label: `Sandstone Group0`,
	});

	const shaderModule = device.createShaderModule({
		code: UVRainbowComputePak,
		label: "Sandstone UVRainbowComputePak",
	});
	const pipelineLayout = device.createPipelineLayout({
		bindGroupLayouts: [group0Layout],
		label: "Sandstone",
	});
	const pipeline = device.createComputePipeline({
		compute: { module: shaderModule },
		layout: pipelineLayout,
		label: "Sandstone",
	});

	const resolution = { width: 128.0, height: 128.0 };
	const outputColor = buildOutputColorResources(
		device,
		resolution,
		"Sandstone"
	);
	const group0 = device.createBindGroup({
		entries: [{ binding: 0, resource: outputColor.texture.view }],
		layout: pipeline.getBindGroupLayout(0),
		label: "Sandstone",
	});

	const permanentResources = {
		shaderModule,
		pipelineLayout,
		pipeline,
		fullscreenQuad: new FullscreenQuadPassResources(device, FORMAT),
	};
	const transientResources = {
		outputColor,
		group0,
	};
	let trashcan: { frame: number; destroy: () => void }[] = [];
	let frame = 0;

	const handleResize = (newWidth: number, newHeight: number): void => {
		if (resolution.width === newWidth && resolution.height === newHeight) {
			return;
		}

		resolution.width = newWidth;
		resolution.height = newHeight;

		trashcan.push({
			frame,
			destroy: transientResources.outputColor.destroy,
		});
		const outputColor = buildOutputColorResources(
			device,
			resolution,
			`Sandstone frame:${frame}`
		);

		transientResources.outputColor = outputColor;
		transientResources.group0 = device.createBindGroup({
			entries: [{ binding: 0, resource: outputColor.texture.view }],
			layout: pipeline.getBindGroupLayout(0),
			label: "Sandstone",
		});
		permanentResources.fullscreenQuad.setOutput(
			device,
			"Scene",
			outputColor.texture
		);
	};

	const draw = (presentTexture: GPUTexture): void => {
		const main = device.createCommandEncoder({
			label: "Sandstone Main",
		});

		const pass = main.beginComputePass({ label: "Sandstone Compute Pass" });
		const { width, height, depthOrArrayLayers } =
			transientResources.outputColor.texture.extent;
		pass.setPipeline(permanentResources.pipeline);
		pass.setBindGroup(0, transientResources.group0);
		pass.dispatchWorkgroups(
			Math.ceil(width / 16),
			Math.ceil(height / 16),
			Math.ceil(depthOrArrayLayers / 1)
		);

		pass.end();

		permanentResources.fullscreenQuad.record(
			device,
			main,
			presentTexture.createView(),
			"Scene",
			{
				arrayLayer: 0,
				channelMasks: { r: true, g: true, b: true },
				colorGain: { r: 1.0, g: 1.0, b: 1.0 },
				flip: false,
				mipLevel: 0,
				swapBARG: false,
			}
		);

		const latestFinishedFrame = frame;
		device.queue.submit([main.finish()]);
		device.queue
			.onSubmittedWorkDone()
			.then(() => {
				const newTrashcan = [];
				for (const trash of trashcan) {
					if (trash.frame >= latestFinishedFrame) {
						newTrashcan.push(trash);
						continue;
					}

					trash.destroy();
				}
				trashcan = newTrashcan;
			})
			.catch((reason) => {
				console.error(reason);
			});

		frame = frame + 1;
	};

	const destroy = (): void => {
		transientResources.outputColor.destroy();
		device.destroy();
	};

	return {
		quit: false,
		presentationInterface: () => ({ device, format: FORMAT }),
		draw,
		destroy,
		handleResize,
	};
};
