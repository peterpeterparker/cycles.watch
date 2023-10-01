import type { CanisterStatus } from './canister';

export interface CanisterInfo {
	cycles: bigint;
	memory_size: bigint;
	status: CanisterStatus;
	canisterId: string;
}

export type SnsCanisterInfoType =
	| 'root'
	| 'governance'
	| 'ledger'
	| 'swap'
	| 'index'
	| 'dapps'
	| 'archives';

export interface SnsCanisterInfo extends CanisterInfo {
	type: SnsCanisterInfoType;
}
