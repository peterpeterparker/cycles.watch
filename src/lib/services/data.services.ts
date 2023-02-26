import {
  COLLECTION_CANISTER_IDS,
  COLLECTION_SNS_ROOT_CANISTER_IDS,
  IDB_KEY_CANISTER_IDS,
  IDB_KEY_SNS_ROOT_CANISTER_IDS
} from '$lib/constants/constants';
import {
  addCanister as addCanisterIDB,
  getSettings as getSettingsIDB,
  listCanisters as listCanistersIDB,
  updateTimerInterval,
  updateWarnTCycles
} from '$lib/services/idb.services';
import {
  addCanisters as addCanistersJuno,
  getSettings as getSettingsJuno,
  listCanisters as listCanistersJuno,
  setSettings
} from '$lib/services/juno.services';
import {nonNullish} from '$lib/utils/utils';
import type {User} from '@junobuild/core';

export const initData = async (user: User) => {
  await Promise.all([
    initCanisters({key: IDB_KEY_CANISTER_IDS, collection: COLLECTION_CANISTER_IDS, user}),
    initCanisters({
      key: IDB_KEY_SNS_ROOT_CANISTER_IDS,
      collection: COLLECTION_SNS_ROOT_CANISTER_IDS,
      user
    }),
    initSettings({user})
  ]);
};

const initSettings = async ({user}: {user: User}) => {
  const [idbSettings, junoSettings] = await Promise.all([
    getSettingsIDB(),
    getSettingsJuno({user})
  ]);

  // Load Juno -> IDB
  if (nonNullish(junoSettings)) {
    const {
      data: {timerInterval, warnTCycles}
    } = junoSettings;
    await Promise.all([updateTimerInterval(timerInterval), updateWarnTCycles(warnTCycles)]);
    return;
  }

  // Migrate IDB -> Juno
  if (nonNullish(idbSettings)) {
    await setSettings({settings: idbSettings});
  }
};

const initCanisters = async ({
  key,
  collection,
  user
}: {
  key: string;
  collection: string;
  user: User;
}) => {
  const [idbCanisters, junoCanisters] = await Promise.all([
    listCanistersIDB(key),
    listCanistersJuno({collection, user})
  ]);

  // Load Juno -> IDB
  const canisterIds = junoCanisters.filter((canisterId) => !idbCanisters.includes(canisterId));
  if (canisterIds.length > 0) {
    await Promise.all(canisterIds.map((canisterId) => addCanisterIDB({key, canisterId})));
    return;
  }

  // Migrate IDB -> Juno
  const migrateCanisterIds = idbCanisters.filter(
    (canisterId) => !junoCanisters.includes(canisterId)
  );

  if (migrateCanisterIds.length > 0) {
    await addCanistersJuno({collection, canisterIds: migrateCanisterIds});
  }
};
