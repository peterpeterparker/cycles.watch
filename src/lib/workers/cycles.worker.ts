import { IDB_KEY_CANISTER_IDS, IDB_KEY_SNS_ROOT_CANISTER_IDS } from '$lib/constants/constants';
import { icpXdrConversionRate } from '$lib/services/cmc.services';
import { canisterStatus } from '$lib/services/ic.services';
import { getSettings, listCanisters } from '$lib/services/idb.services';
import { snsCanisters } from '$lib/services/sns.services';
import type { Canister, CanisterGroup, CanisterMeta } from '$lib/types/canister';
import type { PostMessageDataRequest, PostMessageSync } from '$lib/types/post-message';
import type { CanisterInfo, SnsCanisterInfo } from '$lib/types/services';
import type { Settings } from '$lib/types/settings';
import { cyclesToICP, formatTCycles } from '$lib/utils/cycles.utils';
import type { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

onmessage = async ({ data: dataMsg }: MessageEvent<PostMessageSync<PostMessageDataRequest>>) => {
	const { msg, data } = dataMsg;

	if ('stopCyclesTimer' === msg) {
		await stopCyclesTimer();
		return;
	}

	const { meta } = data;

	const settings: Settings = await getSettings();

	switch (msg) {
		case 'startCyclesTimer':
			await startCyclesTimer({ settings });
			return;
		case 'addCanister':
			await addNnsCanister({
				meta,
				settings
			});
			return;
		case 'addSnsCanister':
			await addSnsCanister({
				meta,
				settings
			});
			return;
	}
};

let timer: NodeJS.Timeout | undefined = undefined;

const loadIdentity = async (): Promise<Identity | undefined> => {
	const authClient = await AuthClient.create({
		idleOptions: {
			disableIdle: true,
			disableDefaultIdleCallback: true
		}
	});

	return authClient.getIdentity();
};

const startCyclesTimer = async ({ settings }: { settings: Settings }) => {
	const identity: Identity | undefined = await loadIdentity();

	const sync = async () => await syncCanisters({ identity, settings });

	// We sync the cycles now but also schedule the update afterwards
	await sync();

	const { timerInterval }: Settings = settings;

	timer = setInterval(sync, timerInterval);
};

const stopCyclesTimer = async () => {
	if (!timer) {
		return;
	}

	clearInterval(timer);
	timer = undefined;
};

const syncCanisters = async ({
	identity,
	settings
}: {
	identity: Identity | undefined;
	settings: Settings;
}) => {
	const trillionRatio: bigint = await icpXdrConversionRate();

	await Promise.all([
		syncNnsCanisters({ identity, settings, trillionRatio }),
		syncSnsCanisters({ settings, trillionRatio })
	]);
};

const syncNnsCanisters = async ({
	identity,
	settings,
	trillionRatio
}: {
	identity: Identity | undefined;
	settings: Settings;
	trillionRatio: bigint;
}) => {
	const canisterIds: CanisterMeta[] = await listCanisters(IDB_KEY_CANISTER_IDS);

	// Update ui with the list of canisters about to be synced
	postMessage({
		msg: 'initCanisters',
		data: {
			canisters: canisterIds.map(({ id: canisterId, ...rest }) => ({
				id: canisterId,
				meta: { id: canisterId, ...rest },
				status: 'syncing'
			}))
		}
	});

	if (!identity) {
		// not signed in, therefore cannot sync canisters
		postMessage({
			msg: 'initCanisters',
			data: {
				canisters: canisterIds.map(({ id: canisterId }) => ({
					id: canisterId,
					status: 'auth',
					group: { type: 'nns', id: canisterId }
				}))
			}
		});
		return [];
	}

	await Promise.allSettled(
		canisterIds.map(async ({ id: canisterId, ...rest }) => {
			try {
				const canisterInfo: CanisterInfo = await canisterStatus({ canisterId, identity });

				await syncCanister({
					canisterId,
					canisterInfo,
					trillionRatio,
					settings,
					group: { type: 'nns', id: canisterInfo.canisterId },
					meta: { id: canisterId, ...rest }
				});
			} catch (err: unknown) {
				console.error(err);

				emitCanister({
					id: canisterId,
					status: 'error',
					group: { type: 'nns', id: canisterId },
					meta: {
						id: canisterId,
						...rest
					}
				});

				throw err;
			}
		})
	);
};

const syncSnsCanisters = async ({
	settings,
	trillionRatio
}: {
	settings: Settings;
	trillionRatio: bigint;
}) => {
	const canisterRootIds: CanisterMeta[] = await listCanisters(IDB_KEY_SNS_ROOT_CANISTER_IDS);

	// Update ui with the list of canisters about to be synced
	postMessage({
		msg: 'initCanisters',
		data: {
			canisters: canisterRootIds.map(({ id: canisterId, ...rest }) => ({
				id: canisterId,
				meta: { id: canisterId, ...rest },
				status: 'syncing'
			}))
		}
	});

	await Promise.allSettled(
		canisterRootIds.map(async ({ id: rootCanisterId, ...rest }) => {
			try {
				const canisterInfos: SnsCanisterInfo[] = await snsCanisters({ rootCanisterId });

				const syncCanisters: Promise<void>[] = canisterInfos.map((canisterInfo: SnsCanisterInfo) =>
					syncCanister({
						canisterId: canisterInfo.canisterId,
						canisterInfo,
						trillionRatio,
						settings,
						group: { type: 'sns', id: rootCanisterId, description: canisterInfo.type },
						meta: { id: canisterInfo.canisterId, ...rest }
					})
				);

				await Promise.all(syncCanisters);
			} catch (err: unknown) {
				console.error(err);

				emitCanister({
					id: rootCanisterId,
					status: 'error',
					group: { type: 'sns', id: rootCanisterId, description: 'root' },
					meta: {
						id: rootCanisterId
					}
				});

				throw err;
			}
		})
	);
};

const addNnsCanister = async ({
	meta,
	settings
}: {
	meta: CanisterMeta | undefined;
	settings: Settings;
}) => {
	if (meta === undefined) {
		throw new Error('Canister id unknown');
	}

	const { id: canisterId, ...rest } = meta;

	// Update ui with the canister information as syncing
	postMessage({
		msg: 'syncCanister',
		data: {
			canister: {
				id: canisterId,
				status: 'syncing'
			}
		}
	});

	const identity: Identity | undefined = await loadIdentity();

	if (!identity) {
		// not signed in, therefore cannot sync canisters
		postMessage({
			msg: 'syncCanister',
			data: {
				canister: {
					id: canisterId,
					status: 'auth',
					group: { type: 'nns', id: canisterId }
				}
			}
		});
		return;
	}

	try {
		const [canisterInfo, trillionRatio] = await Promise.all([
			canisterStatus({ canisterId, identity }),
			icpXdrConversionRate()
		]);

		await syncCanister({
			canisterId,
			canisterInfo,
			trillionRatio,
			settings,
			group: { type: 'nns', id: canisterId },
			meta: { id: canisterId, ...rest }
		});
	} catch (err) {
		catchErr({ err, canisterId, group: { type: 'nns', id: canisterId } });
	}
};

// Update ui with one canister information
const emitCanister = (canister: Canister) =>
	postMessage({
		msg: 'syncCanister',
		data: {
			canister
		}
	});

const syncCanister = async ({
	canisterId,
	meta: { id, ...rest },
	settings: { warnTCycles },
	trillionRatio,
	canisterInfo: { cycles, status, memory_size },
	group
}: {
	canisterId: string;
	meta: CanisterMeta;
	settings: Settings;
	trillionRatio: bigint;
	canisterInfo: CanisterInfo;
	group: CanisterGroup;
}) => {
	const tCycles = Number(formatTCycles(cycles));

	const canister: Canister = {
		id: canisterId,
		status: 'synced',
		data: {
			status,
			memory_size,
			cycles,
			icp: cyclesToICP({ cycles, trillionRatio }),
			cyclesStatus: tCycles < 0 ? 'error' : tCycles < warnTCycles ? 'warn' : 'ok'
		},
		group,
		meta: {
			id,
			...rest
		}
	};

	emitCanister(canister);
};

const addSnsCanister = async ({
	meta,
	settings
}: {
	meta: CanisterMeta | undefined;
	settings: Settings;
}) => {
	if (meta === undefined) {
		throw new Error('Root canister id unknown');
	}

	const { id: canisterId, ...rest } = meta;

	// Update ui with the canister information as syncing
	postMessage({
		msg: 'syncCanister',
		data: {
			canister: {
				id: canisterId,
				status: 'syncing'
			}
		}
	});

	try {
		const [canisterInfos, trillionRatio] = await Promise.all([
			snsCanisters({ rootCanisterId: canisterId }),
			icpXdrConversionRate()
		]);

		await Promise.all(
			canisterInfos.map((canisterInfo: SnsCanisterInfo) =>
				syncCanister({
					canisterId: canisterInfo.canisterId,
					canisterInfo,
					trillionRatio,
					settings,
					group: { type: 'sns', id: canisterId, description: canisterInfo.type },
					meta: { id: canisterId, ...rest }
				})
			)
		);
	} catch (err) {
		catchErr({ err, canisterId, group: { type: 'sns', id: canisterId, description: 'root' } });
	}
};

const catchErr = ({
	err,
	canisterId: id,
	group
}: {
	err: unknown;
	canisterId: string;
	group: CanisterGroup;
}) => {
	console.error(err);

	emitCanister({
		id,
		status: 'error',
		group,
		meta: {
			id
		}
	});
};

export {};
