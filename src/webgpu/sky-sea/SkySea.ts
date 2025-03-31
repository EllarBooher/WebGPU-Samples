import { Controller as LilController, GUI as LilGUI } from "lil-gui";
import { RendererApp, RendererAppConstructor } from "../RendererApp.ts";
import { mat4, vec3, vec4 } from "wgpu-matrix";
import { Camera, GlobalUBO } from "./GlobalUBO.ts";
import { Extent2D } from "./Common.ts";

import { TransmittanceLUTPassResources } from "./atmosphere/TransmittanceLUT.ts";
import { MultiscatterLUTPassResources } from "./atmosphere/MultiscatterLUT.ts";
import { SkyViewLUTPassResources } from "./atmosphere/SkyViewLUT.ts";
import { AtmosphereCameraPassResources } from "./AtmosphereCamera.ts";
import { AerialPerspectiveLUTPassResources } from "./atmosphere/AerialPerspectiveLUT.ts";

import {
	RenderOutputTag,
	RenderOutputTexture,
	RenderOutputController,
} from "./RenderOutputController.ts";
import { GBuffer } from "./GBuffer.ts";
import {
	FFTWaveSpectrumResources,
	FFTWavesSettings,
} from "./ocean/FourierWaves.ts";
import { WaveSurfaceDisplacementPassResources } from "./ocean/WaveDisplacement.ts";
import { FullscreenQuadPassResources } from "./FullscreenQuad.ts";
import { PerformanceTracker } from "./PerformanceTracker.ts";

const TRANSMITTANCE_LUT_EXTENT = { width: 2048, height: 1024 } as const;
const MULTISCATTER_LUT_EXTENT = { width: 1024, height: 1024 } as const;
const SKYVIEW_LUT_EXTENT = { width: 1024, height: 512 } as const;
const AERIAL_PERSPECTIVE_LUT_EXTENT = {
	width: 32,
	height: 32,
	depthOrArrayLayers: 32,
} as const;

const RENDER_SCALES = [0.25, 0.3333, 0.5, 0.75, 1.0, 1.5, 2.0, 4.0];

interface PerformanceConfig {
	renderScale: number;
	fftGridSizeLog2: number;
	oceanSurfaceVertexSize: number;
}
type PerformanceConfigName = "bad" | "good";
const PERFORMANCE_CONFIGS = new Map<PerformanceConfigName, PerformanceConfig>([
	[
		"bad",
		{
			renderScale: 0.5,
			fftGridSizeLog2: 5, // 32
			oceanSurfaceVertexSize: 128,
		},
	],
	[
		"good",
		{
			renderScale: 1.0,
			fftGridSizeLog2: 9, // 512
			oceanSurfaceVertexSize: 1024,
		},
	],
]);

interface CameraParameters {
	translationX: number;
	translationY: number;
	translationZ: number;
	// Applied in order Y * X * Z
	// Z first, X second, Y third
	eulerAnglesX: number;
	eulerAnglesY: number;
	eulerAnglesZ: number;
}

interface SkySeaAppParameters {
	renderFromOceanPOV: boolean;
	renderScale: number;
	readonly oceanSurfaceSettings: {
		gerstner: boolean;
		fft: boolean;
		foamScale: number;
		foamBias: number;
	};
	readonly oceanCamera: CameraParameters;
	readonly debugCamera: CameraParameters;
	readonly fourierWavesSettings: FFTWavesSettings;
	readonly time: {
		pause: boolean;
		timeSeconds: number;
		deltaTimeSeconds: number;
	};
	readonly orbit: {
		timeHours: number;
		timeSpeedupFactor: number;
		reversed: boolean;
		paused: boolean;
		inclinationRadians: number;
		sunsetAzimuthRadians: number;
	};
}
type ValidParamsGuard<T> = T extends {
	[K in keyof T]: number | boolean | string | ValidParamsGuard<T[K]>;
}
	? T
	: never;

