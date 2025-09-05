import { defineConfig } from '@junobuild/config';

export default defineConfig({
	satellite: {
		ids: {
			development: 'uxrrr-q7777-77774-qaaaq-cai',
			production: 'ck4tp-3iaaa-aaaal-ab7da-cai'
		},
		source: 'build',
		settings: {
			heapMemoryLimit: 1073741824n,
			logVisibility: 'controllers'
		},
		predeploy: ['npm run build'],
		precompress: [
			{
				pattern: '**/*.+(js|mjs|css)',
				algorithm: 'brotli',
				mode: 'replace'
			},
			{
				pattern: '**/*.html',
				algorithm: 'brotli',
				mode: 'both'
			}
		],
		assertions: {
			heapMemory: 800_000_000n
		}
	}
});
