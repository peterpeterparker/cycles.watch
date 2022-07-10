import {type CanistersStore, canistersStore} from '../stores/canisters.store';
import type {Canister} from '../types/canister';
import type {InternetIdentityAuth} from '../types/identity';
import type {
  PostMessageDataRequest,
  PostMessageDataResponse,
  PostMessageSync
} from '../types/post-message';
import {emit} from '../utils/events.utils';
import {internetIdentityAuth} from '../utils/identity.utils';
import {addCanister as addCanisterIDB, removeCanister as removeCanisterIDB} from './idb.services';
import {notify} from './notification.services';

export const addCanister = async (canisterId: string) => {
  await addCanisterIDB(canisterId);

  const internetIdentity: InternetIdentityAuth = await internetIdentityAuth();

  emit<PostMessageDataRequest>({message: 'addCanister', detail: {canisterId, internetIdentity}});
};

export const removeCanister = async (canister: Canister) => {
  const {id} = canister;

  await removeCanisterIDB(id);

  updateCanistersStore({canister, method: 'remove'});
};

const updateCanistersStore = ({canister, method}: {canister: Canister; method: 'add' | 'remove'}) =>
  canistersStore.update(({canisters}: CanistersStore) => ({
    initialized: true,
    canisters: [
      ...(canisters ?? []).filter(({id}: Canister) => id !== canister.id),
      ...(method === 'add' ? [canister] : [])
    ]
  }));

const setCanistersStore = ({canisters}: PostMessageDataResponse) =>
  canistersStore.set({
    initialized: true,
    canisters: canisters ?? []
  });

const notifyCanisterCycles = async (canister: Canister) => {
  const {data, id, status} = canister;

  // We notify only if the canister is synced
  if (status !== 'synced') {
    return;
  }

  if (!data) {
    throw new Error('No canister data not provided.');
  }

  const {cyclesStatus} = data;

  switch (cyclesStatus) {
    case 'error':
      await notify({title: `Cycles.watch 🔥`, options: {body: `Canister ${id} out of cycles.`}});
      return;
    case 'warn':
      await notify({
        title: `Cycles.watch ⚠️`,
        options: {body: `Canister ${id} running out of cycles.`}
      });
      return;
  }
};

const syncCanister = async ({canister}: PostMessageDataResponse) => {
  if (!canister) {
    throw new Error('Canister not provided.');
  }

  updateCanistersStore({canister, method: 'add'});

  await notifyCanisterCycles(canister);
};

export const onWorkerMessage = async ({
  data: {msg, data}
}: MessageEvent<PostMessageSync<PostMessageDataResponse>>) => {
  if (!['syncCanister', 'initCanisters'].includes(msg)) {
    return;
  }

  switch (msg) {
    case 'syncCanister':
      await syncCanister(data);
      return;
    case 'initCanisters':
      setCanistersStore(data);
      return;
  }
};
