import { defineDevConfig } from '@junobuild/config';

export default defineDevConfig(() => ({
	satellite: {
		collections: {
			datastore: [
				{
					collection: 'bookkeeping',
					memory: 'stable' as const,
					read: 'controllers' as const,
					write: 'controllers' as const,
					mutablePermissions: true
				},
				{
					collection: 'nns_canister_ids',
					memory: 'stable' as const,
					read: 'managed' as const,
					write: 'managed' as const,
					mutablePermissions: true
				},
				{
					collection: 'sns_canister_ids',
					memory: 'stable' as const,
					read: 'managed' as const,
					write: 'managed' as const,
					mutablePermissions: true
				},
				{
					collection: 'request',
					memory: 'stable' as const,
					read: 'managed' as const,
					write: 'managed' as const,
					mutablePermissions: true
				},
				{
					collection: 'settings',
					memory: 'stable' as const,
					read: 'managed' as const,
					write: 'managed' as const,
					mutablePermissions: true
				}
			],
			storage: []
		}
	}
}));
