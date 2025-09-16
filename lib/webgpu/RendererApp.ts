import { GUI } from "lil-gui";

/**
 * A WebGPU renderer that can render to a given texture. Also handles possible
 * resizing of its render target (such as an HTML canvas), and binding to a GUI
 * backend (just lil-gui for now).
 */
export interface RendererApp {
	quit: boolean;
	presentationInterface(): GPUCanvasConfiguration;
	setLowPerformanceMode?: (isLowPerf: boolean) => void;
	/*
	 * TODO: We could maybe just resize resources on draw if the presentTexture
	 * is an unexpected size, cutting this handleResize method.
	 */
	handleResize?: (newWidth: number, newHeight: number) => void;
	handleWheel?: (args: {
		delta: number;
		shift: boolean;
		ctrl: boolean;
		alt: boolean;
	}) => void;
	draw: (
		presentTexture: GPUTexture,
		aspectRatio: number,
		timeMilliseconds: number,
		deltaTimeMilliseconds: number
	) => void;
	setupUI?: (gui: GUI) => void;
	destroy(): void;
}

/**
 * A function signature for the constructor that fully initializes a WebGPU
 * sample renderer apps.
 * @param device - The device that is used for the allocation of all resources
 *  and dispatch of rendering commands.
 * @param canvasFormat - The format of the canvas texture that will be passed in
 *  {@link RendererApp.draw}. Rendering is not guaranteed to work if the format
 *  does not match.
 * @returns The instantiated renderer, ready for binding UI and recording frame
 * draws
 */
export type RendererAppConstructor = (
	device: GPUDevice,
	canvasFormat: GPUTextureFormat
) => RendererApp;

/**
 * Loads a device and adapter from the supplied WebGPU device, while also
 * handling enabling the provided limits and features.
 * @see {@link initializeApp} for descriptions of parameters.
 * @returns A promise containing the resulting adapter and device with all
 * requested features possible, and that rejects upon encountering any
 * unsupported but required features.
 */
async function getDevice(props: {
	gpu: GPU;
	requiredFeatures: ReadonlySet<GPUFeatureName>;
	optionalFeatures: ReadonlySet<GPUFeatureName>;
	requiredLimits: ReadonlyMap<keyof GPUSupportedLimits, number>;
}): Promise<{ adapter: GPUAdapter; device: GPUDevice }> {
	console.log("Starting WebGPU");

	const adapterPromise = navigator.gpu
		.requestAdapter()
		.then((value) => {
			if (!value) {
				return Promise.reject(
					new Error("Requested WebGPU Adapter is not available.")
				);
			}
			return Promise.resolve(value);
		})
		.catch((reason) => {
			return Promise.reject(
				new Error("Unable to get WebGPU Adapter", { cause: reason })
			);
		});

	const devicePromise = adapterPromise.then((adapter) => {
		const knownRequiredFeatures = Array.from(
			props.requiredFeatures.values()
		).filter((feature) => {
			return adapter.features.has(feature);
		});
		if (knownRequiredFeatures.length != props.requiredFeatures.size) {
			const reason = `Required features unavailable: ${Array.from(
				props.requiredFeatures.values()
			)
				.filter((feature) => !adapter.features.has(feature))
				.map((feature) => `'${feature}'`)
				.join(",")}`;
			return Promise.reject(
				new Error("Unable to get WebGPU Device", { cause: reason })
			);
		}
		const features = knownRequiredFeatures.concat(
			...Array.from(props.optionalFeatures.values()).filter((feature) => {
				return adapter.features.has(feature);
			})
		);
		console.log(`Enabling features: '${features.join(`', '`)}'`);

		const satisfiedRequiredLimits = new Map<
			keyof GPUSupportedLimits,
			number
		>();
		const missingLimits = new Array<{
			name: keyof GPUSupportedLimits;
			requestedMinimum: number;
			supported: number;
		}>();
		for (const [name, requestedMinimum] of props.requiredLimits.entries()) {
			const supported = adapter.limits[name] as number;

			if (supported >= requestedMinimum) {
				satisfiedRequiredLimits.set(name, requestedMinimum);
			} else {
				missingLimits.push({
					name: name,
					requestedMinimum: requestedMinimum,
					supported: supported,
				});
			}
		}
		if (satisfiedRequiredLimits.size < props.requiredLimits.size) {
			const reason = `Required limits unsatisfied: ${missingLimits
				.map(
					(limit) =>
						`( name: '${limit.name}' supported: '${limit.supported}' requested: '${limit.requestedMinimum}' )`
				)
				.join(",")}`;
			return Promise.reject(
				new Error("Unable to get WebGPU Device", { cause: reason })
			);
		}

		const limits: Record<string, number> = {};
		for (const [name, limit] of satisfiedRequiredLimits) {
			limits[name] = limit;
		}

		return adapter
			.requestDevice({
				requiredFeatures: features,
				requiredLimits: limits,
			})
			.catch((reason) => {
				return Promise.reject(
					new Error("Unable to get WebGPU Device", { cause: reason })
				);
			});
	});

	return Promise.all([adapterPromise, devicePromise]).then((value) => {
		const [adapter, device] = value;
		return {
			adapter,
			device,
		};
	});
}

/**
 * Initializes a WebGPU sample renderer app with the given limits.
 *
 * @param gpu - The GPU to request the adapter and device from.
 * @param requiredFeatures - Each feature is guaranteed to be enabled, and the
 *  promise rejects if any of these features are unsupported.
 * @param optionalFeatures - Each feature will be enabled if supported. Any
 *  unsupported features will be omitted, and it is the duty of the renderer to
 *  check which features ended up enabled.
 * @param requiredLimits - The exact limits and no better provided will be
 *  enabled. The promise rejects if any of these limits cannot be supported.
 * @param import - The (asynchronous importer of the constructor for the) app to
 *  be initialized
 * @param onUncapturedError - A handler to be attached to
 *  {@link GPUDevice.onuncapturederror} of the created device, which produces
 *  error events.
 * @returns A promise resolving to the fully initialized app. Can reject.
 */
export async function initializeApp(props: {
	gpu: GPU;
	requiredLimits: ReadonlyMap<keyof GPUSupportedLimits, number>;
	requiredFeatures: ReadonlySet<GPUFeatureName>;
	optionalFeatures: ReadonlySet<GPUFeatureName>;
	import: () => Promise<RendererAppConstructor>;
	onUncapturedError: (e: GPUUncapturedErrorEvent) => void;
}): Promise<RendererApp> {
	return Promise.all([
		props.import(),
		getDevice({
			...props,
		}),
	]).then(([sampleConstructor, { adapter: _adapter, device }]) => {
		const canvasFormat = props.gpu.getPreferredCanvasFormat();
		const app = sampleConstructor(device, canvasFormat);

		device.lost
			.then(
				(reason) => {
					console.log(
						`WebGPU device lost - ("${reason.reason}"):\n ${reason.message}`
					);
				},
				(err) => {
					// This shouldn't happen
					throw new Error(`WebGPU device lost rejected`, {
						cause: err,
					});
				}
			)
			.finally(() => {
				app.quit = true;
			});
		device.onuncapturederror = (ev): void => {
			app.quit = true;
			props.onUncapturedError(ev);
		};
		return app;
	});
}
