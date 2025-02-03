import { E8S_PER_ICP } from '$lib/constants/constants';
import { formatNumber } from './number.utils';

/**
 * Formats an ICP value (in e8s) to a human-readable string with 4 decimal places.
 *
 * @param {bigint} icp - The value of ICP in e8s (1 ICP = 10^8 e8s).
 * @returns {string} - The formatted ICP value as a string with 4 decimal places.
 */
export const formatICP = (icp: bigint): string =>
	formatNumber(Number(icp) / Number(E8S_PER_ICP), {
		minFraction: 4,
		maxFraction: 8
	});
