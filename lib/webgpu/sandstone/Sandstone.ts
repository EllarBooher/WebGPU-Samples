import { RendererApp, RendererAppConstructor } from "../RendererApp";
import * as LilGUI from "lil-gui";
import { FullscreenQuadPassResources } from "../sky-sea/FullscreenQuad";
import { RenderOutputTexture } from "../sky-sea/RenderOutputController";
import { Camera, CAMERA_PARAMETER_BOUNDS, CameraStyle } from "./Camera";
import { WorldAxesPipeline } from "./pipelines/WorldAxes";
import { KeyCode, KeyState } from "./Input";
import {
	PARTICLE_COUNT,
	PointNeighborhoodBuffer,
	buildParticles,
	writeParticles,
} from "./Particles";
import * as ParticleMeshifyPipeline from "./pipelines/ParticleMeshify";
import {
	ParticleDrawPipeline,
	ParticleDrawPipelineDrawStyle,
} from "./pipelines/ParticleDraw";

interface Extent2D {
	width: number;
	height: number;
}

interface OutputColorResources {
	color: RenderOutputTexture;
	depth: RenderOutputTexture;
	destroy: () => void;
}

const COLOR_FORMAT: GPUTextureFormat = "rgba16float";
const DEPTH_FORMAT: GPUTextureFormat = "depth32float";
const buildOutputColorResources = (
	device: GPUDevice,
	resolution: Extent2D,
	label: string
): OutputColorResources => {
	const texture = device.createTexture({
		size: resolution,
		format: COLOR_FORMAT,
		usage:
			GPUTextureUsage.STORAGE_BINDING |
			GPUTextureUsage.TEXTURE_BINDING |
			GPUTextureUsage.RENDER_ATTACHMENT,
		label: `${label} OutputColorResources.color`,
	});
	const depth = device.createTexture({
		size: resolution,
		format: DEPTH_FORMAT,
		usage:
			GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
		label: `${label} OutputColorResources.depth`,
	});

	return {
		color: new RenderOutputTexture(texture),
		depth: new RenderOutputTexture(depth),
		destroy: (): void => {
			texture.destroy();
			depth.destroy();
		},
	};
};

/**
 * Uses clear values to draw flat values into a color & depth target, with no pipelines.
 */
const drawBackground = ({
	commandEncoder,
	color,
	depth,
	clearValueColor,
}: {
	commandEncoder: GPUCommandEncoder;
	color: RenderOutputTexture;
	depth: RenderOutputTexture;
	clearValueColor: GPUColor;
}): void => {
	const DEPTH_CLEAR_VALUE = 0.0;
	commandEncoder
		.beginRenderPass({
			label: "Draw Background",
			colorAttachments: [
				{
					loadOp: "clear",
					storeOp: "store",
					view: color.view,
					clearValue: clearValueColor,
				},
			],
			depthStencilAttachment: {
				view: depth.view,
				depthClearValue: DEPTH_CLEAR_VALUE,
				depthLoadOp: "clear",
				depthStoreOp: "store",
			},
		})
		.end();
};

const RenderOutputCategory = [
	"Debug Particles",
	"Meshify Particles",
	"Particle Graph",
] as const;
type RenderOutputCategory = (typeof RenderOutputCategory)[number];

