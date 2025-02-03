import type { Canister, CanisterMeta } from './canister';

export interface PostMessageDataRequest {
	meta?: CanisterMeta;
}

export interface PostMessageDataResponse {
	canister?: Canister;
	canisters?: Canister[];
	icpXdrConversionRate?: bigint;
}

export type PostMessageRequest =
	| 'startCyclesTimer'
	| 'stopCyclesTimer'
	| 'addCanister'
	| 'addSnsCanister';
export type PostMessageResponse = 'syncCanister' | 'initCanisters' | 'syncIcpXdrConversionRate';

export interface PostMessageSync<T extends PostMessageDataRequest | PostMessageDataResponse> {
	msg: PostMessageRequest | PostMessageResponse;
	data: T;
}
