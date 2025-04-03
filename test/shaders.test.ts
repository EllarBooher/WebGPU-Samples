import { assert, expect, it, test } from "vitest";
import { packShaders } from "../lib/shaders/Shaders";

import fs from "node:fs";
import path from "node:path";

it("packShaders", () => {
	const testShaderRelativePaths = [
		"sky-sea/atmosphere/aerial_perspective_LUT.wgsl",
		"sky-sea/atmosphere/multiscatter_LUT.wgsl",
		"sky-sea/atmosphere/skyview_LUT.wgsl",
		"sky-sea/atmosphere/transmittance_LUT.wgsl",
		"sky-sea/ocean/fourier_waves.wgsl",
		"sky-sea/ocean/wave_surface_displacement.wgsl",
		"sky-sea/util/fft.wgsl",
		"sky-sea/util/mipmap.wgsl",
		"sky-sea/atmosphere_camera.wgsl",
		"sky-sea/fullscreen_quad.wgsl",
	];

	const shadersRootPath = path.join(import.meta.dirname, "shaders");

	testShaderRelativePaths.forEach((relative, index) => {
		const testFilePath = path.join(shadersRootPath, relative);
		const testSource = fs.readFileSync(testFilePath).toString();
		const result = packShaders(
			testFilePath,
			testSource,
			shadersRootPath,
			false
		);
		expect(result, index.toString()).toMatchSnapshot();
	});
});
