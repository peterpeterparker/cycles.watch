import { COLLECTION_SETTINGS, DEFAULT_SETTINGS } from '$lib/constants/constants';
import { authStore } from '$lib/stores/auth.store';
import type { CanisterMeta } from '$lib/types/canister';
import type { Settings } from '$lib/types/settings';
import { isNullish, nonNullish } from '$lib/utils/utils';
import { getDoc as getJunoDoc, setDoc, type Doc, type User } from '@junobuild/core-peer';
import { get } from 'svelte/store';

const getDoc = ({
	collection,
	user
}: {
	collection: string;
	user: User;
}): Promise<Doc<(CanisterMeta | string)[]> | undefined> =>
	getJunoDoc<(CanisterMeta | string)[]>({
		collection,
		key: user.key
	});

export const listCanisters = async ({
	collection,
	user
}: {
	collection: string;
	user: User;
}): Promise<CanisterMeta[]> => {
	try {
		const doc = await getDoc({ collection, user });

		return (doc?.data ?? []).map((data: CanisterMeta | string) =>
			typeof data === 'object' ? data : { id: data }
		);
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
	canisterIds: CanisterMeta[];
}) => {
	const { user } = get(authStore);

	if (isNullish(user)) {
		throw new Error('User not signed-in.');
	}

	const doc = await getDoc({ collection, user });

	await setDoc<(string | CanisterMeta)[]>({
		collection,
		doc: {
			...(nonNullish(doc) && doc),
			key: user.key,
			data: [...(doc?.data ?? []), ...canisterIds]
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
	const { user } = get(authStore);

	if (isNullish(user)) {
		throw new Error('User not signed-in.');
	}

	const doc = await getDoc({ collection, user });

	if (isNullish(doc)) {
		return;
	}

	await setDoc<(string | CanisterMeta)[]>({
		collection,
		doc: {
			...doc,
			data: [
				...(doc.data ?? []).filter(
					(id: string | CanisterMeta) => canisterId !== (typeof id === 'object' ? id.id : id)
				)
			]
		}
	});
};

export const getSettings = ({ user }: { user: User }): Promise<Doc<Settings> | undefined> =>
	getJunoDoc<Settings>({
		collection: COLLECTION_SETTINGS,
		key: user.key
	});

export const setSettings = async ({ settings }: { settings: Partial<Settings> }) => {
	const { user } = get(authStore);

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
