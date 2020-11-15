import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import progress from 'rollup-plugin-progress';
import typescript from 'rollup-plugin-typescript2';

const extensions = [
	'.js', '.ts',
];

const override = { compilerOptions: { module: 'ESNext' }};

export default [
	{
		input: 'lib/index.ts',
		output: [
			{
				file: 'build/esm/browser.js',
				format: 'esm',
			},
			{
				file: 'build/cjs/browser.js',
				format: 'cjs',
				sourcemap: true,
			},
		],
		external: [ 'crypto' ],
		plugins: [
			del({ targets: 'build/*' }),
			resolve({ extensions, preferBuiltins: true, browser: true }),
			replace({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE),
			}),
			cleanup({
				comments: 'none',
				compactComments: false,
			}),
			typescript({
				tsconfig: 'tsconfig.json',
				tsconfigOverride: override,
			}),
			// babel({
			// 	extensions,
			// 	'babelrc': false,
			// 	'retainLines': true,
			// 	'sourceMap': false,
			// 	'exclude': 'node_modules/**',
			// 	'presets': [
			// 		[
			// 			'@babel/preset-env',
			// 			{
			// 				'targets': {
			// 					'node': 'current',
			// 				},
			// 			},
			// 		],
			// 	],
			// 	'plugins': [
			// 		'@babel/plugin-proposal-object-rest-spread',
			// 		'@babel/plugin-proposal-class-properties',
			// 	],
			// }),
			// terser({
			// 	output: {
			// 		comments: 'all',
			// 	},
			// }),
			// copy({
			// 	targets: [
			// 		{ src: 'types/*.ts', dest: 'build' },
			// 	],
			// }),
			progress(),
		],
	},
];
