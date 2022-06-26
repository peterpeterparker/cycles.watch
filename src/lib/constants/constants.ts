import type {Settings} from '../types/settings';

export const APP_VERSION = VITE_APP_VERSION;

export const localIdentityCanisterId: string | null | undefined = import.meta.env
  .VITE_IC_LOCAL_IDENTITY_CANISTER_ID as string | null | undefined;

export const IDB_KEY_CANISTER_IDS = 'cycles_watch_canister_ids';
export const IDB_KEY_SETTINGS = 'cycles_watch_settings';

export const DEFAULT_SETTINGS: Settings = {
  // Check every 30 minutes
  timerInterval: 30 * 60 * 1000,
  // Warn canister running out of cycles
  warnTCycles: 5
};
