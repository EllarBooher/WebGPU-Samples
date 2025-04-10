/**
 * Preprocesses the given WebGPU shader language source file in plaintext.
 * @param filePath - The path to the shader source file.
 * @param source - The plaintext of the shader source file.
 * @returns The processed the source and
 * 	the referenced includes that were discovered during the process.
 */
export declare function packShaders(filePath: string, source: string, shadersRootPath: string, quiet: boolean): {
    source: string;
    includes: string[];
};
