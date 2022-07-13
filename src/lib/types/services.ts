import type {CanisterStatus} from './canister';

export interface NnsCanisterInfo {
  cycles: bigint;
  memory_size: bigint;
  status: CanisterStatus;
  canisterId: string;
}

export interface SnsCanisterInfo extends NnsCanisterInfo {
  type: 'root' | 'governance' | 'ledger' | 'swap';
}
