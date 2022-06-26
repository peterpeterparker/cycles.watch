export type CanisterStatus = 'stopped' | 'stopping' | 'running';
export type CanisterSyncStatus = 'syncing' | 'synced' | 'error';
export type CanisterCyclesStatus = 'ok' | 'warn' | 'error';

export interface CanisterData {
  status: CanisterStatus;
  memory_size: bigint;
  cycles: bigint;
  icp: number;
  cyclesStatus: CanisterCyclesStatus;
}

export interface Canister {
  id: string;
  status: CanisterSyncStatus;
  data?: CanisterData;
}
