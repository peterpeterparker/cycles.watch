import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill';
import {sveltekit} from '@sveltejs/kit/vite';
import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const {version} = JSON.parse(json);

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
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
          buffer: true
        })
      ]
    }
  },
  worker: {
    format: "es",
  },
};

export default config;