function setupUI(
	gui: LilGUI,
	paramsToBind: ValidParamsGuard<SkySeaAppParameters>,
	handleResize: () => void
): void {
	gui.add(paramsToBind, "renderScale", RENDER_SCALES)
		.name("Render Resolution Scale")
		.decimals(1)
		.onFinishChange((_v: number) => {
			handleResize();
		})
		.listen();

	const cameraParameters = gui.addFolder("Camera").open();
	cameraParameters
		.add(paramsToBind.oceanCamera, "translationX")
		.name("Camera X")
		.min(-100.0)
		.max(100.0);
	cameraParameters
		.add(paramsToBind.oceanCamera, "translationY")
		.name("Camera Y")
		.min(10.0)
		.max(2000.0);
	cameraParameters
		.add(paramsToBind.oceanCamera, "translationZ")
		.name("Camera Z")
		.min(-100.0)
		.max(100.0);

	const EULER_ANGLES_X_SAFETY_MARGIN = 0.01;
	cameraParameters
		.add(paramsToBind.oceanCamera, "eulerAnglesX")
		.name("Camera Pitch")
		.min(-Math.PI / 2.0 + EULER_ANGLES_X_SAFETY_MARGIN)
		.max(Math.PI / 2.0 - EULER_ANGLES_X_SAFETY_MARGIN);
	cameraParameters
		.add(paramsToBind.oceanCamera, "eulerAnglesY")
		.name("Camera Yaw")
		.min(-Math.PI)
		.max(Math.PI);
	/* Non-zero camera roll breaks certain horizon calculations in shaders
		cameraParameters
			.add(this.controls.cameraSettings, "eulerAnglesZ")
			.name("Camera Roll")
			.min(-Math.PI)
			.max(Math.PI);
		*/

	const sunFolder = gui.addFolder("Sun").open();
	sunFolder
		.add(paramsToBind.orbit, "timeHours")
		.min(0.0)
		.max(24.0)
		.name("Time in Hours")
		.listen();
	sunFolder
		.add(paramsToBind.orbit, "timeSpeedupFactor")
		.min(1.0)
		.max(50000)
		.step(1.0)
		.name("Time Multiplier");
	sunFolder.add(paramsToBind.orbit, "paused").name("Pause Sun");

	sunFolder
		.add(
			{
				fn: () => {
					paramsToBind.orbit.timeHours = paramsToBind.orbit.reversed
						? 18.0 + 0.5
						: 6.0 - 0.5;
				},
			},
			"fn"
		)
		.name("Skip to Sunrise");
	sunFolder
		.add(
			{
				fn: () => {
					paramsToBind.orbit.timeHours = paramsToBind.orbit.reversed
						? 6.0 + 0.5
						: 18.0 - 0.5;
				},
			},
			"fn"
		)
		.name("Skip to Sunset");

	sunFolder.add(paramsToBind.orbit, "reversed").name("Reverse Sun");
	sunFolder
		.add(paramsToBind.orbit, "sunsetAzimuthRadians")
		.name("Sun Azimuth")
		.min(0.0)
		.max(2.0 * Math.PI);
	sunFolder
		.add(paramsToBind.orbit, "inclinationRadians")
		.name("Sun Inclination")
		.min(0.0)
		.max(Math.PI);

	const oceanFolder = gui.addFolder("Ocean").close();
	oceanFolder
		.add(paramsToBind.oceanSurfaceSettings, "gerstner")
		.name("Gerstner Waves");
	oceanFolder
		.add(paramsToBind.oceanSurfaceSettings, "fft")
		.name("FFT Accelerated Waves");
	oceanFolder.add(paramsToBind.time, "pause").name("Pause Waves");
	oceanFolder
		.add(paramsToBind.oceanSurfaceSettings, "foamScale")
		.name("Foam Scale")
		.min(-30.0)
		.max(30.0);
	oceanFolder
		.add(paramsToBind.oceanSurfaceSettings, "foamBias")
		.name("Foam Bias")
		.min(-1.0)
		.max(1.0);

	oceanFolder
		.add(paramsToBind.fourierWavesSettings, "gravity")
		.name("Gravity (m / s^2)")
		.min(0.01)
		.max(20.0);
	oceanFolder
		.add(paramsToBind.fourierWavesSettings, "waveSwell")
		.name("Wave Swell")
		.min(0.01)
		.max(1.0);
	oceanFolder
		.add(paramsToBind.fourierWavesSettings, "windFetchMeters")
		.name("Wind Fetch (m)")
		.min(10.0 * 1000.0)
		.max(100.0 * 1000.0);
	oceanFolder
		.add(paramsToBind.fourierWavesSettings, "windSpeedMetersPerSeconds")
		.name("Wind Speed (m/s)")
		.min(0.01)
		.max(50.0);

	const debugFolder = gui.addFolder("Debug").close();
	const debugCameraControllers: LilController[] = [];
	debugFolder
		.add(paramsToBind, "renderFromOceanPOV")
		.name("Render from Ocean POV")
		.onFinishChange((v: boolean) => {
			debugCameraControllers.forEach((c) => {
				c.enable(!v);
			});
		});

	debugCameraControllers.push(
		debugFolder
			.add(paramsToBind.debugCamera, "translationX")
			.name("Camera X")
			.min(-5000.0)
			.max(5000.0),
		debugFolder
			.add(paramsToBind.debugCamera, "translationY")
			.name("Camera Y")
			.min(10.0)
			.max(5000.0),
		debugFolder
			.add(paramsToBind.debugCamera, "translationZ")
			.name("Camera Z")
			.min(-5000.0)
			.max(5000.0),

		debugFolder
			.add(paramsToBind.debugCamera, "eulerAnglesX")
			.name("Camera Pitch")
			.min(-Math.PI / 2.0 + EULER_ANGLES_X_SAFETY_MARGIN)
			.max(Math.PI / 2.0 - EULER_ANGLES_X_SAFETY_MARGIN),
		debugFolder
			.add(paramsToBind.debugCamera, "eulerAnglesY")
			.name("Camera Yaw")
			.min(-Math.PI)
			.max(Math.PI),

		/* Non-zero camera roll breaks certain horizon calculations in shaders
		debugFolder
			.add(this.settings.cameraSettings.debugCamera, "eulerAnglesZ")
			.name("Camera Roll")
			.min(-Math.PI)
			.max(Math.PI),
		*/
		debugFolder
			.add(
				{
					fn: () => {
						Object.assign<
							typeof paramsToBind.debugCamera,
							typeof paramsToBind.debugCamera
						>(
							paramsToBind.debugCamera,
							structuredClone(paramsToBind.oceanCamera)
						);
						debugFolder.controllers.forEach((c) => {
							c.updateDisplay();
						});
					},
				},
				"fn"
			)
			.name("Reset to match main camera")
	);
	debugCameraControllers.forEach((c) => c.enable(false));
}

