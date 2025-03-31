import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsdoc from "eslint-plugin-tsdoc";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		name: "Typescript",
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
		],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				project: ["./tsconfig.node.json", "./tsconfig.app.json"],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: { react: { version: "18.3" } },
		plugins: {
			react,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			tsdoc: tsdoc,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			...react.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					// Ignore just one underscore
					// https://stackoverflow.com/a/78734642
					argsIgnorePattern: "^_[^_].*$|^_$",
					varsIgnorePattern: "^_[^_].*$|^_$",
					caughtErrorsIgnorePattern: "^_[^_].*$|^_$",
				},
			],
			"@typescript-eslint/explicit-function-return-type": "error",
			"tsdoc/syntax": "warn",
		},
	}
);
