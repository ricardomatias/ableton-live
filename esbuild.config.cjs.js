const esbuild = require('esbuild');

esbuild.buildSync({
	entryPoints: ['lib/index.ts'],
	bundle: true,
	minify: true,
	target: ['node14'],
	platform: 'node',
	external: ['crypto'],
	outdir: 'build/cjs/',
});