interface WebGPUResources {
	transmittanceLUTPassResources: TransmittanceLUTPassResources;
	multiscatterLUTPassResources: MultiscatterLUTPassResources;
	skyviewLUTPassResources: SkyViewLUTPassResources;
	aerialPerspectiveLUTPassResources: AerialPerspectiveLUTPassResources;
	fftWaveSpectrumResources: FFTWaveSpectrumResources;
	waveSurfaceDisplacementPassResources: WaveSurfaceDisplacementPassResources;
	atmosphereCameraPassResources: AtmosphereCameraPassResources;
	fullscreenQuadPassResources: FullscreenQuadPassResources;

	gbuffer: GBuffer;

	globalUBO: GlobalUBO;
}

function initializeResources(
	device: GPUDevice,
	performanceConfig: PerformanceConfig,
	presentFormat: GPUTextureFormat
): WebGPUResources {
	const gbuffer = new GBuffer(device, { width: 1, height: 1 });

	const globalUBO = new GlobalUBO(device);
	globalUBO.writeToGPU(device.queue);

	const transmittanceLUTPassResources = new TransmittanceLUTPassResources(
		device,
		TRANSMITTANCE_LUT_EXTENT,
		globalUBO
	);

	const float32Filterable = device.features.has("float32-filterable");

	const multiscatterLUTPassResources = new MultiscatterLUTPassResources(
		device,
		MULTISCATTER_LUT_EXTENT,
		transmittanceLUTPassResources.view,
		float32Filterable,
		globalUBO
	);

	const skyviewLUTPassResources = new SkyViewLUTPassResources(
		device,
		SKYVIEW_LUT_EXTENT,
		transmittanceLUTPassResources.view,
		multiscatterLUTPassResources.view,
		float32Filterable,
		globalUBO
	);

	const aerialPerspectiveLUTPassResources =
		new AerialPerspectiveLUTPassResources(
			device,
			AERIAL_PERSPECTIVE_LUT_EXTENT,
			transmittanceLUTPassResources.view,
			multiscatterLUTPassResources.view,
			float32Filterable,
			globalUBO
		);

	const fftWaveSpectrumResources = new FFTWaveSpectrumResources(
		device,
		globalUBO,
		performanceConfig.fftGridSizeLog2
	);
	const fftWaveViews = fftWaveSpectrumResources.views();

	const waveSurfaceDisplacementPassResources =
		new WaveSurfaceDisplacementPassResources(
			device,
			globalUBO,
			gbuffer.formats,
			fftWaveSpectrumResources.displacementMaps()
		);

	const atmosphereCameraPassResources = new AtmosphereCameraPassResources(
		device,
		gbuffer.readGroupLayout,
		transmittanceLUTPassResources.view,
		multiscatterLUTPassResources.view,
		skyviewLUTPassResources.view,
		aerialPerspectiveLUTPassResources.view,
		float32Filterable,
		globalUBO
	);

	const fullscreenQuadPassResources = new FullscreenQuadPassResources(
		device,
		presentFormat
	);

	const gbufferRenderables = gbuffer.colorRenderables();

	(
		[
			[
				"Scene",
				new RenderOutputTexture(
					atmosphereCameraPassResources.outputColor
				),
			],
			[
				"GBufferColor",
				gbufferRenderables.colorWithSurfaceWorldDepthInAlpha,
			],
			[
				"GBufferNormal",
				gbufferRenderables.normalWithSurfaceFoamStrengthInAlpha,
			],
			[
				"AtmosphereTransmittanceLUT",
				new RenderOutputTexture(transmittanceLUTPassResources.texture),
			],
			[
				"AtmosphereMultiscatterLUT",
				new RenderOutputTexture(multiscatterLUTPassResources.texture),
			],
			[
				"AtmosphereSkyviewLUT",
				new RenderOutputTexture(skyviewLUTPassResources.texture),
			],
			[
				"AtmosphereAerialPerspectiveLUT",
				new RenderOutputTexture(
					aerialPerspectiveLUTPassResources.texture
				),
			],
			["FFTWaveSpectrumGaussianNoise", fftWaveViews.gaussianNoise],
			["FFTWaveInitialAmplitude", fftWaveViews.initialAmplitude],
			[
				"FFTWaveDx_plus_iDy_Dz_iDxdz_Amplitude",
				fftWaveViews.packed_Dx_plus_iDy_Dz_iDxdz_Amplitude,
			],
			[
				"FFTWaveDydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude",
				fftWaveViews.packed_Dydx_plus_iDydz_Dxdx_plus_iDzdz_Amplitude,
			],
			["FFTWaveTurbulenceJacobian", fftWaveViews.turbulenceJacobian],
			[
				"FFTWaveDx_Dy_Dz_Dxdz_Spatial",
				fftWaveViews.Dx_Dy_Dz_Dxdz_Spatial,
			],
			[
				"FFTWaveDydx_Dydz_Dxdx_Dzdz_Spatial",
				fftWaveViews.Dydx_Dydz_Dxdx_Dzdz_Spatial,
			],
		] as [RenderOutputTag, RenderOutputTexture][]
	).forEach(([tag, texture]) => {
		fullscreenQuadPassResources.setOutput(device, tag, texture);
	});

	const commandEncoder = device.createCommandEncoder({
		label: "Atmosphere LUT Initialization",
	});
	transmittanceLUTPassResources.record(commandEncoder);
	multiscatterLUTPassResources.record(commandEncoder);

	device.queue.submit([commandEncoder.finish()]);

	return {
		aerialPerspectiveLUTPassResources: aerialPerspectiveLUTPassResources,
		atmosphereCameraPassResources: atmosphereCameraPassResources,
		fftWaveSpectrumResources: fftWaveSpectrumResources,
		fullscreenQuadPassResources: fullscreenQuadPassResources,
		gbuffer: gbuffer,
		globalUBO: globalUBO,
		multiscatterLUTPassResources: multiscatterLUTPassResources,
		skyviewLUTPassResources: skyviewLUTPassResources,
		transmittanceLUTPassResources: transmittanceLUTPassResources,
		waveSurfaceDisplacementPassResources:
			waveSurfaceDisplacementPassResources,
	};
}

