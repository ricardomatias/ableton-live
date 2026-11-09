import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default tseslint.config(
	{
		ignores: ['build/**', 'docs/**', 'external/**', 'node_modules/**'],
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			// * Live's object model is dynamic and untyped on the wire; `any` is deliberate
			// * across the bridge (tsconfig also sets noImplicitAny: false).
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
		},
	},
	// * must stay last: turns off every rule that would fight Prettier
	prettier
);
