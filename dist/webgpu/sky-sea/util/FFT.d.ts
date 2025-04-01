/**
 * This contains the resources for performing a 2D discrete fast fourier
 * transform on a square grid. It supports 2 parallel executions at the same
 * time, if you pack two complex pairs into the four channel RGBA input data.
 */
export declare class DFFTResources {
    private parametersUBO;
    private butterfliesBuffer;
    private gridSize3D;
    private complexBuffer0;
    private complexBuffer1;
    private stepCounterBuffer;
    private outputTexture;
    private butterfliesBindGroup;
    private computeButterfliesKernel;
    private performBindGroup;
    private performKernel;
    private performSwapEvenSignsAndCopyToHalfPrecisionOutputKernel;
    private stepCounterBindGroup;
    private incrementStepCounterKernel;
    private resetStepCounterKernel;
    /**
     * Initializes all the pipelines and intermediate buffers for the
     * performance of the DFFT on a square grid of size 2^N, where N is
     * {@link log2GridSize}.
     * @param device - The WebGPU device to use.
     * @param log2GridSize - The exponent used to calculate the grid
     *  size. Must be greater than 4.
     */
    constructor(device: GPUDevice, log2GridSize: number, layerCount: number);
    private recordPerformOnBuffer0;
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
    recordPerform(device: GPUDevice, commandEncoder: GPUCommandEncoder, sourceTextureArray: GPUTexture, destinationTextureArray: GPUTexture, inverse: boolean, endTimestampWrites: GPUComputePassTimestampWrites | undefined): void;
}
