import { UBO } from "./UBO";
import DFFTShaderPak from "../../../shaders/sky-sea/util/fft.wgsl";

class DFFTParametersUBO extends UBO {
	public readonly data: {
		log_2_size: number;
		size: number;
		b_inverse: boolean;
	} = {
		log_2_size: 1,
		size: 2,
		b_inverse: false,
	};

	constructor(device: GPUDevice) {
		const FLOAT_COUNT = 3;
		super(device, FLOAT_COUNT, "DFFT Parameters UBO");
	}

	protected override packed(): ArrayBuffer {
		const buffer = new ArrayBuffer(this.buffer.size);
		const view = new DataView(buffer);

		view.setUint32(0, this.data.log_2_size, true);
		view.setUint32(4, this.data.size, true);
		view.setFloat32(8, this.data.b_inverse ? 1.0 : 0.0, true);

		return buffer;
	}
}

// We store complex numbers as vec4<f32>
const BYTES_PER_COMPLEX_BUFFER_ELEMENT = 16;
const REQUIRED_OUTPUT_FORMAT: GPUTextureFormat = "rgba16float";

/**
 * This contains the resources for performing a 2D discrete fast fourier
 * transform on a square grid. It supports 2 parallel executions at the same
 * time, if you pack two complex pairs into the four channel RGBA input data.
 */
export class DFFTResources {
	private parametersUBO: DFFTParametersUBO;
	private butterfliesBuffer: GPUBuffer;

	private gridSize3D: {
		width: number;
		height: number;
		depthOrArrayLayers: number;
	};

	/*
	 * We work with buffers instead of textures, since webgpu is restrictive on
	 * which storage textures can be read_write without extensions. A possible
	 * workaround is using two functions for the perform kernel, identical up to
	 * swapping source/destination buffer. This would save copying during IO, but
	 * might not be necessary.
	 */
	private complexBuffer0: GPUBuffer;
	private complexBuffer1: GPUBuffer;
	private stepCounterBuffer: GPUBuffer;
	private outputTexture: GPUTexture;

	/*
	 * @group(0) @binding(0) var<uniform> u_parameters: DFFTParameters;
	 * @group(0) @binding(1) var<storage, write> out_butterflies_log2n_by_n: array<TwoPointButterfly>;
	 */
	private butterfliesBindGroup: GPUBindGroup;
	private computeButterfliesKernel: GPUComputePipeline;

	/*
	 * @group(0) @binding(0) var<uniform> u_parameters: DFFTParameters;
	 * @group(0) @binding(1) var<storage, read> butterflies_log2n_by_n: array<TwoPointButterfly>;
	 * @group(0) @binding(2) var<storage, read_write> buffer_0: array<vec2<f32>>;
	 * @group(0) @binding(3) var<storage, read_write> buffer_1: array<vec2<f32>>;
	 * @group(0) @binding(4) var<uniform> step_counter: u32;
	 * @group(0) @binding(5) var<uniform, read_write> out_half_precision_buffer: array<vec4<f16>>;
	 */
	private performBindGroup: GPUBindGroup;
	private performKernel: GPUComputePipeline;
	private performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel: GPUComputePipeline;

	/*
	 * @group(0) @binding(0) var<storage, read_write> out_step_counter: u32;
	 */
	private stepCounterBindGroup: GPUBindGroup;
	private incrementStepCounterKernel: GPUComputePipeline;
	private resetStepCounterKernel: GPUComputePipeline;

