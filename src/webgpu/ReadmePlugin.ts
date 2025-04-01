import { createFilter, PluginOption, TransformResult } from "vite";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import path from "path";
import rehypeRaw from "rehype-raw";
import { Nodes, Root } from "hast";
import { visit } from "unist-util-visit";

interface ReadmePluginOptions {
	include?: string;
	exclude?: string;
}

/**
 * Rehype plugin that finds our specifically formatted sources/citations in the
 * readme, and wraps them in nicer divs.
 */
const rehypeCitation = () => {
	const modify = (node: Nodes): void => {
		if (node.type !== "element") {
			return;
		}

		if (node.tagName !== "p") {
			return;
		}

		const [anchor, ...rest] = node.children;

		if (
			anchor.type !== "element" ||
			anchor.tagName !== "a" ||
			anchor.properties.className === undefined
		) {
			return;
		}

		const className = anchor.properties.className;
		if (!Array.isArray(className) || !className.includes("citation")) {
			return;
		}

		node.tagName = "div";
		node.properties = {
			id: anchor.properties.id ?? undefined,
			className: ["webgpu-samples-citation"],
		};

		anchor.properties = {};
		anchor.tagName = "div";

		node.children = [
			anchor,
			{
				type: "element",
				tagName: "div",
				properties: { className: ["webgpu-samples-citation-text"] },
				children: rest,
			},
		];
	};

	return function transformer(tree: Root): void {
		visit(tree, "element", function (node) {
			modify(node);
		});
	};
};

/**
 * Formatting of the markdown READMEs in a style specific to this project.
 * This means handling a subset of embedded html, formatting citations that
 * appear in a certain style, etc.
 *
 * @see {@link https://vite.dev/config/} for how to use this plugin.
 * @returns The Vite {@link PluginOption}.
 */
export default function sampleReadme(
	pluginOptions?: ReadmePluginOptions
): PluginOption {
	pluginOptions = {
		include: "**/*.md",
		exclude: "",
		...pluginOptions,
	};

	const filter = createFilter(pluginOptions.include, pluginOptions.exclude);

	const processor = unified()
		.use(remarkParse)
		.use(remarkMath)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeCitation)
		.use(rehypeMathjax)
		.use(rehypePrismPlus)
		.use(rehypeStringify);

	return {
		name: "sample-readme",
		transform(src: string, id: string): TransformResult | undefined {
			id = path.resolve(id);
			if (!filter(id)) return undefined;

			const stringified = processor.processSync(src).toString();

			return {
				code: `export default \`${stringified}\``,
				map: { mappings: "" },
			} satisfies TransformResult;
		},
	} satisfies PluginOption;
}
