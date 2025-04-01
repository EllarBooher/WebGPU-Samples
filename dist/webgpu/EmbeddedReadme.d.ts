import { SampleID } from './Samples';
/**
 * Formatting of the markdown READMEs in a style specific to this project.
 * This means handling a subset of embedded html, formatting citations that
 * appear in a certain style, etc.
 *
 * TODO: Investigate other options for markup that work well for embedding on
 * the page but also viewing in the repo
 */
export declare const EmbeddedReadme: import('react').NamedExoticComponent<{
    sampleID: SampleID;
}>;