function viewFormatFromCanvasFormat(
	format: GPUTextureFormat
): GPUTextureFormat {
	switch (format) {
		case "bgra8unorm": {
			return "bgra8unorm-srgb";
		}
		case "rgba8unorm": {
			return "rgba8unorm-srgb";
		}
		default: {
			console.warn(
				`Using unsupported canvas format "${format}", color encoding will be off.`
			);
			return format;
		}
	}
}

function updateGlobalUBO(
	queue: GPUQueue,
	globalUBO: GlobalUBO,
	parameters: SkySeaAppParameters,
	aspectRatio: number
): void {
	globalUBO.data.time.deltaTimeSeconds = parameters.time.deltaTimeSeconds;
	globalUBO.data.time.timeSeconds = parameters.time.timeSeconds;

	// offset the time so that the app starts during the day
	const SUN_ROTATION_RAD_PER_HOUR = (2.0 * Math.PI) / 24.0;
	const SUN_ANOMALY =
		(12.0 - parameters.orbit.timeHours) * SUN_ROTATION_RAD_PER_HOUR;

	const sunsetDirection = vec3.create(
		-Math.sin(parameters.orbit.sunsetAzimuthRadians),
		0.0,
		Math.cos(parameters.orbit.sunsetAzimuthRadians)
	);
	const noonDirection = vec3.create(
		Math.cos(parameters.orbit.sunsetAzimuthRadians) *
			Math.cos(parameters.orbit.inclinationRadians),
		Math.sin(parameters.orbit.inclinationRadians),
		Math.sin(parameters.orbit.sunsetAzimuthRadians) *
			Math.cos(parameters.orbit.inclinationRadians)
	);
	const sunDirection = vec3.add(
		vec3.scale(sunsetDirection, Math.sin(SUN_ANOMALY)),
		vec3.scale(noonDirection, Math.cos(SUN_ANOMALY))
	);
	vec3.scale(sunDirection, -1.0, globalUBO.data.light.forward);

	const fov = (60 * Math.PI) / 180;
	const near = 0.1;
	const far = 1000;
	const perspective = mat4.perspective(fov, aspectRatio, near, far);

	const assignToGPUCamera = (
		destination: Camera,
		source: CameraParameters
	): void => {
		const cameraPos = [
			source.translationX,
			source.translationY,
			source.translationZ,
			1,
		];
		const rotationX = mat4.rotationX(source.eulerAnglesX);
		const rotationY = mat4.rotationY(source.eulerAnglesY);
		const rotationZ = mat4.rotationZ(source.eulerAnglesZ);

		const transform = mat4.mul(
			mat4.translation(vec4.create(...cameraPos)),
			mat4.mul(rotationY, mat4.mul(rotationX, rotationZ))
		);
		const view = mat4.inverse(transform);

		Object.assign<Camera, Camera>(destination, {
			invProj: mat4.inverse(perspective),
			invView: transform,
			projView: mat4.mul(perspective, view),
			position: vec4.create(...cameraPos),
			forward: vec4.create(
				...mat4.multiply(transform, vec4.create(0.0, 0.0, -1.0, 0.0))
			),
		});
	};

	assignToGPUCamera(globalUBO.data.ocean_camera, parameters.oceanCamera);
	assignToGPUCamera(
		globalUBO.data.camera,
		parameters.renderFromOceanPOV
			? parameters.oceanCamera
			: parameters.debugCamera
	);

	globalUBO.writeToGPU(queue);
}

