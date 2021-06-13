import { buildSync } from 'esbuild';

buildSync({
	entryPoints: [ 'lib/index.ts' ],
	outfile: 'build/esm/index.mjs',
	bundle: true,
	minify: true,
	target: 'es6',
	format: 'esm',
	platform: 'browser',
	external: ['crypto'],
});
