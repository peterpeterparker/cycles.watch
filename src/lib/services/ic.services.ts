import type {CallConfig, Identity} from '@dfinity/agent';
import {Principal} from '@dfinity/principal';
import type {_SERVICE as ICActor} from '../canisters/ic/ic.did';
import {idlFactory} from '../canisters/ic/ic.utils.did';
import {createActor} from '../utils/actor.utils';
import {toStatus} from '../utils/canister.utils';
import type {CanisterInfo} from '../types/services';

const MANAGEMENT_CANISTER_ID = Principal.fromText('aaaaa-aa');

// Source nns-dapp - dart -> JS bridge
const transform = (_methodName: string, args: unknown[], _callConfig: CallConfig) => {
  const first = args[0] as any;
  let effectiveCanisterId = MANAGEMENT_CANISTER_ID;
  if (first && typeof first === 'object' && first.canister_id) {
    effectiveCanisterId = Principal.from(first.canister_id as unknown);
  }

  return {effectiveCanisterId};
};

const createICActor = (identity: Identity): Promise<ICActor> =>
  createActor<ICActor>({
    config: {
      canisterId: MANAGEMENT_CANISTER_ID,
      callTransform: transform,
      queryTransform: transform
    },
    idlFactory,
    identity
  });

export const canisterStatus = async ({
  canisterId,
  identity
}: {
  canisterId: string;
  identity: Identity;
}): Promise<CanisterInfo> => {
  const actor: ICActor = await createICActor(identity);

  const {cycles, status, memory_size} = await actor.canister_status({
    canister_id: Principal.fromText(canisterId)
  });

  return {cycles, status: toStatus(status), memory_size, canisterId};
};
