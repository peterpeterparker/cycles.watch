import type {Identity} from '@dfinity/agent';
import {isDelegationValid} from '@dfinity/authentication';
import {DelegationChain} from '@dfinity/identity';
import {IDB_KEY_CANISTER_IDS, IDB_KEY_SNS_ROOT_CANISTER_IDS} from '../constants/constants';
import {icpXdrConversionRate} from '../services/cmc.services';
import {canisterStatus} from '../services/ic.services';
import {getSettings, listCanisters} from '../services/idb.services';
import {snsCanisters} from '../services/sns.services';
import type {Canister, CanisterStatus} from '../types/canister';
import type {InternetIdentityAuth} from '../types/identity';
import type {PostMessageDataRequest, PostMessageSync} from '../types/post-message';
import type {SnsCanisterInfo} from '../types/services';
import type {NnsCanisterInfo} from '../types/services';
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
    case 'addSnsCanister':
      await addSnsCanister({canisterId, internetIdentity, settings});
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
  const trillionRatio: bigint = await icpXdrConversionRate();

  await Promise.all([
    syncNnsCanisters({identity, settings, trillionRatio}),
    syncSnsCanisters({settings, trillionRatio})
  ]);
};

const syncNnsCanisters = async ({
  identity,
  settings,
  trillionRatio
}: {
  identity: Identity | undefined;
  settings: Settings;
  trillionRatio: bigint;
}) => {
  const canisterIds: string[] = await listCanisters(IDB_KEY_CANISTER_IDS);

  // Update ui with the list of canisters about to be synced
  postMessage({
    msg: 'initCanisters',
    data: {
      canisters: canisterIds.map((canisterId: string) => ({id: canisterId, status: 'syncing'}))
    }
  });

  if (!identity) {
    // not signed in, therefore cannot sync canisters
    postMessage({
      msg: 'initCanisters',
      data: {
        canisters: canisterIds.map((canisterId: string) => ({id: canisterId, status: 'auth'}))
      }
    });
    return [];
  }

  await Promise.allSettled(
    canisterIds.map(async (canisterId: string) => {
      try {
        const canisterInfo: NnsCanisterInfo = await canisterStatus({canisterId, identity});

        await syncCanister({
          canisterInfo,
          trillionRatio,
          canisterId: canisterInfo.canisterId,
          settings
        });
      } catch (err: unknown) {
        console.error(err);

        emitCanister({
          id: canisterId,
          status: 'error'
        });

        throw err;
      }
    })
  );
};

const syncSnsCanisters = async ({
  settings,
  trillionRatio
}: {
  settings: Settings;
  trillionRatio: bigint;
}) => {
  const canisterRootIds: string[] = await listCanisters(IDB_KEY_SNS_ROOT_CANISTER_IDS);

  // Update ui with the list of canisters about to be synced
  postMessage({
    msg: 'initCanisters',
    data: {
      canisters: canisterRootIds.map((canisterId: string) => ({id: canisterId, status: 'syncing'}))
    }
  });

  await Promise.allSettled(
    canisterRootIds.map(async (rootCanisterId: string) => {
      try {
        const canisterInfos: SnsCanisterInfo[] = await snsCanisters({rootCanisterId});

        const syncCanisters: Promise<void>[] = canisterInfos.map((canisterInfo: SnsCanisterInfo) =>
          syncCanister({
            canisterInfo,
            trillionRatio,
            canisterId: canisterInfo.canisterId,
            settings
          })
        );

        await Promise.all(syncCanisters);
      } catch (err: unknown) {
        console.error(err);

        emitCanister({
          id: rootCanisterId,
          status: 'error'
        });

        throw err;
      }
    })
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
    postMessage({
      msg: 'syncCanister',
      data: {
        canister: {
          id: canisterId,
          status: 'auth'
        }
      }
    });
    return;
  }

  try {
    const [canisterInfo, trillionRatio] = await Promise.all([
      canisterStatus({canisterId, identity}),
      icpXdrConversionRate()
    ]);

    await syncCanister({canisterInfo, trillionRatio, canisterId, settings});
  } catch (err) {
    catchErr({err, canisterId});
  }
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
  canisterId,
  settings: {warnTCycles},
  trillionRatio,
  canisterInfo: {cycles, status, memory_size}
}: {
  canisterId: string;
  settings: Settings;
  trillionRatio: bigint;
  canisterInfo: {cycles: bigint; memory_size: bigint; status: CanisterStatus};
}) => {
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
};

const addSnsCanister = async ({
  canisterId,
  internetIdentity,
  settings
}: {
  canisterId: string | undefined;
  internetIdentity?: InternetIdentityAuth;
  settings: Settings;
}) => {
  if (!canisterId) {
    throw new Error('Root canister id unknown');
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

  try {
    const [canisterInfos, trillionRatio] = await Promise.all([
      snsCanisters({rootCanisterId: canisterId}),
      icpXdrConversionRate()
    ]);

    await Promise.all(
      canisterInfos.map(({cycles, canisterId, status, memory_size}: SnsCanisterInfo) =>
        syncCanister({
          canisterInfo: {cycles, status, memory_size},
          trillionRatio,
          canisterId,
          settings
        })
      )
    );
  } catch (err) {
    catchErr({err, canisterId});
  }
};

const catchErr = ({err, canisterId}: {err: unknown; canisterId: string}) => {
  console.error(err);

  emitCanister({
    id: canisterId,
    status: 'error'
  });
};

export {};
