import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true
		})
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// pages: 'build',
			// assets: 'build',
			// fallback: 'index.html',
			// precompress: false,
			// strict: true,
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
		alias: {
			$components: './src/components',
			$root: './src',
			$data: './static/data',
			$mapdata: './static/data/processed'
		},
		paths: {
			base: ''
		},
		output: {
			preloadStrategy: 'preload-mjs'
		},
		// @todo: remove this once the bug is fixed
		csrf: false
	}
};

export default config;