class SkySeaApp implements RendererApp {
	private resources: WebGPUResources | undefined;
	private unscaledResolution: Extent2D;

	private renderOutputController: RenderOutputController;
	private parameters: SkySeaAppParameters;
	private performance: PerformanceTracker;

	private performanceConfig: PerformanceConfig;

	private device: GPUDevice;

	quit = false;

	private dummyFrameCounter: number;

	private canvasTextureFormat: GPUTextureFormat;

	destroy(): void {
		this.performance.destroy();
		this.device.destroy();
	}

	presentationInterface(): GPUCanvasConfiguration {
		return {
			device: this.device,
			format: this.canvasTextureFormat,
			viewFormats: [
				this.resources!.fullscreenQuadPassResources.attachmentFormat,
			],
		};
	}

	setupUI(gui: LilGUI): void {
		setupUI(gui, this.parameters, () => {
			this.updateResizableResources();
		});

		this.renderOutputController.setupUI(gui);
		this.performance.setupUI(gui);
	}

	setPerformanceConfig(name: PerformanceConfigName): void {
		const newConfig =
			PERFORMANCE_CONFIGS.get(name) ?? PERFORMANCE_CONFIGS.get("bad")!;
		const updateNeeded =
			newConfig.fftGridSizeLog2 !==
				this.performanceConfig.fftGridSizeLog2 ||
			newConfig.oceanSurfaceVertexSize !==
				this.performanceConfig.oceanSurfaceVertexSize ||
			newConfig.renderScale !== this.performanceConfig.renderScale;

		if (!updateNeeded) {
			return;
		}

		this.performanceConfig = newConfig;

		this.resources = initializeResources(
			this.device,
			this.performanceConfig,
			viewFormatFromCanvasFormat(this.canvasTextureFormat)
		);

		this.parameters.renderScale = this.performanceConfig.renderScale;
		this.updateResizableResources();

		for (const props of this.resources.fullscreenQuadPassResources.getAllTextureProperties()) {
			this.renderOutputController.setTextureProperties(props);
		}
	}

