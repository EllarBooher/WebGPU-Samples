/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { wgslPlugin } from "./lib/shaders/WGSLPlugin";
import sampleReadme from "./lib/webgpu/ReadmePlugin";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [react(), wgslPlugin(), sampleReadme(), dts({ include: "lib" })],
	build: {
		outDir: path.resolve(__dirname, "dist"),
		lib: {
			entry: path.resolve(__dirname, "lib/main.ts"),
			formats: ["es"],
			fileName: () => "main.js",
		},
		rollupOptions: {
			external: ["react", "react-dom", "react-router"],
		},
	},
	test: {
		include: ["test/**/*.test.ts"],
		includeSource: ["lib/**/*.{js,ts}"],
	},
});
