import type {CanisterMeta} from '$lib/types/canister';
import {clear as clearIDB, get, update} from 'idb-keyval';
import {DEFAULT_SETTINGS, IDB_KEY_SETTINGS} from '../constants/constants';
import type {Settings} from '../types/settings';

export const listCanisters = async (key: string): Promise<CanisterMeta[]> => (await get(key)) ?? [];

export const addCanister = async ({key, meta}: {key: string; meta: CanisterMeta}) =>
  update(key, (canisters: (string | CanisterMeta)[] | undefined) => [
    ...(canisters ?? []).filter((id) => (typeof id === 'object' ? id.id : id) !== meta.id),
    meta
  ]);

export const removeCanister = async ({key, canisterId}: {key: string; canisterId: string}) =>
  update(key, (canisters: CanisterMeta[] | undefined) => [
    ...(canisters ?? []).filter((id) => (typeof id === 'object' ? id.id : id) !== canisterId)
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
