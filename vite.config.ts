import juno from '@junobuild/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const { version } = JSON.parse(json);

export default defineConfig({
	plugins: [sveltekit(), nodePolyfills(), juno()],
	define: {
		VITE_APP_VERSION: JSON.stringify(version)
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
});
