import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import clear from 'rollup-plugin-clear';
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
				file: 'build/cjs/index.js',
				format: 'cjs',
				sourcemap: true,
			},
		],
		plugins: [
			clear({
				// required, point out which directories should be clear.
				targets: [ 'build' ],
				// optional, whether clear the directores when rollup recompile on --watch mode.
				watch: true, // default: false
			}),
			resolve({ extensions, preferBuiltins: true }),
			commonjs(),
			cleanup({
				comments: 'none',
				compactComments: false,
			}),
			typescript(),
			progress(),
		],
	},
];
