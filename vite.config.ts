import { sentrySvelteKit } from "@sentry/sveltekit";
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';


export default defineConfig({
	plugins: [
		sentrySvelteKit({
			adapter: "cloudflare",
			sourceMapsUploadOptions: {
				org: "stoky",
				project: "snk-conferencia",
				authToken: process.env.SENTRY_AUTH_TOKEN			
			}
		}), 
		tailwindcss(), sveltekit(), devtoolsJson()
	],
	server: {
		watch: {
			ignored: [
				'file.txt'
			]
		}
	}
});