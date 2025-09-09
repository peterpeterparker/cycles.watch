import { AUTH_MAX_TIME_TO_LIVE_IN_NANOSECONDS } from '$lib/constants/constants';
import { signIn } from '@junobuild/core';

export const signInWithII = (): Promise<void> =>
	signIn({
		internet_identity: {
			options: {
				maxTimeToLiveInNanoseconds: AUTH_MAX_TIME_TO_LIVE_IN_NANOSECONDS
			}
		}
	});
