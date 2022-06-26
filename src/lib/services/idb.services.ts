import {get, update} from 'idb-keyval';
import {IDB_KEY_CANISTER_IDS} from '../constants/constants';

export const listCanisters = async (): Promise<string[]> => (await get(IDB_KEY_CANISTER_IDS)) ?? [];

export const addCanister = async (canisterId: string) =>
  update(IDB_KEY_CANISTER_IDS, (canisters: string[] | undefined) => [
    ...new Set([...(canisters ?? []), canisterId])
  ]);
