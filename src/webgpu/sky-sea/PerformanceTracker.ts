import { GUI as LilGUI, Controller as LilController } from "lil-gui";

/**
 * @see {@link QueryCategory} for the enum backed by this array.
 */
export const QueryCategories = [
	"SkyviewLUT",
	"AerialPerspectiveLUT",
	"FFTWaves",
	"OceanSurface",
	"AtmosphereCamera",
	"FullscreenQuad",
] as const;
/**
 * Categories of rendering work that the renderer tracks the performance for by
 * querying the device for timestamps.
 */
export type QueryCategory = (typeof QueryCategories)[number];

/**
 * @see {@link FrametimeCategory} for the enum backed by this array.
 */
export const FrametimeCategories = ["DrawToDraw", ...QueryCategories] as const;
/**
 * All categories of rendering work that the renderer tracks the compute and
 * graphics time for.
 */
export type FrametimeCategory = (typeof FrametimeCategories)[number];

/**
 * Stores indices into a device query set, for timing some interval or scope of
 * GPU work.
 */
export interface TimestampQueryInterval {
	/**
	 * The query set that timestamps should be written into.
	 */
	querySet: GPUQuerySet;

	/**
	 * An index into the query set, where the timestamp for the beginning of the
	 * work should be written.
	 */
	beginWriteIndex: GPUSize32;

	/**
	 * An index into the query set, where the timestamp for the end of the work
	 * should be written.
	 */
	endWriteIndex: GPUSize32;
}

/**
 * A ring buffer storing the arithmetic average of some fixed amount values.
 */
class ArithmeticSumArray {
	private values: number[];
	private sum = 0.0;
	private average_ = 0.0;
	/*
	 * Count how many values are valid. Starts at zero, goes to values.length,
	 * and stays there. Necessary to keep runningSum valid before the buffer can
	 * be filled once.
	 */
	private count = 0;
	/*
	 * Index into values of next value to write
	 */
	private index = 0;

	constructor(capacity: number) {
		this.values = new Array<number>(capacity).fill(0.0);
	}

	/**
	 * Returns the average of stored values.
	 * @readonly
	 */
	public get average(): number {
		return this.average_;
	}

	/**
	 * Pushes a new value into the buffer, dropping the oldest if there is more
	 * than the buffer can fit.
	 * @param value - The new value.
	 */
	public push(value: number): void {
		if (this.index >= this.values.length) {
			this.index = 0;
		}
		if (this.index < this.count) {
			this.sum -= this.values[this.index];
		}
		this.values[this.index] = value;
		this.sum += value;
		this.count = Math.min(this.values.length, this.count + 1);
		this.average_ = this.sum / this.count;
		this.index += 1;
	}
}

/**
 * This manages storing the frametimes across various categories for a fixed
 * amount of past frames. The mechanism for updating times is querying the GPU
 * each frame for timestamps, then asynchronously mapping a host-device buffer.
 * This leads to frames being missed, so this object is only good for gathering
 * an average. `PerformanceTracker` is unsuitable if frametimes are
 * unpredictable and the timing of mapping the backing buffer coincidentally
 * leads to aliasing of the true frametime history.
 */
export class PerformanceTracker {
	// Defined only when timestamp querying is supported
	private readonly queryBuffers:
		| {
				querySet: GPUQuerySet;
				writeBuffer: GPUBuffer;
				readBuffer: GPUBuffer;
		  }
		| undefined;
	private readonly frametimeAverages: Map<
		FrametimeCategory,
		ArithmeticSumArray
	>;

	private readonly timestampIndexMapping = new Map<
		FrametimeCategory,
		number
	>();
	private timestampQueryIndex = 0;

	private readonly uiDisplay: {
		averageFPS: number;
		frametimeControllers: Map<FrametimeCategory, LilController>;
	};

	private initialized: boolean;

	public get averageFPS(): number {
		return this.uiDisplay.averageFPS;
	}

	destroy(): void {
		this.queryBuffers?.querySet.destroy();
		this.queryBuffers?.writeBuffer.destroy();
		this.queryBuffers?.readBuffer.destroy();

		this.initialized = false;
	}

	/**
	 * Bind the frametime values and averageFPS to the passed UI, under a single
	 * top-level folder.
	 * @param gui - The GUI to bind to
	 */
	setupUI(gui: LilGUI): void {
		const performanceFolder = gui.addFolder("Performance").close();
		performanceFolder
			.add(this.uiDisplay, "averageFPS")
			.decimals(1)
			.disable()
			.name("Average FPS")
			.listen();
		FrametimeCategories.forEach((category) => {
			this.uiDisplay.frametimeControllers.set(
				category,
				performanceFolder
					.add({ value: 0 }, "value")
					.name(`${category} (ms)`)
					.decimals(6)
					.disable()
			);
		});
	}

	/**
	 * Begin each frame by calling this before any other methods. This also
	 * records the host's frame-to-frame time.
	 * @param deltaTimeMilliseconds - The time since last frame, to be
	 *  recorded for displaying the overall average FPS.
	 */
	beginFrame(deltaTimeMilliseconds: number): void {
		this.frametimeAverages.get("DrawToDraw")?.push(deltaTimeMilliseconds);
		this.timestampQueryIndex = 0;
		this.timestampIndexMapping.clear();
	}

