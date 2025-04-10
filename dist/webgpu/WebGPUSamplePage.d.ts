import { default as React } from 'react';
import { SampleID } from './Samples';
/**
 * A component that handles the initialization of the rendering application for
 * a given sample, before serving it on a canvas.
 *
 * By default, the sample's root div is a row flexbox. Its height is unmanaged
 * and will expand with the UI. Pass a height or other CSS via
 * {@link styleOverrides} to manage the container's shape. The UI will scroll
 * vertically when overflowing.
 *
 * @param sample - The sample load, run, and display.
 * @param styleOverrides - Optional CSS properties to pass to the outermost div,
 *  useful for controlling the width and height.
 */
export declare const AppLoader: ({ sampleID, styleOverrides, }: {
    sampleID: SampleID;
    styleOverrides?: React.CSSProperties;
}) => JSX.Element;
