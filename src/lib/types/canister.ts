import type { CanisterInfo } from '$lib/types/services';

export type CanisterStatus = 'stopped' | 'stopping' | 'running';
export type CanisterSyncStatus = 'syncing' | 'synced' | 'error' | 'auth';
export type CanisterCyclesStatus = 'ok' | 'warn' | 'error';
export type CanisterType = 'nns' | 'sns';

export interface CanisterData extends Omit<CanisterInfo, 'canisterId'> {
	icp: number;
	cyclesStatus: CanisterCyclesStatus;
}

export interface CanisterGroup {
	type: CanisterType;
	id: string;
	description?: string;
}

export interface Canister {
	id: string;
	status: CanisterSyncStatus;
	data?: CanisterData;
	group?: CanisterGroup;
	meta: CanisterMeta;
}

// Metadata saved on chain
export interface CanisterMeta {
	id: string;
	name?: string;
}
