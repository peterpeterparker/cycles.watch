import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill';
import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import {readFileSync} from 'fs';
import preprocess from 'svelte-preprocess';
import {fileURLToPath} from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const {version} = JSON.parse(json);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: {
      plugins: [autoprefixer]
    }
  }),

  kit: {
    adapter: adapter(),
    serviceWorker: {
      register: false
    },
    prerender: {
      default: true
    },
    vite: {
      define: {
        VITE_APP_VERSION: JSON.stringify(version)
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
              buffer: true,
              global: true
            })
          ]
        }
      }
    }
  }
};

export default config;
