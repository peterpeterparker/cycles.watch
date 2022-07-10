import type {Identity} from '@dfinity/agent';
import {isDelegationValid} from '@dfinity/authentication';
import {DelegationChain} from '@dfinity/identity';
import {icpXdrConversionRate} from '../services/cmc.services';
import {canisterStatus} from '../services/ic.services';
import {getSettings, listCanisters} from '../services/idb.services';
import type {Canister} from '../types/canister';
import type {InternetIdentityAuth} from '../types/identity';
import type {PostMessageDataRequest, PostMessageSync} from '../types/post-message';
import type {Settings} from '../types/settings';
import {cyclesToICP, formatTCycles} from '../utils/cycles.utils';
import {initIdentity} from '../utils/identity.utils';

onmessage = async ({data: dataMsg}: MessageEvent<PostMessageSync<PostMessageDataRequest>>) => {
  const {msg, data} = dataMsg;

  if ('stopCyclesTimer' === msg) {
    await stopCyclesTimer();
    return;
  }

  const {internetIdentity, canisterId} = data;

  const settings: Settings = await getSettings();

  switch (msg) {
    case 'startCyclesTimer':
      await startCyclesTimer({internetIdentity, settings});
      return;
    case 'addCanister':
      await addCanister({canisterId, internetIdentity, settings});
      return;
  }
};

let timer: NodeJS.Timeout | undefined = undefined;

const parseIdentity = (internetIdentity?: InternetIdentityAuth): Identity | undefined => {
  // No internet identity for the worker to fetch the canister' cycles
  if (!internetIdentity) {
    return undefined;
  }

  const {identityKey, delegationChain} = internetIdentity;

  // No identity key or delegation key for the worker to fetch the cycles
  if (!identityKey || !delegationChain) {
    return undefined;
  }

  if (!isDelegationValid(DelegationChain.fromJSON(delegationChain))) {
    console.error('Internet identity has expired. Please login again.');
    throw new Error('Internet identity has expired. Please login again.');
  }

  return initIdentity({identityKey, delegationChain});
};

const startCyclesTimer = async ({
  internetIdentity,
  settings
}: {
  internetIdentity?: InternetIdentityAuth;
  settings: Settings;
}) => {
  const identity: Identity | undefined = parseIdentity(internetIdentity);

  const sync = async () => await syncCanisters({identity, settings});

  // We sync the cycles now but also schedule the update afterwards
  await sync();

  const {timerInterval}: Settings = settings;

  timer = setInterval(sync, timerInterval);
};

const stopCyclesTimer = async () => {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;
};

const syncCanisters = async ({
  identity,
  settings
}: {
  identity: Identity | undefined;
  settings: Settings;
}) => {
  const canisterIds: string[] = await listCanisters();

  // Update ui with the list of canisters about to be synced
  postMessage({
    msg: 'initCanisters',
    data: {
      canisters: canisterIds.map((canisterId: string) => ({id: canisterId, status: 'syncing'}))
    }
  });

  if (!identity) {
    // not signed in, therefore cannot sync canisters
    return;
  }

  await Promise.all(
    canisterIds.map((canisterId: string) => syncCanister({identity, canisterId, settings}))
  );
};

const addCanister = async ({
  canisterId,
  internetIdentity,
  settings
}: {
  canisterId: string | undefined;
  internetIdentity?: InternetIdentityAuth;
  settings: Settings;
}) => {
  if (!canisterId) {
    throw new Error('Canister id unknown');
  }

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

  const identity: Identity | undefined = parseIdentity(internetIdentity);

  if (!identity) {
    // not signed in, therefore cannot sync canisters
    return;
  }

  await syncCanister({identity, canisterId, settings});
};

// Update ui with one canister information
const emitCanister = (canister: Canister) =>
  postMessage({
    msg: 'syncCanister',
    data: {
      canister
    }
  });

const syncCanister = async ({
  identity,
  canisterId,
  settings: {warnTCycles}
}: {
  identity: Identity;
  canisterId: string;
  settings: Settings;
}) => {
  try {
    const [canisterInfo, trillionRatio] = await Promise.all([
      canisterStatus({canisterId, identity}),
      icpXdrConversionRate()
    ]);

    const {cycles, status, memory_size} = canisterInfo;

    const tCycles = Number(formatTCycles(cycles));

    const canister: Canister = {
      id: canisterId,
      status: 'synced',
      data: {
        status,
        memory_size,
        cycles,
        icp: cyclesToICP({cycles, trillionRatio}),
        cyclesStatus: tCycles < 0 ? 'error' : tCycles < warnTCycles ? 'warn' : 'ok'
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
