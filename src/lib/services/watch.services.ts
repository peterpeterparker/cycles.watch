import {
  addCanisters as addCanistersJuno,
  removeCanister as removeCanisterJuno
} from '$lib/services/juno.services';
import {
  COLLECTION_CANISTER_IDS,
  COLLECTION_SNS_ROOT_CANISTER_IDS,
  IDB_KEY_CANISTER_IDS,
  IDB_KEY_SNS_ROOT_CANISTER_IDS
} from '../constants/constants';
import {canistersStore, type CanistersStore} from '../stores/canisters.store';
import type {Canister} from '../types/canister';
import type {
  PostMessageDataRequest,
  PostMessageDataResponse,
  PostMessageSync
} from '../types/post-message';
import {emit} from '../utils/events.utils';
import {addCanister as addCanisterIDB, removeCanister as removeCanisterIDB} from './idb.services';
import {notify} from './notification.services';

export const addCanister = async (canisterId: string) => {
  await Promise.all([
    addCanisterIDB({key: IDB_KEY_CANISTER_IDS, canisterId: {id: canisterId}}),
    addCanistersJuno({canisterIds: [{id: canisterId}], collection: COLLECTION_CANISTER_IDS})
  ]);

  emit<PostMessageDataRequest>({message: 'addCanister', detail: {canisterId}});
};

export const addSnsCanister = async (canisterId: string) => {
  await Promise.all([
    addCanisterIDB({key: IDB_KEY_SNS_ROOT_CANISTER_IDS, canisterId: {id: canisterId}}),
    addCanistersJuno({
      canisterIds: [{id: canisterId}],
      collection: COLLECTION_SNS_ROOT_CANISTER_IDS
    })
  ]);

  emit<PostMessageDataRequest>({message: 'addSnsCanister', detail: {canisterId}});
};

export const removeCanister = async (canister: Canister) => {
  const {id: canisterId, group} = canister;

  if (group?.type === 'sns') {
    await Promise.all([
      removeCanisterIDB({key: IDB_KEY_SNS_ROOT_CANISTER_IDS, canisterId}),
      removeCanisterJuno({collection: COLLECTION_SNS_ROOT_CANISTER_IDS, canisterId})
    ]);

    removeGroupCanistersStore({groupId: canisterId});
    return;
  }

  await Promise.all([
    removeCanisterIDB({key: IDB_KEY_CANISTER_IDS, canisterId}),
    removeCanisterJuno({collection: COLLECTION_CANISTER_IDS, canisterId})
  ]);

  updateCanistersStore({canister, method: 'remove'});
};

const removeGroupCanistersStore = ({groupId}: {groupId: string}) =>
  canistersStore.update(({canisters}: CanistersStore) => ({
    initialized: true,
    canisters: [...(canisters ?? []).filter(({group}: Canister) => group?.id !== groupId)]
  }));

const updateCanistersStore = ({canister, method}: {canister: Canister; method: 'add' | 'remove'}) =>
  canistersStore.update(({canisters}: CanistersStore) => ({
    initialized: true,
    canisters: [
      ...(canisters ?? []).filter(({id}: Canister) => id !== canister.id),
      ...(method === 'add' ? [canister] : [])
    ]
  }));

const setCanistersStore = ({canisters: newCanisters}: PostMessageDataResponse) => {
  const newCanisterIds: string[] = (newCanisters ?? []).map(({id}: Canister) => id);

  canistersStore.update(({canisters}: CanistersStore) => ({
    initialized: true,
    canisters: [
      ...new Set([
        ...(canisters ?? []).filter(({id}: Canister) => !newCanisterIds.includes(id)),
        ...(newCanisters ?? [])
      ])
    ]
  }));
};

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
