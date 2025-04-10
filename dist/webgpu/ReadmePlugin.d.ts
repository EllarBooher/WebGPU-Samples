import { PluginOption } from 'vite';
interface ReadmePluginOptions {
    include?: string;
    exclude?: string;
}
/**
 * Processes imported .md READMEs in a style specific to this project, turning
 * them into HTML that can be embedded. We do various project-specific steps
 * like handling inline HTML, formatting citations that occur in a specific
 * hierarchy, and more.
 *
 * We inline the HTML assets into the .js modules. The assets come directly from
 * the package and are sanitized before being serialized, so this is relatively safe.
 *
 * @see {@link https://vite.dev/config/} for how to use this plugin.
 * @returns The Vite {@link PluginOption}.
 */
export default function sampleReadme(pluginOptions?: ReadmePluginOptions): PluginOption;
export {};
