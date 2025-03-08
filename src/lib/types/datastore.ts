import type {Principal} from "@dfinity/principal";

export interface RequestDataSwap {
	amount: bigint;
	fee?: bigint;
}

export interface RequestData {
	status: 'submitted' | 'swapped' | 'failed';
	wallet_owner: Principal,
	swap: RequestDataSwap;
}
