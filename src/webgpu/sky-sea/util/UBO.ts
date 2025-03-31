const BYTES_PER_FLOAT32 = 4;

/**
 * A wrapper around a device buffer that handles packing and uploading the
 * proper byte representation for a host-shareable and constructible GPU
 * type.
 */
export abstract class UBO {
	/**
	 * The device buffer that is uploaded to.
	 */
	public readonly buffer: GPUBuffer;

	/**
	 * Allocates the backing buffer with a given size.
	 * @param device - The WebGPU device to use.
	 * @param lengthFloat32 - The length of the buffer in 32-bit
	 *  (4-byte) floats.
	 * @param label - A label for debugging purposes, used by WebGPU.
	 */
	constructor(device: GPUDevice, lengthFloat32: number, label: string) {
		this.buffer = device.createBuffer({
			size: lengthFloat32 * BYTES_PER_FLOAT32,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
			label: label,
		});
	}

	/**
	 * Synthesizes the bytes that will be written to the UBO buffer.
	 * @returns A packed array of the bytes that must match the exact
	 *  representation of the mirrored type on the device.
	 */
	protected abstract packed(): ArrayBuffer;

	/**
	 * Writes the bytes of the host data into the device buffer.
	 * @param queue - The device queue to submit the synchronous
	 *  write command into.
	 */
	public writeToGPU(queue: GPUQueue): void {
		const values = this.packed();

		if (values.byteLength != this.buffer.size) {
			console.warn(
				`GPUBuffer label: '${this.buffer.label}' uploaded with improper size. Expected: ${this.buffer.size} bytes, got ${values.byteLength} bytes.`
			);
		}

		queue.writeBuffer(this.buffer, 0, values);
	}
}
