import type {Principal} from "@dfinity/principal";

export interface RequestData {
	status: 'submitted' | 'swapped' | 'failed';
	icp_amount: bigint;
	wallet_owner: Principal,
}
