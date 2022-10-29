import type {CanisterStatus} from './canister';

export interface CanisterInfo {
  cycles: bigint;
  memory_size: bigint;
  status: CanisterStatus;
  canisterId: string;
}

export interface SnsCanisterInfo extends CanisterInfo {
  type: 'root' | 'governance' | 'ledger' | 'swap' | 'index';
}
