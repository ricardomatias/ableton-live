import { buildSync } from 'esbuild';

buildSync({
	entryPoints: ['lib/index.ts'],
	outfile: 'build/cjs/index.cjs',
	bundle: true,
	minify: true,
	target: ['node18'],
	format: 'cjs',
	platform: 'node',
	external: ['crypto'],
});

buildSync({
	entryPoints: ['lib/index.ts'],
	outfile: 'build/esm/node.mjs',
	bundle: true,
	minify: true,
	target: ['node18'],
	format: 'esm',
	platform: 'node',
	external: ['crypto'],
});