	/**
	 * Call this before recording each interval of GPU work you wish to time. If
	 * timestamp querying is supported, this will return a query set and two
	 * indices that should be passed to the WebGPU api when starting
	 * render/compute passes. If the interval of work you wish to time spans
	 * multiple passes, pass the begin index as the start of the first pass and
	 * the end index as the end of the last pass.
	 * @see {@link GPUComputePassTimestampWrites} or
	 *  {@link GPURenderPassTimestampWrites} for how the returned value needs to
	 *  be consumed by WebGPU.
	 * @param category - The category that the GPU timestamps will be recorded
	 *  under. Calling this twice for the same category will overwrite the old
	 *  timestamps, and may lead to an overflow of the memory of the query set
	 *  causing a crash in the WebGPU instance.
	 * @returns Returns the device query set and indices that should be written
	 *  into, or `undefined` if querying is not supported.
	 */
	queueTimestampInterval(
		category: QueryCategory
	): TimestampQueryInterval | undefined {
		if (this.queryBuffers === undefined) {
			return undefined;
		}
		this.timestampIndexMapping.set(category, this.timestampQueryIndex);

		const beginWriteIndex = this.timestampQueryIndex;
		const endWriteIndex = beginWriteIndex + 1;

		this.timestampQueryIndex += 2;

		return {
			querySet: this.queryBuffers.querySet,
			beginWriteIndex: beginWriteIndex,
			endWriteIndex: endWriteIndex,
		};
	}

	/**
	 * Call this once all timed commands have been recorded. The encoder's
	 * current recording point needs to be logically after all work being timed
	 * so that there is no race-condition on the copied timestamps. This usually
	 * means just putting all the work for each `PerformanceTracker` on the same
	 * encoder.
	 * @param commandEncoder - The command encoder to record
	 * 	into.
	 */
	preSubmitCommands(commandEncoder: GPUCommandEncoder): void {
		if (
			this.queryBuffers == undefined ||
			this.queryBuffers.readBuffer.mapState !== "unmapped"
		) {
			return;
		}

		commandEncoder.resolveQuerySet(
			this.queryBuffers.querySet,
			0,
			this.timestampQueryIndex,
			this.queryBuffers.writeBuffer,
			0
		);
		commandEncoder.copyBufferToBuffer(
			this.queryBuffers.writeBuffer,
			0,
			this.queryBuffers.readBuffer,
			0,
			this.queryBuffers.readBuffer.size
		);
	}

	/**
	 * Call this after executing all command buffers with commands that touch
	 * the timing data that will be read by `PerformanceTracker`. This copies
	 * all the timing and updates the bound UI.
	 */
	postSubmitCommands(): void {
		this.uiDisplay.averageFPS =
			1000.0 /
			(this.frametimeAverages.get("DrawToDraw")?.average ?? 1000.0);

		if (
			this.queryBuffers == undefined ||
			this.queryBuffers.readBuffer.mapState !== "unmapped"
		) {
			return;
		}
		const buffer = this.queryBuffers.readBuffer;

		/*
		 * It's okay to throw away this promise, since we just want to update
		 * performance whenever the buffer is available. We could rotate them,
		 * but that would be extra work and sampling whatever frames we can
		 * is okay.
		 */
		buffer
			.mapAsync(GPUMapMode.READ, 0, buffer.size)
			.then(() => {
				const timestampsView = new BigInt64Array(
					buffer.getMappedRange(0, buffer.size)
				);
				this.timestampIndexMapping.forEach((value, key) => {
					const MS_PER_NS = 1000000;
					const timeMilliseconds =
						Number(
							timestampsView.at(value + 1)! -
								timestampsView.at(value)!
						) / MS_PER_NS;
					this.frametimeAverages.get(key)?.push(timeMilliseconds);
				});

				FrametimeCategories.forEach((category) => {
					const averageMilliseconds =
						this.frametimeAverages.get(category)?.average;
					if (averageMilliseconds === undefined) {
						return;
					}

					this.uiDisplay.frametimeControllers
						.get(category)
						?.setValue(averageMilliseconds);
				});

				buffer.unmap();
			})
			.catch((reason) => {
				if (!this.initialized) {
					return;
				}

				console.error(
					new Error(
						`Failed while retrieving frametime values from GPU:`,
						{ cause: reason }
					)
				);
			});
	}

	constructor(device: GPUDevice) {
		const FRAMETIME_SAMPLE_SIZE = 400;

		this.frametimeAverages = new Map([
			["DrawToDraw", new ArithmeticSumArray(FRAMETIME_SAMPLE_SIZE)],
		]);
		this.uiDisplay = {
			averageFPS: 0.0,
			frametimeControllers: new Map(),
		};

		if (!device.features.has("timestamp-query")) {
			console.warn(
				"WebGPU feature 'timestamp-query' is not supported. Continuing, but without performance information about specific stages."
			);

			this.initialized = true;
			return;
		}

		// Space for start & end for each step
		// webgpu timestamps are 64 bit nanoseconds
		const BYTES_PER_TIMESTAMP_SAMPLE = 8;
		const numberOfTimestamps = 2 * QueryCategories.length;
		this.queryBuffers = {
			querySet: device.createQuerySet({
				type: "timestamp",
				count: numberOfTimestamps,
			}),
			writeBuffer: device.createBuffer({
				size: BYTES_PER_TIMESTAMP_SAMPLE * numberOfTimestamps,
				usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.QUERY_RESOLVE,
			}),
			readBuffer: device.createBuffer({
				size: BYTES_PER_TIMESTAMP_SAMPLE * numberOfTimestamps,
				usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
			}),
		};
		QueryCategories.forEach((category) => {
			this.frametimeAverages.set(
				category,
				new ArithmeticSumArray(FRAMETIME_SAMPLE_SIZE)
			);
		});

		this.initialized = true;
	}
}
