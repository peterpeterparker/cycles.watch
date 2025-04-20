import { DEFAULT_POLLING_INTERVAL_IN_MILLISECONDS } from '$lib/constants/constants';

const waitForMilliseconds = async (milliseconds: number): Promise<void> => {
	await new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
};

export const retryUntilReady = async <T>({
	retries,
	fn,
	intervalInMilliseconds = DEFAULT_POLLING_INTERVAL_IN_MILLISECONDS
}: {
	retries: number;
	fn: () => Promise<{ pending: null } | { result: T }>;
	intervalInMilliseconds?: number;
}): Promise<{ result: T } | { timeout: null }> => {
	const result = await fn();

	if ('result' in result) {
		return result;
	}

	const remainingRetries = retries - 1;

	if (remainingRetries === 0) {
		return { timeout: null };
	}

	await waitForMilliseconds(intervalInMilliseconds);

	return await retryUntilReady({ retries: remainingRetries, intervalInMilliseconds, fn });
};
