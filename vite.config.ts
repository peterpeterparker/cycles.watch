import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import juno from '@junobuild/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const { version } = JSON.parse(json);

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), juno()],
	define: {
		VITE_APP_VERSION: JSON.stringify(version)
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	},
	// Node polyfill agent-js. Thanks solution shared by chovyfu on the Discord channel.
	// https://stackoverflow.com/questions/71744659/how-do-i-deploy-a-sveltekit-app-to-a-dfinity-container
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true
				})
			]
		}
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: (id: string) => {
					const folder = dirname(id);

					if (
						['@sveltejs', 'svelte'].find((lib) => folder.includes(lib)) === undefined &&
						folder.includes('node_modules')
					) {
						return 'vendor';
					}

					return 'index';
				}
			}
		}
	},
	worker: {
		format: 'es'
	},
	server: {
		port: 5174
	}
};

export default config;
