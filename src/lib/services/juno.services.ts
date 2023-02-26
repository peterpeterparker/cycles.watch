import {COLLECTION_SETTINGS, DEFAULT_SETTINGS} from '$lib/constants/constants';
import {authStore} from '$lib/stores/auth.store';
import type {Settings} from '$lib/types/settings';
import {isNullish, nonNullish} from '$lib/utils/utils';
import {getDoc as getJunoDoc, setDoc, type Doc, type User} from '@junobuild/core';
import {get} from 'svelte/store';

const getDoc = ({
  collection,
  user
}: {
  collection: string;
  user: User;
}): Promise<Doc<string[]> | undefined> =>
  getJunoDoc<string[]>({
    collection,
    key: user.key
  });

export const listCanisters = async ({
  collection,
  user
}: {
  collection: string;
  user: User;
}): Promise<string[]> => {
  try {
    const doc = await getDoc({collection, user});

    return doc?.data ?? [];
  } catch (err: unknown) {
    console.error(err);
    return [];
  }
};

export const addCanisters = async ({
  collection,
  canisterIds
}: {
  collection: string;
  canisterIds: string[];
}) => {
  const {user} = get(authStore);

  if (isNullish(user)) {
    throw new Error('User not signed-in.');
  }

  const doc = await getDoc({collection, user});

  await setDoc<string[]>({
    collection,
    doc: {
      ...(nonNullish(doc) && doc),
      key: user.key,
      data: [...new Set([...(doc?.data ?? []), ...canisterIds])]
    }
  });
};

export const removeCanister = async ({
  collection,
  canisterId
}: {
  collection: string;
  canisterId: string;
}) => {
  const {user} = get(authStore);

  if (isNullish(user)) {
    throw new Error('User not signed-in.');
  }

  const doc = await getDoc({collection, user});

  if (isNullish(doc)) {
    return;
  }

  await setDoc<string[]>({
    collection,
    doc: {
      ...doc,
      data: [...(doc.data ?? []).filter((id: string) => canisterId !== id)]
    }
  });
};

export const getSettings = ({user}: {user: User}): Promise<Doc<Settings> | undefined> =>
  getJunoDoc<Settings>({
    collection: COLLECTION_SETTINGS,
    key: user.key
  });

export const setSettings = async ({settings}: {settings: Partial<Settings>}) => {
  const {user} = get(authStore);

  if (isNullish(user)) {
    throw new Error('User not signed-in.');
  }

  const doc = await getJunoDoc<Settings>({
    collection: COLLECTION_SETTINGS,
    key: user.key
  });

  await setDoc<Settings>({
    collection: COLLECTION_SETTINGS,
    doc: {
      ...(nonNullish(doc) && doc),
      key: user.key,
      data: {
        timerInterval:
          settings?.timerInterval ?? doc?.data.timerInterval ?? DEFAULT_SETTINGS.timerInterval,
        warnTCycles: settings?.warnTCycles ?? doc?.data.warnTCycles ?? DEFAULT_SETTINGS.warnTCycles
      }
    }
  });
};
