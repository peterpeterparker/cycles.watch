import type {Identity} from '@dfinity/agent';
import {TIMER_INTERVAL, WARN_TCYCLES} from '../constants/settings';
import {icpXdrConversionRate} from '../services/cmc.services';
import {canisterStatus} from '../services/ic.services';
import {listCanisters} from '../services/idb.services';
import type {Canister} from '../types/canister';
import type {InternetIdentityAuth} from '../types/identity';
import type {PostMessageDataRequest, PostMessageSync} from '../types/post-message';
import {cyclesToICP, formatTCycles} from '../utils/cycles.utils';
import {initIdentity} from '../utils/identity.utils';

onmessage = async ({data: dataMsg}: MessageEvent<PostMessageSync<PostMessageDataRequest>>) => {
  const {msg, data} = dataMsg;

  if ('stopCyclesTimer' === msg) {
    await stopCyclesTimer();
    return;
  }

  const {internetIdentity, canisterId} = data;

  switch (msg) {
    case 'startCyclesTimer':
      await startCyclesTimer(internetIdentity);
      return;
    case 'addCanister':
      await addCanister({canisterId, internetIdentity});
      return;
  }
};

let timer: NodeJS.Timeout | undefined = undefined;

const parseIdentity = (internetIdentity?: InternetIdentityAuth): Identity => {
  if (!internetIdentity) {
    console.error('No internet identity for the worker to fetch the cycles');
    throw new Error('No internet identity for the worker to fetch the cycles');
  }

  const {identityKey, delegationChain} = internetIdentity;

  if (!identityKey || !delegationChain) {
    console.error('No identity key or delegation key for the worker to fetch the cycles');
    throw new Error('No identity key or delegation key for the worker to fetch the cycles');
  }

  return initIdentity({identityKey, delegationChain});
};

const startCyclesTimer = async (internetIdentity?: InternetIdentityAuth) => {
  const identity: Identity = parseIdentity(internetIdentity);

  const sync = async () => await syncCanisters(identity);

  // We sync the cycles now but also schedule the update afterwards
  await sync();

  timer = setInterval(sync, TIMER_INTERVAL);
};

const stopCyclesTimer = async () => {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;
};

const syncCanisters = async (identity: Identity) => {
  const canisterIds: string[] = await listCanisters();

  // Update ui with the list of canisters about to be synced
  postMessage({
    msg: 'initCanisters',
    data: {
      canisters: canisterIds.map((canisterId: string) => ({id: canisterId, status: 'syncing'}))
    }
  });

  await Promise.all(canisterIds.map((canisterId: string) => syncCanister({identity, canisterId})));
};

const addCanister = async ({
  canisterId,
  internetIdentity
}: {
  canisterId: string | undefined;
  internetIdentity?: InternetIdentityAuth;
}) => {
  if (!canisterId) {
    throw new Error('Canister id unknown');
  }

  const identity: Identity = parseIdentity(internetIdentity);

  // Update ui with the canister information as syncing
  postMessage({
    msg: 'syncCanister',
    data: {
      canister: {
        id: canisterId,
        status: 'syncing'
      }
    }
  });

  await syncCanister({identity, canisterId});
};

// Update ui with one canister information
const emitCanister = (canister: Canister) =>
  postMessage({
    msg: 'syncCanister',
    data: {
      canister
    }
  });

const syncCanister = async ({identity, canisterId}: {identity: Identity; canisterId: string}) => {
  try {
    const {cycles, status, memory_size} = await canisterStatus({canisterId, identity});

    const trillionRatio = await icpXdrConversionRate();

    const tCycles = Number(formatTCycles(cycles));

    const canister: Canister = {
      id: canisterId,
      status: 'synced',
      data: {
        status,
        memory_size,
        cycles,
        icp: cyclesToICP({cycles, trillionRatio}),
        cyclesStatus: tCycles < 0 ? 'error' : tCycles < WARN_TCYCLES ? 'warn' : 'ok'
      }
    };

    emitCanister(canister);
  } catch (err) {
    console.error(err);

    emitCanister({
      id: canisterId,
      status: 'error'
    });
  }
};

export {};
