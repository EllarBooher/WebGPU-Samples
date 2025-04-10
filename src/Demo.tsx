import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EmbeddedReadme } from "../lib/webgpu/EmbeddedReadme";
import { AppLoader } from "../lib/webgpu/WebGPUSamplePage";
import { HashRouter, Link, Route, Routes } from "react-router";
import { SampleID, SampleIDs } from "../lib/webgpu/Samples";

import "./Demo.css";

const root = document.getElementById("root")!;

const SamplePage = ({ sampleID }: { sampleID: SampleID }) => {
	return (
		<div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
			<SampleDirectory />
			<AppLoader styleOverrides={{ height: "60svh" }} sampleID={sampleID} />
			<div style={{ maxWidth: "90ch", alignSelf: "center" }}>
				<EmbeddedReadme sampleID={sampleID} />
			</div>
		</div>
	);
};
const SampleDirectory = () => {
	const children = SampleIDs.map((value) => {
		return (
			<Link key={value} to={`/${value}`}>
				{value}
			</Link>
		);
	});
	return (
		<div
			style={{
				display: "flex",
				gap: "0.5rem",
				alignSelf: "center",
				padding: "1rem",
			}}
		>
			<Link to={`/`}>index</Link>
			{children}
		</div>
	);
};

createRoot(root).render(
	<StrictMode>
		<HashRouter>
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
		</HashRouter>
	</StrictMode>
);
