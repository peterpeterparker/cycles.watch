import { writable } from 'svelte/store';

export const icpXdrConversionRateStore = writable<bigint | undefined>(undefined);
