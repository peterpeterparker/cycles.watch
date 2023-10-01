import { derived, writable } from 'svelte/store';
import type { Canister } from '../types/canister';

export interface CanistersStore {
	initialized: boolean;
	canisters: Canister[];
}

export const canistersStore = writable<CanistersStore>({
	initialized: false,
	canisters: []
});

export const canistersEmpty = derived(
	canistersStore,
	($canisters) => $canisters.canisters.length === 0 && $canisters.initialized
);

export const canistersUniqueGroups = derived(canistersStore, ($canisters) =>
	$canisters.canisters.filter(
		({ group }: Canister) => group?.type === 'nns' || group?.description === 'root'
	)
);

export const sortedCanisters = derived([canistersStore], ([{ canisters }]) =>
	canisters.sort(({ id: idA }, { id: idB }) => idA.localeCompare(idB))
);
