import { PluginOption } from 'vite';
interface ReadmePluginOptions {
    include?: string;
    exclude?: string;
}
/**
 * Formatting of the markdown READMEs in a style specific to this project.
 * This means handling a subset of embedded html, formatting citations that
 * appear in a certain style, etc.
 *
 * @see {@link https://vite.dev/config/} for how to use this plugin.
 * @returns The Vite {@link PluginOption}.
 */
export default function sampleReadme(pluginOptions?: ReadmePluginOptions): PluginOption;
export {};
