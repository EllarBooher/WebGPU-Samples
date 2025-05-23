import fs from "node:fs";
import path from "node:path";

interface ShaderInclude {
	code: string;
	flags: ReadonlySet<string>;
}

const FLAGS_PREFIX = "#flags ";
/**
 * Find the flags definition directive, a line that lists all valid conditional
 * flags.
 */
function gatherFlags(source: string): ReadonlySet<string> {
	const flags = new Set<string>();
	source.split("\n").forEach((line) => {
		if (line.startsWith(FLAGS_PREFIX)) {
			line.trim()
				.substring(FLAGS_PREFIX.length)
				.split(" ")
				.map((value) => {
					return value.trim();
				})
				.filter((value) => {
					return value.length > 0;
				})
				.forEach((value) => flags.add(value));
		}
	});
	return flags;
}

interface SourceLocation {
	lineNumber: number;
	lineText: string;
}
type ReplaceConditionalBlocksWarnings =
	| { type: "Unexpected Flag Enabled"; flags: string[] }
	| { type: "Unexpected End of Source" }
	| ({ type: "Unexpected Flag"; flag: string } & SourceLocation)
	| ({ type: "Unexpected Conditional" } & SourceLocation);
interface ReplaceConditionalBlocksResult {
	/**
	 * The transformed source.
	 */
	expandedLines: string[];
	warnings: ReplaceConditionalBlocksWarnings[];
}
function logReplaceConditionalBlocksWarning(
	filename: string,
	source: ShaderInclude,
	warning: ReplaceConditionalBlocksWarnings
): void {
	switch (warning.type) {
		case "Unexpected Flag Enabled": {
			console.warn(
				`${
					warning.type
				}: One or more passed flags are not declared in source. Were they misspelled?
				Invalid flags: [${warning.flags.join()}]
				Declared flags: ${[...source.flags.values()].join()}`
			);
			break;
		}
		case "Unexpected End of Source": {
			console.warn(
				`${warning.type}: Reached end of source while processing a conditional block. Was an #ENDIF forgotten?`
			);
			break;
		}
		case "Unexpected Flag": {
			console.warn(
				`${warning.type}: Encountered a flag in source that is not declared. Was it misspelled?
				${warning.flag}
				Original line:
				(${filename}:${warning.lineNumber})
				${warning.lineText}`
			);
			break;
		}
		case "Unexpected Conditional": {
			console.warn(
				`${warning.type}: Encountered an unexpected conditional directive with an impossible transition.
				Original line:
				(${filename}:${warning.lineNumber})
				${warning.lineText}`
			);
			break;
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConditionalLinePrefixes = ["None", "ifdef", "else", "endif"] as const;
type ConditionalLinePrefix = (typeof ConditionalLinePrefixes)[number];

const PlaintextToLinePrefix = new Map<string, ConditionalLinePrefix>([
	["#ifdef", "ifdef"],
	["#else", "else"],
	["#endif", "endif"],
]);

function getConditionalLinePrefix(line: string): {
	prefix: ConditionalLinePrefix;
	remainder: string;
} {
	const lineTrimmed = line.trim();
	const lineFirstWord = lineTrimmed.split(" ", 1)[0];
	const prefix = PlaintextToLinePrefix.get(lineFirstWord) ?? "None";

	const remainder =
		prefix === "None"
			? lineTrimmed
			: lineTrimmed.substring(lineFirstWord.length).trim();

	return {
		prefix: prefix,
		remainder: remainder,
	};
}

/*
 * A conditional block looks like the following:
 *
 * #ifdef [FLAG]
 *
 * #else
 *
 * #endif
 *
 * FLAG is a string, taken to be all remaining characters excluding the single space after IF
 * FLAG is not any sort of expression like "TEXTURE_MODE == 2", it should look more like "ENABLE_TEXTURE_MODE_TWO"
 * FLAG is a boolean flag set outside of the include file, enabled/disabled before parsing the include
 *
 * If FLAG is enabled, only the lines between IFDEF and ELSE are kept, the others are discarded.
 * If FLAG is not enabled, only the lines between ELSE and ENDIF are kept, the others are discard.
 *
 * IFDEF and ENDIF may not be omitted.
 * ELSE may be omitted.
 *
 * At this point, nesting is not supported.
 */
function replaceConditionalBlocks(
	source: ShaderInclude,
	enabledConditions: string[] = []
): ReplaceConditionalBlocksResult {
	const result: ReplaceConditionalBlocksResult = {
		expandedLines: [],
		warnings: [],
	};

	const enabledFlags = new Set<string>(enabledConditions);

	const invalidFlags = enabledConditions.filter((flag) => {
		return !source.flags.has(flag);
	});
	if (invalidFlags.length > 0) {
		result.warnings.push({
			type: "Unexpected Flag Enabled",
			flags: invalidFlags,
		});
	}

	if (source.code.trim().length === 0) {
		return result;
	}

	enum ConditionalState {
		Outside,
		IF,
		ELSE,
	}

	let step = ConditionalState.Outside;
	let currentFlag = "";
	let keepLines = true;

	result.expandedLines.push(
		...source.code
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => {
				return !line.startsWith(FLAGS_PREFIX) && line.length > 0;
			})
			.filter((line, index) => {
				const { prefix, remainder } = getConditionalLinePrefix(line);

				if (step == ConditionalState.Outside) {
					if (prefix == "ifdef") {
						if (source.flags.has(remainder)) {
							step = ConditionalState.IF;
							currentFlag = remainder;
							keepLines = enabledFlags.has(currentFlag);
						} else {
							result.warnings.push({
								type: "Unexpected Flag",
								flag: remainder,
								lineNumber: index,
								lineText: line,
							});
						}
					} else if (prefix != "None") {
						result.warnings.push({
							type: "Unexpected Conditional",
							lineNumber: index,
							lineText: line,
						});
					}
				} else if (step == ConditionalState.IF) {
					if (prefix == "else") {
						step = ConditionalState.ELSE;
						keepLines = !enabledFlags.has(currentFlag);
					} else if (prefix == "endif") {
						step = ConditionalState.Outside;
						currentFlag = "";
						keepLines = true;
					} else if (prefix != "None") {
						result.warnings.push({
							type: "Unexpected Conditional",
							lineNumber: index,
							lineText: line,
						});
					}
				} else if (step == ConditionalState.ELSE) {
					if (prefix == "endif") {
						step = ConditionalState.Outside;
						currentFlag = "";
						keepLines = true;
					} else if (prefix != "None") {
						result.warnings.push({
							type: "Unexpected Conditional",
							lineNumber: index,
							lineText: line,
						});
					}
				}

				return keepLines && prefix == "None";
			})
	);

	if (step != ConditionalState.Outside) {
		result.warnings.push({ type: "Unexpected End of Source" });
	}

	return result;
}

/**
 * Includes are relative to one folder deeper than the shaders root.
 * For example, for a shader at 'root/sample/foo.wgsl', include paths will be relative to 'root/sample'
 */
function resolveIncludeRootPath(
	filePath: string,
	shadersRootPath: string
): string {
	// TODO: better validation for includes that escape their project, for
	// invalid or empty paths, etc
	const fileRelativePath = path
		.relative(shadersRootPath, filePath)
		.split(path.sep);
	if (fileRelativePath.length < 2 || fileRelativePath[0] == "..") {
		return shadersRootPath;
	}
	return path.join(shadersRootPath, fileRelativePath[0], path.sep);
}

function stripComments(source: string): string {
	type CommentState = "None" | "Line" | "Block";

	/*
	 * Line/block comments override any comment directives that appear later
	 *
	 * Block comments can start and end anywhere in a line, and there is no
	 * bound on the number of block comments on a line
	 *
	 * Line comments block out all remaining characters
	 *
	 * Block comments can be nested (see https://www.w3.org/TR/WGSL/#comments)
	 *
	 * Unterminated block comments are allowed, that just means all content will be
	 * stripped until end of file.
	 */
	let blockNestedCount = 0;
	let state: CommentState = "None";
	return source
		.split("\n")
		.map((line) => {
			let outLine = "";

			for (let i = 0; i < line.length; i++) {
				const outChar = line.charAt(i);
				let skip = false;
				if (line.length - i >= 1) {
					const nextTwoChars = line.substring(i, i + 2);
					switch (state) {
						case "None": {
							if (nextTwoChars === "//") {
								state = "Line";
								skip = true;
							} else if (nextTwoChars === "/*") {
								state = "Block";
								blockNestedCount += 1;
								skip = true;
							}
							break;
						}
						case "Block": {
							if (nextTwoChars === "/*") {
								blockNestedCount += 1;
								skip = true;
							} else if (nextTwoChars === "*/") {
								if (blockNestedCount > 0) blockNestedCount -= 1;
								if (blockNestedCount === 0) {
									state = "None";
								}

								skip = true;
							}
							break;
						}
					}
				}

				if (skip) i += 1;
				else if (state === "None") outLine += outChar;
			}

			// Line comments continue until the end of line, so we need to reset
			// at the end of each line
			if (state === "Line") state = "None";

			return outLine;
		})
		.filter((line) => line.trim().length > 0)
		.join("\n");
}

/**
 * Preprocesses the given WebGPU shader language source file in plaintext.
 * @param filePath - The path to the shader source file.
 * @param source - The plaintext of the shader source file.
 * @returns The processed the source and
 * 	the referenced includes that were discovered during the process.
 */
export function packShaders(
	filePath: string,
	source: string,
	shadersRootPath: string,
	quiet: boolean
): { source: string; includes: string[] } {
	const INCLUDE_PREFIX = "#include ";

	const includeMappings = new Map<string, ShaderInclude>();

	const logger = console.log;
	if (quiet) {
		console.log = (...args): void => {
			if (!quiet) {
				logger(...args);
			}
		};
	}

	console.log(`Preprocessing shader ${filePath}`);

	/*
	 * Find which project folder in shaders/ the source is in. includes will be
	 * relative to that.
	 */
	const includeWorkingPrefix = resolveIncludeRootPath(
		filePath,
		shadersRootPath
	);

	let lineIndex = 0;
	const lines = stripComments(source).split("\n");
	while (lineIndex < lines.length) {
		const line = lines[lineIndex];
		if (line.startsWith(INCLUDE_PREFIX)) {
			lines.splice(lineIndex, 1);

			const fragments = line
				.trim()
				.substring(INCLUDE_PREFIX.length)
				.split(" ")
				.map((value) => {
					return value.trim();
				})
				.filter((value) => {
					return value.length > 0;
				});
			if (fragments.length == 0) {
				console.warn(`Found include without any filename.`);
				continue;
			}

			const includeFilename = fragments.shift()!;
			const resolvedPath = path.resolve(
				includeWorkingPrefix,
				includeFilename
			);
			if (includeMappings.has(resolvedPath)) {
				console.log(
					`Skipping duplicated include ${includeFilename} which resolved to ${resolvedPath}.\n Note that deduplication is based on the resolved path, and not the identifier or file contents of the include.`
				);
				continue;
			}

			if (!fs.existsSync(resolvedPath)) {
				console.error(
					`Unrecognized WGSL include does not exist on disk: ${includeFilename} \n Resolved as: ${resolvedPath}`
				);
				continue;
			}
			const code = stripComments(
				fs.readFileSync(resolvedPath).toString()
			);
			includeMappings.set(resolvedPath, {
				code: code,
				flags: gatherFlags(code),
			});
			const includeSource = includeMappings.get(resolvedPath)!;

			console.log(
				`Including '${includeFilename}' with ${
					fragments.length
				} flag(s) '${fragments.join(",")}'. Possible flag(s) are '${[
					...includeSource.flags.values(),
				].join(",")}'`
			);
			const replaceResult = replaceConditionalBlocks(
				includeSource,
				fragments
			);
			replaceResult.warnings.forEach((warning) => {
				logReplaceConditionalBlocksWarning(
					includeFilename,
					includeSource,
					warning
				);
			});

			lines.splice(lineIndex, 0, ...replaceResult.expandedLines);
		} else {
			lineIndex += 1;
		}
	}
	const sourceOut = lines.join("\n");

	console.log = logger;

	return {
		source: sourceOut,
		includes: [...includeMappings.keys()],
	};
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it("gatherFlags", () => {
		const cases: [string, string[]][] = [
			[`#flags flag`, ["flag"]],
			[`#flags flags`, ["flags"]],
			[`#flags #flags`, ["#flags"]],
			[`#flags flag1 flag2 flag3`, ["flag1", "flag2", "flag3"]],
			[`#flags`, []],
			[`#Flags`, []],
			[`#flagss`, []],
			[`#flags `, []],
			[`#flags                                  `, []],
			[`    #flags      `, []],
			[`    #flags flag`, []],
			[
				`#flags snake_case PascalCase camelCase kebab-case`,
				["snake_case", "PascalCase", "camelCase", "kebab-case"],
			],
			[`#flags duplicate duplicate`, ["duplicate"]],
			[`#flags duplicate\n#flags duplicate`, ["duplicate"]],
			[`#flags flag1\n#flags flag2`, ["flag1", "flag2"]],
		];
		cases.forEach((pair) => {
			const [input, output] = pair;
			expect(gatherFlags(input)).toMatchObject(new Set(output));
		});
	});

	it("getConditionalLinePrefix", () => {
		const cases: [string, ReturnType<typeof getConditionalLinePrefix>][] = [
			["#ifdef foo", { prefix: "ifdef", remainder: "foo" }],
			["#else foo", { prefix: "else", remainder: "foo" }],
			["#endif foo", { prefix: "endif", remainder: "foo" }],
			["#ifdef foo\nbar", { prefix: "ifdef", remainder: "foo\nbar" }],
			["#else foo\nbar", { prefix: "else", remainder: "foo\nbar" }],
			["#endif foo\nbar", { prefix: "endif", remainder: "foo\nbar" }],
			["  #ifdef      foo", { prefix: "ifdef", remainder: "foo" }],
			["  #else      foo", { prefix: "else", remainder: "foo" }],
			["  #endif      foo", { prefix: "endif", remainder: "foo" }],
			["#ifdeffoo", { prefix: "None", remainder: "#ifdeffoo" }],
			["#elsefoo", { prefix: "None", remainder: "#elsefoo" }],
			["#endiffoo", { prefix: "None", remainder: "#endiffoo" }],
		];
		cases.forEach((pair, index) => {
			const [input, output] = pair;
			expect(
				getConditionalLinePrefix(input),
				index.toString()
			).toMatchObject(output);
		});
	});

	it("replaceConditionalBlocks", () => {
		const cases: [
			{
				source?: string;
				declaredFlags?: string[];
				definedFlags?: string[];
			},
			ReplaceConditionalBlocksResult
		][] = [
			[{}, { expandedLines: [], warnings: [] }],
			[
				{ source: `#include foo.wgsl` },
				{ expandedLines: [`#include foo.wgsl`], warnings: [] },
			],
			[
				{ source: `#ifdef FLAG` },
				{
					expandedLines: [],
					warnings: [
						{
							type: "Unexpected Flag",
							flag: "FLAG",
							lineNumber: 0,
							lineText: "#ifdef FLAG",
						},
					],
				},
			],
			[
				{ definedFlags: ["FLAG", "FOO", "BAR"] },
				{
					expandedLines: [],
					warnings: [
						{
							type: "Unexpected Flag Enabled",
							flags: ["FLAG", "FOO", "BAR"],
						},
					],
				},
			],
			[
				{ source: `#ifdef FLAG\n#else\n#endif` },
				{
					expandedLines: [],
					warnings: [
						{
							type: "Unexpected Flag",
							lineNumber: 0,
							lineText: "#ifdef FLAG",
							flag: "FLAG",
						},
						{
							type: "Unexpected Conditional",
							lineNumber: 1,
							lineText: "#else",
						},
						{
							type: "Unexpected Conditional",
							lineNumber: 2,
							lineText: "#endif",
						},
					],
				},
			],
			[
				{
					source: `#ifdef FLAG FOO\n#else\n#endif`,
					declaredFlags: ["FLAG"],
				},
				{
					expandedLines: [],
					warnings: [
						{
							type: "Unexpected Flag",
							lineNumber: 0,
							lineText: "#ifdef FLAG FOO",
							flag: "FLAG FOO",
						},
						{
							type: "Unexpected Conditional",
							lineNumber: 1,
							lineText: "#else",
						},
						{
							type: "Unexpected Conditional",
							lineNumber: 2,
							lineText: "#endif",
						},
					],
				},
			],
			[
				{
					source: `#ifdef FLAG\n#else\n#endif`,
					declaredFlags: ["FLAG"],
				},
				{
					expandedLines: [],
					warnings: [],
				},
			],
			[
				{
					source: `#ifdef FLAG\n#else\n#endif`,
					declaredFlags: ["FLAG"],
					definedFlags: ["FLAG"],
				},
				{
					expandedLines: [],
					warnings: [],
				},
			],
			[
				{
					source: `#ifdef FLAG\n`,
					declaredFlags: ["FLAG"],
				},
				{
					expandedLines: [],
					warnings: [
						{
							type: "Unexpected End of Source",
						},
					],
				},
			],
			[
				{
					source: `#ifdef FLAG\nfoo\n#else\ndisabled\n#endif`,
					declaredFlags: ["FLAG"],
					definedFlags: ["FLAG"],
				},
				{
					expandedLines: ["foo"],
					warnings: [],
				},
			],
			[
				{
					source: `#ifdef FLAG\nfoo\n#else\nbar\n#endif`,
					declaredFlags: ["FLAG"],
				},
				{
					expandedLines: ["bar"],
					warnings: [],
				},
			],
		];
		cases.forEach((pair, index) => {
			const [input, output] = pair;
			expect(
				replaceConditionalBlocks(
					{
						code: input.source ?? "",
						flags: new Set(input.declaredFlags),
					},
					input.definedFlags
				),
				index.toString()
			).toMatchObject(output);
		});
	});

	it("resolveIncludeRootPath", () => {
		const cases: [{ filePath: string; shadersRootPath: string }, string][] =
			[
				[
					{
						filePath: "C:/path/to/shaders/project/test.wgsl",
						shadersRootPath: "C:/path/to/shaders/",
					},
					path.normalize("C:/path/to/shaders/project/"),
				],
				[
					{
						filePath: "path/to/shaders/project/test.wgsl",
						shadersRootPath: "path/to/shaders/",
					},
					path.normalize("path/to/shaders/project/"),
				],
				[
					{
						filePath: "/path/to/shaders/project/test.wgsl",
						shadersRootPath: "/path/to/shaders/",
					},
					path.normalize("/path/to/shaders/project/"),
				],
				[
					{
						filePath:
							"/path/to/shaders/project with spaces/test.wgsl",
						shadersRootPath: "/path/to/shaders/",
					},
					path.normalize("/path/to/shaders/project with spaces/"),
				],
			];
		cases.forEach((pair, index) => {
			const [input, output] = pair;
			expect(
				resolveIncludeRootPath(input.filePath, input.shadersRootPath),
				index.toString()
			).toBe(output);
		});
	});

	it("stripComments", () => {
		const cases: [string, string][] = [
			["//", ""],
			["//\na", "a"],
			["/*\na\n*/", ""],
			["/*\n/*\na\n*/", ""],
			["/*\n/*\na\n*/\na\n*/", ""],
			["///*\na", "a"],
			["no comments\nno comments", "no comments\nno comments"],
			["line /* with comments */ in middle // of it", "line  in middle "],
			["line /* with /* nested */ block */ comments", "line  comments"],
			[`/*/**/*/`, ``],
			[`//\n/*/*a*/*/`, ``],
		];
		cases.forEach((pair, index) => {
			const [input, output] = pair;
			expect(stripComments(input), index.toString()).toBe(output);
		});
	});
}
