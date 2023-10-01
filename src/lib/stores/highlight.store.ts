import { writable } from 'svelte/store';
import type { CanisterGroup } from '../types/canister';

export const highlightStore = writable<CanisterGroup | undefined>(undefined);
