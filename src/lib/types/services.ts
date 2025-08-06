import type { CanisterStatusResponse } from '@dfinity/ic-management';
import type { CanisterStatus } from './canister';

export type CanisterInfo = Pick<CanisterStatusResponse, 'cycles' | 'memory_size'> &
	Partial<Pick<CanisterStatusResponse, 'memory_metrics'>> & {
		status: CanisterStatus;
		canisterId: string;
	};

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
