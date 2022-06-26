import type {CallConfig, Identity} from '@dfinity/agent';
import {Principal} from '@dfinity/principal';
import type {_SERVICE as ICActor} from '../canisters/ic/ic.did';
import {idlFactory} from '../canisters/ic/ic.utils.did';
import type {CanisterStatus} from '../types/canister';
import {createActor} from '../utils/actor.utils';

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
}): Promise<{cycles: bigint; memory_size: bigint; status: CanisterStatus}> => {
  const actor: ICActor = await createICActor(identity);

  const {cycles, status, memory_size} = await actor.canister_status({
    canister_id: Principal.fromText(canisterId)
  });

  const toStatus = (status: {stopped: null} | {stopping: null} | {running: null}): CanisterStatus =>
    'stopped' in status && status.stopped === null
      ? 'stopped'
      : 'stopping' in status && status.stopping === null
      ? 'stopping'
      : 'running';

  return {cycles, status: toStatus(status), memory_size};
};
