import {IDB_KEY_CANISTER_IDS, IDB_KEY_SNS_ROOT_CANISTER_IDS} from '$lib/constants/constants';
import {icpXdrConversionRate} from '$lib/services/cmc.services';
import {canisterStatus} from '$lib/services/ic.services';
import {getSettings, listCanisters} from '$lib/services/idb.services';
import {snsCanisters} from '$lib/services/sns.services';
import type {Canister, CanisterGroup, CanisterId} from '$lib/types/canister';
import type {PostMessageDataRequest, PostMessageSync} from '$lib/types/post-message';
import type {CanisterInfo, SnsCanisterInfo} from '$lib/types/services';
import type {Settings} from '$lib/types/settings';
import {cyclesToICP, formatTCycles} from '$lib/utils/cycles.utils';
import type {Identity} from '@dfinity/agent';
import {AuthClient} from '@dfinity/auth-client';

onmessage = async ({data: dataMsg}: MessageEvent<PostMessageSync<PostMessageDataRequest>>) => {
  const {msg, data} = dataMsg;

  if ('stopCyclesTimer' === msg) {
    await stopCyclesTimer();
    return;
  }

  const {canisterId} = data;

  const settings: Settings = await getSettings();

  switch (msg) {
    case 'startCyclesTimer':
      await startCyclesTimer({settings});
      return;
    case 'addCanister':
      await addNnsCanister({canisterId, settings});
      return;
    case 'addSnsCanister':
      await addSnsCanister({canisterId, settings});
      return;
  }
};

let timer: NodeJS.Timeout | undefined = undefined;

const loadIdentity = async (): Promise<Identity | undefined> => {
  const authClient = await AuthClient.create({
    idleOptions: {
      disableIdle: true,
      disableDefaultIdleCallback: true
    }
  });

  return authClient.getIdentity();
};

const startCyclesTimer = async ({settings}: {settings: Settings}) => {
  const identity: Identity | undefined = await loadIdentity();

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
  const canisterIds: CanisterId[] = await listCanisters(IDB_KEY_CANISTER_IDS);

  // Update ui with the list of canisters about to be synced
  postMessage({
    msg: 'initCanisters',
    data: {
      canisters: canisterIds.map(({id: canisterId}) => ({id: canisterId, status: 'syncing'}))
    }
  });

  if (!identity) {
    // not signed in, therefore cannot sync canisters
    postMessage({
      msg: 'initCanisters',
      data: {
        canisters: canisterIds.map(({id: canisterId}) => ({
          id: canisterId,
          status: 'auth',
          group: {type: 'nns', id: canisterId}
        }))
      }
    });
    return [];
  }

  await Promise.allSettled(
    canisterIds.map(async ({id: canisterId}) => {
      try {
        const canisterInfo: CanisterInfo = await canisterStatus({canisterId, identity});

        await syncCanister({
          canisterInfo,
          trillionRatio,
          canisterId: canisterInfo.canisterId,
          settings,
          group: {type: 'nns', id: canisterInfo.canisterId}
        });
      } catch (err: unknown) {
        console.error(err);

        emitCanister({
          id: canisterId,
          status: 'error',
          group: {type: 'nns', id: canisterId}
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
  const canisterRootIds: CanisterId[] = await listCanisters(IDB_KEY_SNS_ROOT_CANISTER_IDS);

  // Update ui with the list of canisters about to be synced
  postMessage({
    msg: 'initCanisters',
    data: {
      canisters: canisterRootIds.map(({id: canisterId}) => ({id: canisterId, status: 'syncing'}))
    }
  });

  await Promise.allSettled(
    canisterRootIds.map(async ({id: rootCanisterId}) => {
      try {
        const canisterInfos: SnsCanisterInfo[] = await snsCanisters({rootCanisterId});

        const syncCanisters: Promise<void>[] = canisterInfos.map((canisterInfo: SnsCanisterInfo) =>
          syncCanister({
            canisterInfo,
            trillionRatio,
            canisterId: canisterInfo.canisterId,
            settings,
            group: {type: 'sns', id: rootCanisterId, description: canisterInfo.type}
          })
        );

        await Promise.all(syncCanisters);
      } catch (err: unknown) {
        console.error(err);

        emitCanister({
          id: rootCanisterId,
          status: 'error',
          group: {type: 'sns', id: rootCanisterId, description: 'root'}
        });

        throw err;
      }
    })
  );
};

const addNnsCanister = async ({
  canisterId,
  settings
}: {
  canisterId: string | undefined;
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

  const identity: Identity | undefined = await loadIdentity();

  if (!identity) {
    // not signed in, therefore cannot sync canisters
    postMessage({
      msg: 'syncCanister',
      data: {
        canister: {
          id: canisterId,
          status: 'auth',
          group: {type: 'nns', id: canisterId}
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

    await syncCanister({
      canisterInfo,
      trillionRatio,
      canisterId,
      settings,
      group: {type: 'nns', id: canisterId}
    });
  } catch (err) {
    catchErr({err, canisterId, group: {type: 'nns', id: canisterId}});
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
  canisterInfo: {cycles, status, memory_size},
  group
}: {
  canisterId: string;
  settings: Settings;
  trillionRatio: bigint;
  canisterInfo: CanisterInfo;
  group: CanisterGroup;
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
    },
    group
  };

  emitCanister(canister);
};

const addSnsCanister = async ({
  canisterId,
  settings
}: {
  canisterId: string | undefined;
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
      canisterInfos.map((canisterInfo: SnsCanisterInfo) =>
        syncCanister({
          canisterInfo,
          trillionRatio,
          canisterId: canisterInfo.canisterId,
          settings,
          group: {type: 'sns', id: canisterId, description: canisterInfo.type}
        })
      )
    );
  } catch (err) {
    catchErr({err, canisterId, group: {type: 'sns', id: canisterId, description: 'root'}});
  }
};

const catchErr = ({
  err,
  canisterId,
  group
}: {
  err: unknown;
  canisterId: string;
  group: CanisterGroup;
}) => {
  console.error(err);

  emitCanister({
    id: canisterId,
    status: 'error',
    group
  });
};

export {};
