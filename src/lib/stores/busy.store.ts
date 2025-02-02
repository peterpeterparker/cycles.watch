import { nonNullish } from '$lib/utils/utils';
import { derived, writable, type Readable } from 'svelte/store';

export interface Busy {
	spinner: boolean;
}

const initBusyStore = () => {
	const { subscribe, set } = writable<Busy | undefined>(undefined);

	return {
		subscribe,

		start() {
			set({ spinner: true });
		},

		stop() {
			set(undefined);
		}
	};
};

export const busy = initBusyStore();

const initWizardBusyStore = () => {
	const { subscribe, set } = writable<boolean>(false);

	return {
		subscribe,

		start() {
			set(true);
		},

		stop() {
			set(false);
		}
	};
};

export const wizardBusy = initWizardBusyStore();

export const isBusy: Readable<boolean> = derived(
	[busy, wizardBusy],
	([$busy, $wizardBusy]) => nonNullish($busy) || $wizardBusy
);
