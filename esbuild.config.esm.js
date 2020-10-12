const esbuild = require('esbuild');
// const rimraf = require('rimraf');

// rimraf.sync('./build');

esbuild.buildSync({
	entryPoints: [ 'lib/index.ts' ],
	bundle: true,
	minify: true,
	target: 'es6',
	format: 'esm',
	platform: 'browser',
	external: ['crypto'],
	outdir: 'build/esm/',
});
