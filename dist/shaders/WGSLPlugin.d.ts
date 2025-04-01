import { PluginOption } from 'vite';
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
export declare const wgslPlugin: () => PluginOption;
