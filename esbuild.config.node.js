import { build } from 'esbuild';

await build({
	entryPoints: ['lib/index.ts'],
	outfile: 'build/cjs/index.cjs',
	bundle: true,
	minify: true,
	target: ['node18'],
	format: 'cjs',
	platform: 'node',
	external: ['crypto'],
});

await build({
	entryPoints: ['lib/index.ts'],
	outfile: 'build/esm/node.mjs',
	bundle: true,
	minify: true,
	target: ['node18'],
	format: 'esm',
	platform: 'node',
	external: ['crypto'],
});
