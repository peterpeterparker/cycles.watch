import type {Identity} from '@dfinity/agent';
import {AuthClient} from '@dfinity/auth-client';
import {derived, writable, type Readable} from 'svelte/store';
import {localIdentityCanisterId, localIdentityServiceUrl} from '../constants/constants';

export interface AuthStore {
  identity: Identity | undefined | null;
}

// How long the delegation identity should remain valid?
// e.g. BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000) = 7 days in nanoseconds
const maxTimeToLive = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);

const createAuthClient = (): Promise<AuthClient> =>
  AuthClient.create({
    idleOptions: {
      disableIdle: true,
      disableDefaultIdleCallback: true
    }
  });

let authClient: AuthClient | undefined;

const initAuthStore = () => {
  const {subscribe, set, update} = writable<AuthStore>({
    identity: undefined
  });

  return {
    subscribe,

    sync: async () => {
      authClient = authClient ?? (await createAuthClient());
      const isAuthenticated: boolean = await authClient.isAuthenticated();

      set({
        identity: isAuthenticated ? authClient.getIdentity() : null
      });
    },

    signIn: () =>
      new Promise<void>(async (resolve, reject) => {
        await authClient?.login({
          maxTimeToLive,
          onSuccess: () => {
            update((state: AuthStore) => ({
              ...state,
              identity: authClient?.getIdentity()
            }));

            resolve();
          },
          onError: reject,
          ...(localIdentityCanisterId !== null &&
            localIdentityCanisterId !== undefined && {
              identityProvider: `http://${localIdentityCanisterId}.localhost:8000?#authorize`
            }),
          ...(localIdentityServiceUrl !== null &&
            localIdentityServiceUrl !== undefined && {
              identityProvider: localIdentityServiceUrl
            })
        });
      }),

    signOut: async () => {
      const client: AuthClient = authClient ?? (await createAuthClient());

      await client.logout();

      update((state: AuthStore) => ({
        ...state,
        identity: null
      }));
    }
  };
};

export const authStore = initAuthStore();

export const authSignedInStore: Readable<boolean> = derived(
  authStore,
  ({identity}) => identity !== null && identity !== undefined
);
