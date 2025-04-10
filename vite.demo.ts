/// <reference types="vitest/config" />

/**
 * This separate config builds not in library mode, and outputs to a separate
 * folder. This bundles in the demo page located in './src/', and allows for
 * serving via e.g. vite preview or a basic http-server.
 *
 * This is intended for local testing, and the outDir is not to be committed to
 * source control.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { wgslPlugin } from "./lib/shaders/WGSLPlugin";
import sampleReadme from "./lib/webgpu/ReadmePlugin";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [react(), wgslPlugin(), sampleReadme()],
	build: {
		outDir: path.resolve(__dirname, "demo"),
	},
});
