import type { Settings } from '../types/settings';

export const APP_VERSION = VITE_APP_VERSION;

export const SATELLITE_ID = import.meta.env.VITE_SATELLITE_ID;
export const CONTAINER = import.meta.env.VITE_CONTAINER;

export const ICP_LEDGER_ID = import.meta.env.VITE_ICP_LEDGER_ID as string;

export const OISY_SIGN_URL = import.meta.env.VITE_OISY_SIGN_URL as string;
export const JUNO_SIGN_URL = import.meta.env.VITE_JUNO_SIGN_URL as string;

export const IDB_KEY_CANISTER_IDS = 'cycles_watch_canister_ids';
export const IDB_KEY_SNS_ROOT_CANISTER_IDS = 'cycles_watch_sns_root_canister_ids';
export const IDB_KEY_SETTINGS = 'cycles_watch_settings';

export const COLLECTION_CANISTER_IDS = 'nns_canister_ids';
export const COLLECTION_SNS_ROOT_CANISTER_IDS = 'sns_canister_ids';
export const COLLECTION_SETTINGS = 'settings';

export const DEFAULT_SETTINGS: Settings = {
	// Check every 30 minutes
	timerInterval: 30 * 60 * 1000,
	// Warn canister running out of cycles
	warnTCycles: 5
};

export const E8S_PER_ICP = 100_000_000n;
export const IC_TRANSACTION_FEE_ICP = 10_000n;

export const DEFAULT_POLLING_INTERVAL_IN_MILLISECONDS = 2000;
