export const APP_VERSION = VITE_APP_VERSION;

export const localIdentityCanisterId: string | null | undefined = import.meta.env
  .VITE_IC_LOCAL_IDENTITY_CANISTER_ID as string | null | undefined;

export const IDB_KEY_CANISTER_IDS = 'canister_ids';
