import { signIn } from '@junobuild/core';

export const signInWithII = (): Promise<void> =>
	signIn({
		internet_identity: {
			options: {
				// Session duration 14 days
				maxTimeToLiveInNanoseconds: BigInt(14 * 24 * 60 * 60 * 1000 * 1000 * 1000)
			}
		}
	});