	/**
	 * Initializes all the pipelines and intermediate buffers for the
	 * performance of the DFFT on a square grid of size 2^N, where N is
	 * {@link log2GridSize}.
	 * @param device - The WebGPU device to use.
	 * @param log2GridSize - The exponent used to calculate the grid
	 *  size. Must be greater than 4.
	 */
	constructor(device: GPUDevice, log2GridSize: number, layerCount: number) {
		if (log2GridSize < 5) {
			throw new RangeError("gridSizeExponent must be greater than 4.");
		}
		if (!Number.isFinite(layerCount) || layerCount < 1) {
			throw new RangeError(`layerCount of ${layerCount} is invalid`);
		}
		const gridSize = Math.pow(2, log2GridSize);

		this.gridSize3D = {
			width: gridSize,
			height: gridSize,
			depthOrArrayLayers: layerCount,
		};
		const textureTexelCount =
			this.gridSize3D.width *
			this.gridSize3D.height *
			this.gridSize3D.depthOrArrayLayers;

		this.parametersUBO = new DFFTParametersUBO(device);
		this.parametersUBO.data.log_2_size = log2GridSize;
		this.parametersUBO.data.size = gridSize;
		this.parametersUBO.data.b_inverse = false;

		this.parametersUBO.writeToGPU(device.queue);

		const DFFT_BUTTERFLY_SIZE_BYTES = 16;
		this.butterfliesBuffer = device.createBuffer({
			label: "DFFT Precompute Stage Steps",
			size: log2GridSize * gridSize * DFFT_BUTTERFLY_SIZE_BYTES,
			usage: GPUBufferUsage.STORAGE,
		});

		const shaderModule = device.createShaderModule({
			label: "DFFT Precompute Stage",
			code: DFFTShaderPak,
		});

		const precomputeBindGroup0Layout = device.createBindGroupLayout({
			label: "DFFT Precompute Stage Group 0",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "uniform" },
				},
				{
					binding: 1,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "storage" },
				},
			],
		});

		this.butterfliesBindGroup = device.createBindGroup({
			label: "DFFT Precompute Stage Group 0",
			layout: precomputeBindGroup0Layout,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.parametersUBO.buffer,
					},
				},
				{
					binding: 1,
					resource: { buffer: this.butterfliesBuffer },
				},
			],
		});

		const precomputePipelineLayout = device.createPipelineLayout({
			label: "DFFT Precompute Steps Kernel",
			bindGroupLayouts: [precomputeBindGroup0Layout],
		});

		this.computeButterfliesKernel = device.createComputePipeline({
			label: "DFFT Precompute Stage",
			compute: {
				module: shaderModule,
				entryPoint: "precomputeDFFTInstructions",
			},
			layout: precomputePipelineLayout,
		});

		const performBindGroup0Layout = device.createBindGroupLayout({
			label: "DFFT Perform Group 0",
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "uniform" },
				},
				{
					binding: 2,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "read-only-storage" },
				},
				{
					binding: 3,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "storage" },
				},
				{
					binding: 4,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "storage" },
				},
				{
					binding: 5,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "uniform" },
				},
				{
					binding: 6,
					visibility: GPUShaderStage.COMPUTE,
					storageTexture: {
						format: REQUIRED_OUTPUT_FORMAT,
						viewDimension: "2d-array",
						access: "write-only",
					},
				},
			],
		});

		this.complexBuffer0 = device.createBuffer({
			label: "DFFT Buffer 0",
			size: textureTexelCount * BYTES_PER_COMPLEX_BUFFER_ELEMENT,
			usage:
				GPUBufferUsage.STORAGE |
				GPUBufferUsage.COPY_SRC |
				GPUBufferUsage.COPY_DST,
		});

		this.complexBuffer1 = device.createBuffer({
			label: "DFFT Buffer 1",
			size: this.complexBuffer0.size,
			usage: this.complexBuffer0.usage,
		});

		const STEP_COUNTER_BUFFER_SIZE = 4;
		this.stepCounterBuffer = device.createBuffer({
			label: "DFFT Step Counter",
			size: STEP_COUNTER_BUFFER_SIZE,
			usage:
				GPUBufferUsage.COPY_DST |
				GPUBufferUsage.STORAGE |
				GPUBufferUsage.UNIFORM,
		});
		const stepCounterInitial = new Uint32Array(1);
		stepCounterInitial[0] = 0;
		device.queue.writeBuffer(this.stepCounterBuffer, 0, stepCounterInitial);

		this.outputTexture = device.createTexture({
			label: "DFFT Output Texture",
			format: REQUIRED_OUTPUT_FORMAT,
			size: this.gridSize3D,
			usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC,
		});

		this.performBindGroup = device.createBindGroup({
			label: "DFFT Perform Group 0",
			layout: performBindGroup0Layout,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.parametersUBO.buffer,
					},
				},
				{
					binding: 2,
					resource: { buffer: this.butterfliesBuffer },
				},
				{
					binding: 3,
					resource: { buffer: this.complexBuffer0 },
				},
				{
					binding: 4,
					resource: { buffer: this.complexBuffer1 },
				},
				{
					binding: 5,
					resource: { buffer: this.stepCounterBuffer },
				},
				{
					binding: 6,
					resource: this.outputTexture.createView(),
				},
			],
		});

		const performPipelineLayout = device.createPipelineLayout({
			label: "DFFT Perform",
			bindGroupLayouts: [performBindGroup0Layout],
		});

		this.performKernel = device.createComputePipeline({
			label: "DFFT Perform DFFT Step",
			compute: {
				module: shaderModule,
				entryPoint: "performDFFTStep",
			},
			layout: performPipelineLayout,
		});
		this.performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel =
			device.createComputePipeline({
				label: "DFFT Perform Swap Even Signs",
				compute: {
					module: shaderModule,
					entryPoint:
						"performSwapEvenSignsAndCopyToHalfPrecisionOutput",
				},
				layout: performPipelineLayout,
			});

		const stepCounterBindGroupLayout = device.createBindGroupLayout({
			label: "DFFT Step Counter Bind Group 0",
			entries: [
				{
					binding: 7,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "storage" },
				},
			],
		});

		this.stepCounterBindGroup = device.createBindGroup({
			label: "DFFT Step Counter Bind Group 0",
			layout: stepCounterBindGroupLayout,
			entries: [
				{
					binding: 7,
					resource: { buffer: this.stepCounterBuffer },
				},
			],
		});

		const stepCounterPipelineLayout = device.createPipelineLayout({
			label: "DFFT Step Counter",
			bindGroupLayouts: [stepCounterBindGroupLayout],
		});
		this.incrementStepCounterKernel = device.createComputePipeline({
			label: "DFFT Increment Step Counter Kernel",
			layout: stepCounterPipelineLayout,
			compute: {
				module: shaderModule,
				entryPoint: "incrementStepCounter",
			},
		});
		this.resetStepCounterKernel = device.createComputePipeline({
			label: "DFFT Reset Step Counter Kernel",
			layout: stepCounterPipelineLayout,
			compute: {
				module: shaderModule,
				entryPoint: "resetStepCounter",
			},
		});

		this.parametersUBO.data.b_inverse = true;
		this.parametersUBO.writeToGPU(device.queue);

		const commandEncoder = device.createCommandEncoder({
			label: "DFFT Precompute",
		});
		const passEncoder = commandEncoder.beginComputePass({
			label: "DFFT Precompute Steps",
		});
		passEncoder.setPipeline(this.computeButterfliesKernel);
		passEncoder.setBindGroup(0, this.butterfliesBindGroup);
		passEncoder.dispatchWorkgroups(gridSize / 2 / 2, 1);
		passEncoder.end();

		device.queue.submit([commandEncoder.finish()]);
	}

	private recordPerformOnBuffer0(
		commandEncoder: GPUCommandEncoder,
		endTimestampWrites: GPUComputePassTimestampWrites | undefined
	): void {
		const stepCount = 2 * this.parametersUBO.data.log_2_size;

		const passEncoder = commandEncoder.beginComputePass({
			label: "DFFT Perform",
			timestampWrites: endTimestampWrites,
		});

		for (let step = 0; step < stepCount; step++) {
			if (step === 0) {
				passEncoder.setPipeline(this.resetStepCounterKernel);
				passEncoder.setBindGroup(0, this.stepCounterBindGroup);
				passEncoder.dispatchWorkgroups(1);
			} else {
				passEncoder.setPipeline(this.incrementStepCounterKernel);
				passEncoder.setBindGroup(0, this.stepCounterBindGroup);
				passEncoder.dispatchWorkgroups(1);
			}
			passEncoder.setPipeline(this.performKernel);
			passEncoder.setBindGroup(0, this.performBindGroup);
			passEncoder.dispatchWorkgroups(
				this.gridSize3D.width / 16,
				this.gridSize3D.height / 16,
				this.gridSize3D.depthOrArrayLayers / 1
			);
		}

		passEncoder.setPipeline(
			this.performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel
		);
		passEncoder.setBindGroup(0, this.performBindGroup);
		passEncoder.dispatchWorkgroups(
			this.gridSize3D.width / 16,
			this.gridSize3D.height / 16,
			this.gridSize3D.depthOrArrayLayers / 1
		);

		passEncoder.end();
	}

	/**
	 * Performs two parallel Discrete Fast Fourier Transforms on a 2D square
	 * grid of pairs of complex numbers.
	 * - The source and destination textures must be 2D. They must be square and
	 *   match the size passed during initialization. The source must be
	 *   {@link REQUIRED_INPUT_FORMAT} and the destination must be
	 *   {@link REQUIRED_OUTPUT_FORMAT}. This method will throw an error upon
	 *   any incompatibilities.
	 * - For consideration if parameter {@link inverse} is true: Typically, the
	 *   inverse of the forward fourier transform needs to be scaled by 1/N,
	 *   where N is the size of the input data (N^2 in the case of our 2D
	 *   transform). We skip this, and it is up to the consumer of the output to
	 *   scale or interpret the data as needed.
	 * @param device - The WebGPU device to use.
	 * @param commandEncoder - The command encoder to record
	 *  into.
	 * @param sourceTextureArray - The texture to copy the input
	 *  from.
	 * @param destinationTextureArray - The texture to copy the
	 *  output into.
	 * @param inverse - Whether to perform the inverse Fourier
	 *  transform instead.
	 * @param endTimestampWrites -
	 * deprecated
	 */
	recordPerform(
		device: GPUDevice,
		commandEncoder: GPUCommandEncoder,
		sourceTextureArray: GPUTexture,
		destinationTextureArray: GPUTexture,
		inverse: boolean,
		endTimestampWrites: GPUComputePassTimestampWrites | undefined
	): void {
		// We require this format so it maps perfectly to our buffers of complex numbers (WGSL type: vec4<f32>)
		const REQUIRED_INPUT_FORMAT: GPUTextureFormat = "rgba32float";
		if (sourceTextureArray.format != REQUIRED_INPUT_FORMAT) {
			throw RangeError(
				`sourceTexture (format ${sourceTextureArray.format}) must be ${REQUIRED_INPUT_FORMAT}`
			);
		}
		if (destinationTextureArray.format != REQUIRED_OUTPUT_FORMAT) {
			throw RangeError(
				`destinationArray (format ${sourceTextureArray.format}) must be ${REQUIRED_INPUT_FORMAT}`
			);
		}
		if (
			sourceTextureArray.width != destinationTextureArray.width ||
			sourceTextureArray.height != destinationTextureArray.height ||
			sourceTextureArray.depthOrArrayLayers !=
				destinationTextureArray.depthOrArrayLayers
		) {
			throw RangeError(
				`SourceTexture ${sourceTextureArray.label} does not match destination texture ${destinationTextureArray.label} extent`
			);
		}

		this.parametersUBO.data.b_inverse = inverse;
		this.parametersUBO.writeToGPU(device.queue);

		commandEncoder.copyTextureToBuffer(
			{ texture: sourceTextureArray },
			{
				buffer: this.complexBuffer0,
				bytesPerRow:
					this.gridSize3D.width * BYTES_PER_COMPLEX_BUFFER_ELEMENT,
				rowsPerImage: this.gridSize3D.height,
			},
			this.gridSize3D
		);

		this.recordPerformOnBuffer0(commandEncoder, endTimestampWrites);

		commandEncoder.copyTextureToTexture(
			{
				texture: this.outputTexture,
			},
			{
				texture: destinationTextureArray,
			},
			this.gridSize3D
		);
	}
}
