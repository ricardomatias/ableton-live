import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import progress from 'rollup-plugin-progress';
import typescript from 'rollup-plugin-typescript2';

const extensions = [
	'.js', '.ts',
];

export default [
	{
		input: 'lib/index.ts',
		output: [
			{
				file: 'build/esm/index.js',
				format: 'esm',
			},
			{
				file: 'build/cjs/index.js',
				format: 'cjs',
				sourcemap: true,
			},
		],
		plugins: [
			del({ targets: 'build/*' }),
			resolve({ extensions, preferBuiltins: true }),
			commonjs(),
			cleanup({
				comments: 'none',
				compactComments: false,
			}),
			typescript(),
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
