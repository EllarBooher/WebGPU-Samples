/**
 * Default exports the plaintext contents of a WebGPU shader language source
 * file.
 */
declare module "*.wgsl" {
	const shader: string;
	export default shader;
}
