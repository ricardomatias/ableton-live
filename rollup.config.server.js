import resolve from 'rollup-plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
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
				file: 'build/cjs/server.js',
				format: 'cjs',
				sourcemap: true,
			},
		],
		external: [ 'crypto' ],
		plugins: [
			resolve({ extensions, preferBuiltins: true, browser: false }),
			cleanup({
				comments: 'none',
				compactComments: false,
			}),
			typescript({
				tsconfig: 'tsconfig.json',
				tsconfigOverride: override,
			}),
			progress(),
		],
	},
];
