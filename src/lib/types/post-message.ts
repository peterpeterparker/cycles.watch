import type {Canister} from './canister';
import type {InternetIdentityAuth} from './identity';

export interface PostMessageDataRequest {
  internetIdentity: InternetIdentityAuth;
  canisterId?: string;
}

export interface PostMessageDataResponse {
  canister?: Canister;
  canisters?: Canister[];
}

export type PostMessageRequest = 'startCyclesTimer' | 'stopCyclesTimer' | 'addCanister';
export type PostMessageResponse = 'syncCanister' | 'initCanisters';

export interface PostMessageSync<T extends PostMessageDataRequest | PostMessageDataResponse> {
  msg: PostMessageRequest | PostMessageResponse;
  data: T;
}
