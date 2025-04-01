/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

import { wgslPlugin } from "./src/shaders/WGSLPlugin";
import sampleReadme from "./src/webgpu/ReadmePlugin";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [
		react(),
		wgslPlugin(),
		sampleReadme(),
		dts({ tsconfigPath: "./tsconfig.app.json" }),
	],
	build: {
		minify: false, // for easy to debug and the size is not that important
		emptyOutDir: true,
		outDir: path.resolve(__dirname, "dist"),
		lib: {
			entry: path.resolve(__dirname, "src/main.ts"),
			formats: ["es"],
			fileName: () => "main.js",
		},
		rollupOptions: {
			external: ["react", "react-dom", "react-router"],
		},
	},
	test: { includeSource: ["src/**/*.{js,ts}"] },
});
