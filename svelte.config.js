// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		// adapter: adapter(),
		adapter: adapter(),
		experimental: {
			remoteFunctions: true,
			tracing: {
				server: true
			},
			// A funcionalidade de instrumentação está causando um erro de path no build para a Cloudflare em ambiente Windows.
			// Desativar temporariamente até que o bug no adapter seja corrigido.
			instrumentation: {
				server: true
			}
		},
		alias: {
			$components: 'src/components',
			$assets: 'src/assets'
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
