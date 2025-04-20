import { toasts } from '$lib/stores/toasts.store';
import type { BookKeepingData } from '$lib/types/datastore';
import type { PostMessageDataRequest } from '$lib/types/post-message';
import { emit } from '$lib/utils/events.utils';
import { retryUntilReady } from '$lib/utils/timeout.utils';
import { isNullish } from '@dfinity/utils';
import { getDoc } from '@junobuild/core';

export const pollSwapResult = async ({ requestKey }: { requestKey: string }) => {
	type SwapResult = { success: true } | { success: false; err?: unknown };

	const findSwapResult = async (): Promise<{ result: SwapResult } | { pending: null }> => {
		const doc = await getDoc<BookKeepingData>({
			collection: 'bookkeeping',
			key: `${requestKey}#swap-result`
		});

		if (isNullish(doc)) {
			return { pending: null };
		}

		const {
			data: { status }
		} = doc;

		if (status === 'swapped') {
			return { result: { success: true } };
		}

		return { result: { success: false, err: doc.data.error } };
	};

	const result = await retryUntilReady<SwapResult>({
		fn: findSwapResult,
		retries: 15
	});

	if ('timeout' in result) {
		toasts.warn('The ICP-to-cycles swap did not complete within the expected time.');
		return;
	}

	const { result: resultData } = result;

	if (resultData.success) {
		setTimeout(() => emit<PostMessageDataRequest>({ message: 'restartTimer' }), 2500);

		toasts.success('ICP successfully swapped to cycles.');
		return;
	}

	toasts.error({
		text: 'There was an error while swapping ICP to cycles.',
		detail: resultData.err
	});
};