	setLowPerformanceMode(isLowPerf: boolean): void {
		const desiredPerfMode: PerformanceConfigName = isLowPerf
			? "bad"
			: "good";
		this.setPerformanceConfig(desiredPerfMode);
	}

	constructor(device: GPUDevice, presentFormat: GPUTextureFormat) {
		this.device = device;

		this.canvasTextureFormat = presentFormat;
		this.performanceConfig = PERFORMANCE_CONFIGS.get("good")!;

		this.renderOutputController = new RenderOutputController();
		this.parameters = {
			oceanSurfaceSettings: {
				gerstner: true,
				fft: true,
				foamScale: 15,
				foamBias: 0.25,
			},
			renderFromOceanPOV: true,
			oceanCamera: {
				translationX: 0.0,
				translationY: 20.0,
				translationZ: 0.0,
				eulerAnglesX: -0.2,
				eulerAnglesY: 0.0,
				eulerAnglesZ: 0.0,
			},
			debugCamera: {
				translationX: 0.0,
				translationY: 40.0,
				translationZ: -20.0,
				eulerAnglesX: -0.4,
				eulerAnglesY: 0.0,
				eulerAnglesZ: 0.0,
			},
			fourierWavesSettings: {
				gravity: 9.8,
				windSpeedMetersPerSeconds: 15.0,
				windFetchMeters: 40.0 * 1000.0,
				waveSwell: 0.3,
			},
			time: {
				pause: false,
				timeSeconds: 0.0,
				deltaTimeSeconds: 0.0,
			},
			orbit: {
				timeHours: 5.6,
				timeSpeedupFactor: 200.0,
				paused: false,
				reversed: false,
				inclinationRadians: Math.PI / 2,
				sunsetAzimuthRadians: Math.PI,
			},
			renderScale: 1.0,
		};

		this.resources = initializeResources(
			this.device,
			this.performanceConfig,
			viewFormatFromCanvasFormat(presentFormat)
		);

		for (const props of this.resources.fullscreenQuadPassResources.getAllTextureProperties()) {
			this.renderOutputController.setTextureProperties(props);
		}

		this.unscaledResolution = { width: 128.0, height: 128.0 };

		this.performance = new PerformanceTracker(this.device);

		this.dummyFrameCounter = 10.0;
	}