export const SandstoneAppConstructor: RendererAppConstructor = (
	device,
	_presentFormat
): RendererApp => {
	const resolution = { width: 128.0, height: 128.0 };
	const outputColor = buildOutputColorResources(
		device,
		resolution,
		"Sandstone"
	);

	const camera = Camera.build(device);

	const debugNeighborhood = PointNeighborhoodBuffer.build(device);
	PointNeighborhoodBuffer.writeToGPU({
		device,
		neighborhood: debugNeighborhood,
		particleIndex: 0,
	});

	const pipelineParameters: {
		output: RenderOutputCategory;
		debugParticleIdx: number;
	} = {
		output: "Debug Particles",
		debugParticleIdx: 0,
	};

	const particles = buildParticles(device);
	writeParticles(device, particles);

	const permanentResources = {
		particleDrawPipeline: ParticleDrawPipeline.build({
			device,
			colorFormat: COLOR_FORMAT,
			depthFormat: DEPTH_FORMAT,
			particles,
			cameraUBO: camera.buffer,
			debugNeighborhoodBuffer: debugNeighborhood,
		}),
		particleMeshifyPipeline: ParticleMeshifyPipeline.build(
			device,
			COLOR_FORMAT,
			DEPTH_FORMAT,
			particles,
			camera.buffer,
			debugNeighborhood
		),
		worldAxesPipeline: WorldAxesPipeline.build({
			device,
			cameraUBO: camera.buffer,
			colorFormat: COLOR_FORMAT,
			depthFormat: DEPTH_FORMAT,
		}),
		fullscreenQuad: new FullscreenQuadPassResources(device, COLOR_FORMAT),
		camera,
		particles,
	};

	const transientResources = {
		outputColor,
	};
	const inputState: Record<KeyCode, KeyState> = {
		KeyW: { edge: false, down: false },
		KeyA: { edge: false, down: false },
		KeyS: { edge: false, down: false },
		KeyD: { edge: false, down: false },
		KeyR: { edge: false, down: false },
		Space: { edge: false, down: false },
		ControlLeft: { edge: false, down: false },
		ControlRight: { edge: false, down: false },
		ShiftLeft: { edge: false, down: false },
		ShiftRight: { edge: false, down: false },
		AltLeft: { edge: false, down: false },
		AltRight: { edge: false, down: false },
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
		permanentResources.fullscreenQuad.setOutput(
			device,
			"Scene",
			outputColor.color
		);
	};

	let done = false;

	const uiFunctions = {
		resetCamera: (): void => {
			permanentResources.camera.style = "Polar";
			permanentResources.camera.Polar.eulerAnglesX = -0.5;
			permanentResources.camera.Polar.eulerAnglesY = 0.5;
			permanentResources.camera.Polar.distanceFromOrigin = 25.0;
		},
		randomizeParticles: (): void => {
			writeParticles(device, permanentResources.particles);
		},
	};
	uiFunctions.resetCamera();

	let debugParticleController: LilGUI.Controller | undefined = undefined;

	let UICallbacks:
		| { swapCameraStyle: (style: CameraStyle) => void }
		| undefined = undefined;
	const setupUI = (gui: LilGUI.GUI): void => {
		const folders = {
			camera: gui.addFolder("Camera").open(),
			pipeline: gui.addFolder("Pipeline").open(),
			particles: gui.addFolder("Particles").open(),
		};

		const label = document.createElement("p");
		label.innerHTML =
			"Mouse Scroll wheel controls camera zoom. Keyboard keys augment this when held: <br/><br/> Control : Controls camera yaw <br/> Shift : Controls camera pitch <br/> Alt : Decreases scroll sensitivity";
		label.style = "margin: 8px";
		folders.camera.domElement.appendChild(label);

		const cameraControllers: Record<
			CameraStyle | "All",
			LilGUI.Controller[]
		> = {
			All: [],
			Cartesian: [],
			Polar: [],
		};
		const revealControllers = (style: CameraStyle): void => {
			for (const controller of [
				...cameraControllers.Cartesian,
				...cameraControllers.Polar,
			]) {
				controller.hide();
			}
			for (const controller of cameraControllers[style]) {
				controller.show();
			}
		};

		folders.camera
			.add(permanentResources.camera, "style")
			.name("Camera Style")
			.options(CameraStyle)
			.onFinishChange(revealControllers)
			.onFinishChange(() => {
				console.log("changed");
			})
			.listen();
		cameraControllers.Polar = [
			folders.camera
				.add(permanentResources.camera.Polar, "distanceFromOrigin")
				.name("Camera Radius")
				.min(CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[0])
				.max(CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1])
				.listen(),
			folders.camera
				.add(permanentResources.camera.Polar, "eulerAnglesX")
				.name("Camera Pitch")
				.min(CAMERA_PARAMETER_BOUNDS.eulerAnglesX[0])
				.max(CAMERA_PARAMETER_BOUNDS.eulerAnglesX[1])
				.listen(),
			folders.camera
				.add(permanentResources.camera.Polar, "eulerAnglesY")
				.name("Camera Yaw")
				.min(CAMERA_PARAMETER_BOUNDS.eulerAnglesY[0])
				.max(CAMERA_PARAMETER_BOUNDS.eulerAnglesY[1])
				.listen(),
		];
		cameraControllers.Cartesian = [
			folders.camera
				.add(permanentResources.camera.Cartesian, "translationX")
				.name("Translation X")
				.min(-CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1])
				.max(CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1])
				.listen(),
			folders.camera
				.add(permanentResources.camera.Cartesian, "translationY")
				.name("Translation Y")
				.min(-CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1])
				.max(CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1])
				.listen(),
			folders.camera
				.add(permanentResources.camera.Cartesian, "translationZ")
				.name("Translation Z")
				.min(-CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1])
				.max(CAMERA_PARAMETER_BOUNDS.distanceFromOrigin[1])
				.listen(),
			folders.camera
				.add(permanentResources.camera.Cartesian, "eulerAnglesX")
				.name("Camera Pitch")
				.min(CAMERA_PARAMETER_BOUNDS.eulerAnglesX[0])
				.max(CAMERA_PARAMETER_BOUNDS.eulerAnglesX[1])
				.listen(),
			folders.camera
				.add(permanentResources.camera.Cartesian, "eulerAnglesY")
				.name("Camera Yaw")
				.min(CAMERA_PARAMETER_BOUNDS.eulerAnglesY[0])
				.max(CAMERA_PARAMETER_BOUNDS.eulerAnglesY[1])
				.listen(),
		];
		revealControllers(permanentResources.camera.style);

		folders.camera.add(uiFunctions, "resetCamera").name("Reset Camera");

		folders.pipeline
			.add(pipelineParameters, "output")
			.options(RenderOutputCategory)
			.name("Debug Particles");
		folders.pipeline
			.add(
				permanentResources.particleDrawPipeline.settings,
				"drawSurfaceOnly"
			)
			.name("Draw Surface Only");
		folders.pipeline
			.add(permanentResources.particleDrawPipeline.settings, "drawStyle")
			.options(ParticleDrawPipelineDrawStyle)
			.name("Draw Style");
		debugParticleController = folders.pipeline
			.add(pipelineParameters, "debugParticleIdx")
			.name("Debug Particle Index")
			.min(0)
			.max(PARTICLE_COUNT)
			.step(1)
			.listen()
			.onFinishChange(() => {
				permanentResources.particles.meshDirty = true;
			});

		folders.particles.add(
			{
				"Randomize Particles": uiFunctions.randomizeParticles,
			},
			"Randomize Particles"
		);
		folders.particles
			.add(
				permanentResources.particleMeshifyPipeline.settings,
				"eigenvectorMethod"
			)
			.name("Eigenvector Method")
			.options(ParticleMeshifyPipeline.EigenvectorMethod)
			.onFinishChange(() => {
				permanentResources.particles.meshDirty = true;
			});

		UICallbacks = {
			swapCameraStyle: revealControllers,
		};
	};

	let particleHeaderReadState:
		| "ready-to-copy"
		| "ready-to-map"
		| "up-to-date" = "up-to-date";

	const draw = (
		presentTexture: GPUTexture,
		_aspectRatio: number,
		_timeMilliseconds: number,
		deltaTimeMilliseconds: number
	): void => {
		const main = device.createCommandEncoder({
			label: "Sandstone Main",
		});

		if (KeyState.wasPressed(inputState.KeyR)) {
			if (camera.style == "Cartesian") {
				camera.style = "Polar";
			} else if (camera.style == "Polar") {
				camera.style = "Cartesian";
			}
			UICallbacks?.swapCameraStyle(camera.style);
		}

		const aspectRatio = presentTexture.width / presentTexture.height;
		Camera.update(
			device.queue,
			aspectRatio,
			camera,
			inputState,
			deltaTimeMilliseconds
		);

		for (const keyCode of KeyCode) {
			inputState[keyCode].edge = false;
		}

		let copying = false;
		if (permanentResources.particles.meshDirty) {
			PointNeighborhoodBuffer.writeToGPU({
				device,
				neighborhood: debugNeighborhood,
				particleIndex: pipelineParameters.debugParticleIdx,
			});

			ParticleMeshifyPipeline.computeMeshFromParticles({
				commandEncoder: main,
				pipeline: permanentResources.particleMeshifyPipeline,
			});

			if (
				permanentResources.particles.particleGraphBufferDebug
					.mapState === "unmapped"
			) {
				copying = true;
				main.copyBufferToBuffer(
					permanentResources.particles.particleGraphBuffer,
					permanentResources.particles.particleGraphBufferDebug
				);
			}

			permanentResources.particles.meshDirty = false;

			particleHeaderReadState = "ready-to-copy";
			permanentResources.particles.countSurface = undefined;
			debugParticleController?.disable();
			debugParticleController?.min(0);
			debugParticleController?.max(0);

			done = false;
		}

		if (
			particleHeaderReadState === "ready-to-copy" &&
			permanentResources.particles.particleHeaderHostBuffer.mapState ===
				"unmapped"
		) {
			particleHeaderReadState = "ready-to-map";
			main.copyBufferToBuffer(
				permanentResources.particles.particleBuffer,
				permanentResources.particles.particleHeaderHostBuffer,
				permanentResources.particles.particleHeaderHostBuffer.size
			);
		}

		const clearColor = (
			{
				"Debug Particles": [0.4, 0.6, 1.0, 1.0],
				"Meshify Particles": [0.05, 0.1, 0.05, 1.0],
				"Particle Graph": [0.1, 0.1, 0.1, 1.0],
			} as const
		)[pipelineParameters.output];

		drawBackground({
			commandEncoder: main,
			color: transientResources.outputColor.color,
			depth: transientResources.outputColor.depth,
			clearValueColor: clearColor,
		});
		WorldAxesPipeline.draw({
			commandEncoder: main,
			color: transientResources.outputColor.color,
			depth: transientResources.outputColor.depth,
			pipeline: permanentResources.worldAxesPipeline,
		});

		switch (pipelineParameters.output) {
			case "Debug Particles": {
				ParticleDrawPipeline.draw({
					commandEncoder: main,
					queue: device.queue,
					color: transientResources.outputColor.color,
					depth: transientResources.outputColor.depth,
					pipeline: permanentResources.particleDrawPipeline,
					surfaceParticlesCount:
						permanentResources.particles.countSurface ?? 0,
				});
				break;
			}
			case "Meshify Particles": {
				ParticleMeshifyPipeline.drawGrid({
					commandEncoder: main,
					color: transientResources.outputColor.color,
					depth: transientResources.outputColor.depth,
					pipeline: permanentResources.particleMeshifyPipeline,
				});
				break;
			}
			case "Particle Graph": {
				ParticleMeshifyPipeline.drawParticleGraph({
					commandEncoder: main,
					color: transientResources.outputColor.color,
					depth: transientResources.outputColor.depth,
					pipeline: permanentResources.particleMeshifyPipeline,
					particles: permanentResources.particles,
				});
				break;
			}
		}

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
				const busy =
					!copying ||
					permanentResources.particles.particleGraphBufferDebug
						.mapState !== "unmapped";
				if (busy || done) {
					return;
				}

				done = true;
				permanentResources.particles.particleGraphBufferDebug
					.mapAsync(GPUMapMode.READ)
					.then(() => {
						// offset past header
						const mappedRange =
							permanentResources.particles.particleGraphBufferDebug.getMappedRange();
						const floats = new Float32Array(mappedRange);
						const u32s = new Uint32Array(mappedRange);
						const log = {
							vec4f32: (first: number): string => {
								return `vec4 (${floats[first]},${
									floats[first + 1]
								},${floats[first + 2]},${floats[first + 3]})\n`;
							},
							vec3f32: (first: number): string => {
								return `vec3 (${floats[first]},${
									floats[first + 1]
								},${floats[first + 2]})\n`;
							},
							u32: (first: number): string => {
								return `u32 (${u32s[first]})\n`;
							},
						};
						console.log("particle graph");
						console.log("    padding0 " + log.vec3f32(0));
						console.log("    edge_count " + log.u32(3));
						console.log("    indirect draw");
						console.log("        padding0       " + log.vec3f32(4));
						console.log("        index_count    " + log.u32(7));
						console.log("        instance_count " + log.u32(8));
						console.log("        first_index    " + log.u32(9));
						console.log("        base_vertex    " + log.u32(10));
						console.log("        first_instance " + log.u32(11));
						permanentResources.particles.particleGraphBufferDebug.unmap();
					})
					.catch((reason) => {
						console.error(reason);
					});
			})
			.then(() => {
				if (
					particleHeaderReadState !== "ready-to-map" ||
					permanentResources.particles.particleHeaderHostBuffer
						.mapState !== "unmapped"
				) {
					return;
				}
				permanentResources.particles.particleHeaderHostBuffer
					.mapAsync(GPUMapMode.READ)
					.then(() => {
						const mappedRange =
							permanentResources.particles.particleHeaderHostBuffer.getMappedRange();
						const u32s = new Uint32Array(mappedRange);

						permanentResources.particles.countSurface = u32s[2];
						const [min, max] = [
							0,
							permanentResources.particles.countSurface,
						];
						debugParticleController?.disable(false);
						debugParticleController?.min(min);
						debugParticleController?.max(max - 1);
						debugParticleController?.setValue(
							Math.max(
								Math.min(
									pipelineParameters.debugParticleIdx,
									max
								),
								min
							)
						);

						permanentResources.particles.particleHeaderHostBuffer.unmap();
					})
					.catch((reason) => {
						console.error(reason);
					})
					.finally(() => {
						particleHeaderReadState = "up-to-date";
					});
			})
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

	const handleKey = ({
		code,
		down,
	}: {
		code: string;
		down: boolean;
	}): void => {
		const codeMapped = KeyCode.find((value) => value === code);
		if (codeMapped === undefined) {
			return;
		}

		const keyState = inputState[codeMapped];

		if (keyState.down === down) return;

		keyState.down = down;
		keyState.edge = true;
	};

	const handleToggleFocus = (): void => {
		for (const keyCode of KeyCode) {
			inputState[keyCode] = { down: false, edge: true };
		}
	};

	return {
		quit: false,
		presentationInterface: () => ({ device, format: COLOR_FORMAT }),
		draw,
		handleKey,
		handleToggleFocus,
		setupUI,
		destroy,
		handleResize,
	};
};
