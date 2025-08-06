import { defineConfig } from '@junobuild/config';

export default defineConfig({
	satellite: {
		ids: {
			development: 'atbka-rp777-77775-aaaaq-cai',
			production: 'ck4tp-3iaaa-aaaal-ab7da-cai'
		},
		source: 'build',
		settings: {
			heapMemoryLimit: 1073741824n,
			logVisibility: 'controllers'
		},
		predeploy: ['npm run build'],
		assertions: {
			heapMemory: 8000000
		}
	}
});
