export type CanisterStatus = 'stopped' | 'stopping' | 'running';
export type CanisterSyncStatus = 'syncing' | 'synced' | 'error' | 'auth';
export type CanisterCyclesStatus = 'ok' | 'warn' | 'error';
export type CanisterType = 'nns' | 'sns';

export interface CanisterData {
  status: CanisterStatus;
  memory_size: bigint;
  cycles: bigint;
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
}

export interface CanisterId {
  id: string;
  name?: string;
}