	tickTime(deltaTimeMilliseconds: number): void {
		const NON_FFT_WAVE_PERIOD_SECONDS = 60.0;
		const FFT_WAVE_PERIOD_SECONDS = 100.0;

		const periodSeconds = this.parameters.oceanSurfaceSettings.fft
			? FFT_WAVE_PERIOD_SECONDS
			: NON_FFT_WAVE_PERIOD_SECONDS;

		const time = this.parameters.time;
		if (!time.pause) {
			time.deltaTimeSeconds = deltaTimeMilliseconds / 1000.0;
			time.timeSeconds += time.deltaTimeSeconds;
		} else {
			time.deltaTimeSeconds = 0.0;
		}

		// It is important to NOT set the time, instead modulo it.
		// This keeps the delta time consistent.
		time.timeSeconds -=
			Math.floor(time.timeSeconds / periodSeconds) * periodSeconds;

		const orbit = this.parameters.orbit;
		if (!orbit.paused) {
			const HOURS_TO_MILLISECONDS = 60.0 * 60.0 * 1000.0;
			orbit.timeHours +=
				((orbit.reversed ? -1.0 : 1.0) *
					orbit.timeSpeedupFactor *
					deltaTimeMilliseconds) /
				HOURS_TO_MILLISECONDS;
			orbit.timeHours =
				orbit.timeHours - Math.floor(orbit.timeHours / 24.0) * 24.0;
		}
	}

	draw(
		presentTexture: GPUTexture,
		aspectRatio: number,
		_timeMilliseconds: number,
		deltaTimeMilliseconds: number
	): void {
		// Workaround for firefox stalling causing time issues

		if (this.resources === undefined) {
			return;
		}

		if (this.dummyFrameCounter > 0) {
			this.dummyFrameCounter -= 1;
			return;
		}
		const presentView = presentTexture.createView({
			format: "bgra8unorm-srgb",
		});

		this.performance.beginFrame(deltaTimeMilliseconds);

		this.tickTime(deltaTimeMilliseconds);

		updateGlobalUBO(
			this.device.queue,
			this.resources.globalUBO,
			this.parameters,
			aspectRatio
		);

		const commandEncoder = this.device.createCommandEncoder({
			label: "Main",
		});

		this.resources.fftWaveSpectrumResources.record(
			this.device,
			commandEncoder,
			this.parameters.fourierWavesSettings,
			this.performance.queueTimestampInterval("FFTWaves")
		);

		this.resources.waveSurfaceDisplacementPassResources.record(
			this.device,
			commandEncoder,
			this.performance.queueTimestampInterval("OceanSurface"),
			this.resources.fftWaveSpectrumResources.turbulenceMapIndex,
			{
				gerstner: this.parameters.oceanSurfaceSettings.gerstner,
				fft: this.parameters.oceanSurfaceSettings.fft,
				foamBias: this.parameters.oceanSurfaceSettings.foamBias,
				foamScale: this.parameters.oceanSurfaceSettings.foamScale,
			},
			this.resources.gbuffer
		);

		this.resources.skyviewLUTPassResources.record(
			commandEncoder,
			this.performance.queueTimestampInterval("SkyviewLUT")
		);
		this.resources.aerialPerspectiveLUTPassResources.record(
			commandEncoder,
			this.performance.queueTimestampInterval("AerialPerspectiveLUT")
		);
		this.resources.atmosphereCameraPassResources.record(
			commandEncoder,
			this.performance.queueTimestampInterval("AtmosphereCamera"),
			this.resources.gbuffer
		);

		const output = this.renderOutputController.current();
		this.resources.fullscreenQuadPassResources.record(
			this.device,
			commandEncoder,
			presentView,
			output.tag,
			output.transform,
			this.performance.queueTimestampInterval("FullscreenQuad")
		);

		this.performance.preSubmitCommands(commandEncoder);

		this.device.queue.submit([commandEncoder.finish()]);

		this.performance.postSubmitCommands();
	}

