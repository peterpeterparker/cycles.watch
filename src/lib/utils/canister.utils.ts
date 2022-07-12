import type {CanisterStatus} from '../types/canister';

export const toStatus = (
  status: {stopped: null} | {stopping: null} | {running: null}
): CanisterStatus =>
  'stopped' in status && status.stopped === null
    ? 'stopped'
    : 'stopping' in status && status.stopping === null
    ? 'stopping'
    : 'running';
