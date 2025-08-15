import { JSX, memo, useEffect, useState } from "react";
import parseToHTML, { DOMNode, domToReact, Element } from "html-react-parser";
import { SampleID, SampleInitDescriptorByID } from "./Samples";

import "./EmbeddedReadme.css";
import "prism-themes/themes/prism-one-dark.min.css";

const repoRoot =
	"https://github.com/EllarBooher/WebGPU-Samples/tree/main/lib/webgpu";

/**
 * Formatting of the markdown READMEs in a style specific to this project.
 * This means handling a subset of embedded html, formatting citations that
 * appear in a certain style, etc.
 *
 * TODO: Investigate other options for markup that work well for embedding on
 * the page but also viewing in the repo
 */
export const EmbeddedReadme = memo(function EmbeddedReadme({
	sampleID,
}: {
	sampleID: SampleID;
}) {
	const [readmeText, setReadmeText] = useState<string>();

	const projectFolder = SampleInitDescriptorByID.get(sampleID)?.projectFolder;

	useEffect(() => {
		if (projectFolder === undefined) {
			setReadmeText(undefined);
			return;
		}

		// We parse the HTML in an unsafe way, so make sure only markdown from a
		// trusted source is imported/fetched.
		import(`./${projectFolder}/README.md`)
			.then((value) => {
				const markdownModule = value as typeof import("*.md");
				if (typeof markdownModule.default !== "string") {
					throw new Error(
						`Invalid readme markdown import, path is ${projectFolder}`
					);
				}
				setReadmeText(markdownModule.default);
			})
			.catch((err) => {
				if (err instanceof Error) {
					console.error(err);
				}
			});
	}, [projectFolder, setReadmeText]);

	if (readmeText === undefined) {
		return undefined;
	}

	const options = {
		replace(domNode: DOMNode): JSX.Element | undefined {
			const { attribs, children } = domNode as Element;
			if (attribs === undefined || children === undefined) {
				return;
			}

			const href = attribs.href;
			if (typeof href !== "string") {
				return;
			}

			// Anchor Link
			if (href.startsWith("#") === true) {
				return (
					<button
						role="link"
						className="webgpu-samples-hash-link"
						onClick={() =>
							document.getElementById(href.slice(1))?.scrollIntoView()
						}
					>
						{domToReact(children as DOMNode[], options)}
					</button>
				);
			}

			const projectRoot = `${repoRoot}/${projectFolder}/`;

			let hrefParsed: undefined | string = undefined;
			if (URL.canParse(href)) {
				hrefParsed = href;
			} else if (URL.canParse(href, projectRoot)) {
				hrefParsed = URL.parse(href, projectRoot)!.href;
			}

			return (
				<a target="_blank" rel="noopener noreferrer" href={hrefParsed}>
					{domToReact(children as DOMNode[], options)}
				</a>
			);
		},
	};

	return (
		<div className="webgpu-samples-readme-body">
			{parseToHTML(readmeText, options)}
		</div>
	);
});
