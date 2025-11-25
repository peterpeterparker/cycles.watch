import { type Collections, defineConfig } from '@junobuild/config';

const collections: Collections = {
	storage: [],
	datastore: [
		{
			collection: 'bookkeeping',
			memory: 'stable',
			read: 'managed',
			write: 'managed'
		},
		{
			collection: 'request',
			memory: 'stable',
			read: 'managed',
			write: 'managed'
		},
		{
			collection: 'nns_canister_ids',
			memory: 'heap',
			read: 'managed',
			write: 'managed'
		},
		{
			collection: 'settings',
			memory: 'heap',
			read: 'managed',
			write: 'managed'
		},
		{
			collection: 'sns_canister_ids',
			memory: 'heap',
			read: 'managed',
			write: 'managed'
		}
	]
};

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
		},
		collections
	}
});
