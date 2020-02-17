import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import progress from 'rollup-plugin-progress';

const extensions = [
    '.js', '.ts',
];

export default [
    {
        input: 'index.ts',
        output: [
            {
                dir: 'build/esm',
                file: 'ableton-live.js',
                format: 'esm',
                sourcemap: true,
            },
            {
                dir: 'build/cjs',
                file: 'ableton-live.js',
                format: 'cjs',
            },
        ],
        plugins: [
            del({ targets: 'build/*' }),
            resolve({ extensions }),
            commonjs(),
            cleanup({
                comments: 'jsdoc',
                compactComments: false,
            }),
            babel({
                extensions,
                exclude: 'node_modules/**',
            }),
            terser({
            	output: {
            		comments: 'all',
            	},
            }),
            copy({
                targets: [
                    { src: 'types/*.ts', dest: OUT_DIR },
                ],
            }),
            progress(),
        ],
    },
];
