import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EmbeddedReadme } from "../lib/webgpu/EmbeddedReadme";
import { AppLoader } from "../lib/webgpu/WebGPUSamplePage";
import { BrowserRouter, Route, Routes } from "react-router";
import { SampleID, SampleIDs } from "../lib/webgpu/Samples";

import "./Demo.css";

const root = document.getElementById("root")!;

const SamplePage = ({ sampleID }: { sampleID: SampleID }) => {
	return (
		<>
			<SampleDirectory />
			<AppLoader sampleID={sampleID} />
			<EmbeddedReadme sampleID={sampleID} />
		</>
	);
};
const SampleDirectory = () => {
	const children = SampleIDs.map((value) => {
		return (
			<a key={value} href={`/${value}`}>
				{value}
			</a>
		);
	});
	return (
		<div
			style={{
				display: "flex",
				gap: "0.5rem",
				alignSelf: "center",
			}}
		>
			<a href={`/`}>index</a>
			{children}
		</div>
	);
};

createRoot(root).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route index element={<SampleDirectory />} />
				{SampleIDs.map((sampleID) => {
					return (
						<Route
							key={sampleID}
							path={sampleID}
							element={<SamplePage sampleID={sampleID} />}
						/>
					);
				})}
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
