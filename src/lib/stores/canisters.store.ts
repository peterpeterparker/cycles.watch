import {derived, writable} from 'svelte/store';
import type {Canister} from '../types/canister';

export const canistersStore = writable<Canister[] | undefined>(undefined);

export const canistersInitialized = derived(
  canistersStore,
  ($canisters) => $canisters !== undefined
);
