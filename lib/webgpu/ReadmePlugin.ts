import { createFilter, PluginOption } from "vite";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import path from "path";
import rehypeRaw from "rehype-raw";
import { Nodes, Root } from "hast";
import { visit } from "unist-util-visit";
import { TransformResult } from "rollup";

interface ReadmePluginOptions {
	include?: string;
	exclude?: string;
}

interface CitationOptions {
	hashIDPrefix?: string;
}

/**
 * Rehype plugin that finds our specifically formatted sources/citations in the
 * readme, and wraps them in nicer divs.
 */
const rehypeCitation = (options?: CitationOptions) => {
	const modify = (node: Nodes): void => {
		if (node.type !== "element") {
			return;
		}

		if (
			options?.hashIDPrefix != undefined &&
			node.tagName === "a" &&
			typeof node.properties.href === "string"
		) {
			// Find links of the form #foo-bar, and prefix the link.
			// This is useful in the case of sanitization, which often mangles IDs.
			const hashHrefParsed = /^#(.*)/.exec(node.properties.href);
			const hrefID = hashHrefParsed?.[1];
			if (hrefID != undefined) {
				node.properties.href = `#${options?.hashIDPrefix}${hrefID}`;
			} else if (hashHrefParsed != null) {
				node.properties.href = "";
			}
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
			console.log(anchor);
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
		.use(rehypeCitation, { hashIDPrefix: "user-content-" })
		.use(rehypeSanitize, {
			...defaultSchema,
			attributes: {
				...defaultSchema.attributes,
				div: [
					...(defaultSchema.attributes?.div ?? []),
					[
						"className",
						"webgpu-samples-citation",
						"webgpu-samples-citation-text",
					],
				],
			},
		})
		.use(rehypeMathjax)
		.use(rehypePrismPlus)
		.use(rehypeStringify);

	return {
		name: "sample-readme",
		transform(src: string, id: string): TransformResult {
			id = path.resolve(id);
			if (!filter(id)) return undefined;

			const stringified = processor.processSync(src).toString();

			return `export default \`${stringified}\``;
		},
	} satisfies PluginOption;
}
