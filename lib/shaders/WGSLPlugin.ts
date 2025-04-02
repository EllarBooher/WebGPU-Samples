import { PluginOption, TransformResult, ViteDevServer } from "vite";
import { packShaders } from "./Shaders";

const modulesByInclude = new Map<string, Set<string>>();

/**
 * A Vite plugin that preprocesses the contents of each imported '.wgsl' file as
 * a transformation step.
 * - The output is valid WebGPU shader language. The inputs are not, if they
 *   include any preprocessing directives.
 * - This also attaches a {@link ViteDevServer} watcher for '.inc.wgsl' files, a
 *   custom file type used as includes for the preprocessing system. The watcher
 *   triggers hot reloads of '.wgsl' modules whose unmodified source references
 *   the include.
 * @see {@link packShaders} for details of what transformations are performed.
 * @see {@link https://vite.dev/config/} for how to use this plugin.
 * @returns The Vite {@link PluginOption}.
 */
export const wgslPlugin = (): PluginOption => ({
	name: "wgsl-plugin",
	transform: (src: string, id: string): TransformResult | undefined => {
		if (!id.endsWith(".inc.wgsl") && id.endsWith(".wgsl")) {
			const shadersRootPath = import.meta.dirname;
			const packed = packShaders(id, src, shadersRootPath, true);
			packed.includes.forEach((includeFullPath) => {
				if (!modulesByInclude.has(includeFullPath)) {
					modulesByInclude.set(includeFullPath, new Set());
				}

				modulesByInclude.get(includeFullPath)?.add(id);
			});
			return {
				code: `
          export default \`${packed.source}\`;
        `,
				map: { mappings: "" },
			} satisfies TransformResult;
		}
	},
	configureServer: (server: ViteDevServer): void => {
		/*
		 * Our shader preprocessing loads includes from disk, causing 'inc.wgsl'
		 * modules not being added to the module graph. Thus changes to
		 * .inc.wgsl do not invalidate the .wgsl modules, and even upon a hot
		 * reload the preprocess transform. To fix this, we attach a custom
		 * watcher to the dev server that causes necessary invalidations and
		 * reloads.
		 */

		const SUFFIX = ".inc.wgsl";

		server.watcher.add("**/*" + SUFFIX);
		function onWatchChange(_: string): void {
			server.hot.send({ type: "full-reload" });
		}

		const filterPath = (path: string): void => {
			if (!path.endsWith(SUFFIX)) {
				return;
			}
			modulesByInclude.get(path)?.forEach((id) => {
				const module = server.moduleGraph.getModuleById(id);
				if (module === undefined) {
					return;
				}
				server.reloadModule(module).catch((e) => {
					console.error(
						`Error while hot reloading .wgsl module ${id}: ${
							e instanceof Error ? e.message : "Unknown"
						}`
					);
				});
			});
			onWatchChange(path);
		};

		server.watcher.on("add", filterPath);
		server.watcher.on("unlink", filterPath);
		server.watcher.on("change", filterPath);
	},
});