	updateResizableResources(): void {
		if (this.resources === undefined) {
			return;
		}

		const calcScaledSize = (
			renderScale: number
		): { width: number; height: number } => {
			return {
				width: Math.floor(this.unscaledResolution.width * renderScale),
				height: Math.floor(
					this.unscaledResolution.height * renderScale
				),
			};
		};

		const validateSize = (size: Extent2D): boolean => {
			const WEBGPU_MAX_DIMENSION = 8192;
			const WEBGPU_MAX_BUFFER_BYTES = 268435456;
			const BYTES_PER_RGBA32FLOAT = 16;
			return (
				size.width < WEBGPU_MAX_DIMENSION &&
				size.height < WEBGPU_MAX_DIMENSION &&
				size.width * size.height * BYTES_PER_RGBA32FLOAT <
					WEBGPU_MAX_BUFFER_BYTES
			);
		};

		let renderScale = this.parameters.renderScale;
		const originalScaledSize = calcScaledSize(renderScale);
		if (!validateSize(originalScaledSize)) {
			RENDER_SCALES.slice()
				.reverse()
				.some((newRenderScale) => {
					if (validateSize(calcScaledSize(newRenderScale))) {
						renderScale = newRenderScale;
						return true;
					}
				});
			console.warn(
				`During resize: Texture size (${originalScaledSize.width},${originalScaledSize.height}) exceeds WebGPU guaranteed limit (8192, 8192).
					Defaulting to highest possible render scale of ${renderScale}`
			);
		}
		this.parameters.renderScale = renderScale;

		const finalScaledSize = calcScaledSize(this.parameters.renderScale);
		console.log(
			`Resizing to (${finalScaledSize.width},${finalScaledSize.height})`
		);

		this.resources.gbuffer = new GBuffer(
			this.device,
			finalScaledSize,
			this.resources.gbuffer
		);

		const gbufferRenderables = this.resources.gbuffer.colorRenderables();
		this.resources.fullscreenQuadPassResources.setOutput(
			this.device,
			"GBufferColor",
			gbufferRenderables.colorWithSurfaceWorldDepthInAlpha
		);
		this.resources.fullscreenQuadPassResources.setOutput(
			this.device,
			"GBufferNormal",
			gbufferRenderables.normalWithSurfaceFoamStrengthInAlpha
		);

		this.resources.atmosphereCameraPassResources.resize(
			finalScaledSize,
			this.device,
			this.resources.transmittanceLUTPassResources.view,
			this.resources.multiscatterLUTPassResources.view,
			this.resources.skyviewLUTPassResources.view,
			this.resources.aerialPerspectiveLUTPassResources.view
		);
		this.resources.fullscreenQuadPassResources.setOutput(
			this.device,
			"Scene",
			new RenderOutputTexture(
				this.resources.atmosphereCameraPassResources.outputColor
			)
		);

		for (const props of this.resources.fullscreenQuadPassResources.getAllTextureProperties()) {
			this.renderOutputController.setTextureProperties(props);
		}
	}

	handleResize(newWidth: number, newHeight: number): void {
		if (
			this.unscaledResolution.width === newWidth &&
			this.unscaledResolution.height === newHeight
		) {
			return;
		}

		this.unscaledResolution.width = newWidth;
		this.unscaledResolution.height = newHeight;

		this.updateResizableResources();
	}
}

/**
 * Constructor for {@link SkySeaApp}.
 * @see {@link RendererAppConstructor}
 */
export const SkySeaAppConstructor: RendererAppConstructor = (
	device,
	presentFormat
) => {
	return new SkySeaApp(device, presentFormat);
};
