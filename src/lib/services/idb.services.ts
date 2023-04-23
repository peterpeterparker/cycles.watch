import type {CanisterId} from '$lib/types/canister';
import {clear as clearIDB, get, update} from 'idb-keyval';
import {DEFAULT_SETTINGS, IDB_KEY_SETTINGS} from '../constants/constants';
import type {Settings} from '../types/settings';

export const listCanisters = async (key: string): Promise<CanisterId[]> => (await get(key)) ?? [];

export const addCanister = async ({key, canisterId}: {key: string; canisterId: CanisterId}) =>
  update(key, (canisters: CanisterId[] | undefined) => [
    ...(canisters ?? []).filter(({id}) => id !== canisterId.id),
    canisterId
  ]);

export const removeCanister = async ({key, canisterId}: {key: string; canisterId: string}) =>
  update(key, (canisters: CanisterId[] | undefined) => [
    ...(canisters ?? []).filter(({id}) => canisterId !== id)
  ]);

export const clear = (): Promise<void> => clearIDB();

export const getSettings = async (): Promise<Settings> =>
  (await get(IDB_KEY_SETTINGS)) ?? DEFAULT_SETTINGS;

export const updateTimerInterval = async (timerInterval: number) =>
  update<Settings>(IDB_KEY_SETTINGS, (settings: Settings | undefined) => ({
    ...(settings ?? DEFAULT_SETTINGS),
    timerInterval
  }));

export const updateWarnTCycles = async (warnTCycles: number) =>
  update<Settings>(IDB_KEY_SETTINGS, (settings: Settings | undefined) => ({
    ...(settings ?? DEFAULT_SETTINGS),
    warnTCycles
  }));
