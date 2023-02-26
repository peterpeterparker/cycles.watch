import {nonNullish} from '$lib/utils/utils';
import type {User} from '@junobuild/core';
import {authSubscribe} from '@junobuild/core';
import {derived, readable, type Readable} from 'svelte/store';

export interface AuthStore {
  user: User | null | undefined;
}

const initAuthStore: AuthStore = {
  user: undefined
};

const start = (set: (store: AuthStore) => void) => {
  const subscriber: () => void = authSubscribe((user: User | null) => {
    console.log('User:', user);
    set({user});
  });

  return function stop() {
    subscriber?.();
    set(initAuthStore);
  };
};

export const authStore = readable<AuthStore>(initAuthStore, start);

export const authSignedInStore: Readable<boolean> = derived(authStore, ({user}) =>
  nonNullish(user)
);
