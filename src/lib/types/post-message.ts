import type {Canister} from './canister';

export interface PostMessageDataRequest {
  canisterId?: string;
}

export interface PostMessageDataResponse {
  canister?: Canister;
  canisters?: Canister[];
}

export type PostMessageRequest = 'startCyclesTimer' | 'stopCyclesTimer' | 'addCanister' | 'addSnsCanister';
export type PostMessageResponse = 'syncCanister' | 'initCanisters';

export interface PostMessageSync<T extends PostMessageDataRequest | PostMessageDataResponse> {
  msg: PostMessageRequest | PostMessageResponse;
  data: T;
}
