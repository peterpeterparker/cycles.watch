import type { BookKeepingData, BookKeepingStatus } from '$lib/types/datastore';
import { nonNullish } from '@dfinity/utils';
import type { OnSetDocContext, SetDoc } from '@junobuild/functions';
import { encodeDocData, setDocStore } from '@junobuild/functions/sdk';

export const saveIcpTransferredFromWallet = (
	params: {
		requestKey: string;
		blockIndex: bigint;
	} & Pick<OnSetDocContext, 'caller'>
) => {
	saveBookKeeping({
		...params,
		status: 'transfer-from-wallet-done',
		keySuffix: 'transfer-from-wallet'
	});
};

export const saveIcpTransferredToCmc = (
	params: { requestKey: string; blockIndex: bigint } & Pick<OnSetDocContext, 'caller'>
) => {
	saveBookKeeping({
		...params,
		status: 'transfer-to-cmc-done',
		keySuffix: 'transfer-to-cmc'
	});
};

export const saveIcpToCyclesSwapped = (
	params: { requestKey: string; cycles: bigint } & Pick<OnSetDocContext, 'caller'>
) => {
	saveBookKeeping({
		...params,
		status: 'swapped',
		keySuffix: 'swap-result'
	});
};

export const saveIcpToCyclesFailed = (
	params: { requestKey: string; error: unknown } & Pick<OnSetDocContext, 'caller'>
) => {
	saveBookKeeping({
		...params,
		status: 'failed',
		keySuffix: 'swap-result'
	});
};

const saveBookKeeping = ({
	requestKey,
	keySuffix,
	blockIndex,
	cycles,
	status,
	error,
	caller
}: {
	requestKey: string;
	keySuffix: 'transfer-from-wallet' | 'transfer-to-cmc' | 'swap-result';
	blockIndex?: bigint;
	cycles?: bigint;
	error?: unknown;
	status: BookKeepingStatus;
} & Pick<OnSetDocContext, 'caller'>) => {
	const bookData: BookKeepingData = {
		status,
		...(nonNullish(blockIndex) && { block_index: blockIndex }),
		...(nonNullish(cycles) && { cycles }),
		...(nonNullish(error) && { error })
	};

	const data = encodeDocData(bookData);

	const doc: SetDoc = {
		data
	};

	const key = `${requestKey}#${keySuffix}`;

	setDocStore({
		caller,
		key,
		collection: 'bookkeeping',
		doc
	});
};
