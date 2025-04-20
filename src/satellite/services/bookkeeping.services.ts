import type { BookKeepingData, BookKeepingStatus } from '$lib/types/datastore';
import { nonNullish } from '@dfinity/utils';
import type { SetDoc } from '@junobuild/functions';
import { id } from '@junobuild/functions/ic-cdk';
import { encodeDocData, setDocStore } from '@junobuild/functions/sdk';

export const saveIcpTransferredFromWallet = (params: {
	requestKey: string;
	blockIndex: bigint;
}) => {
	saveBookKeeping({
		...params,
		status: 'transfer-from-done'
	});
};

export const saveIcpTransferredToCmc = (params: { requestKey: string; blockIndex: bigint }) => {
	saveBookKeeping({
		...params,
		status: 'transfer-from-wallet-done'
	});
};

export const saveIcpToCyclesSwapped = (params: { requestKey: string; cycles: bigint }) => {
	saveBookKeeping({
		...params,
		status: 'swapped'
	});
};

export const saveIcpToCyclesFailed = (params: { requestKey: string; error: unknown }) => {
	saveBookKeeping({
		...params,
		status: 'failed'
	});
};

const saveBookKeeping = ({
	requestKey,
	blockIndex,
	cycles,
	status,
	error
}: {
	requestKey: string;
	blockIndex?: bigint;
	cycles?: bigint;
	error?: unknown;
	status: BookKeepingStatus;
}) => {
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

	const key = `${requestKey}#${status}`;

	setDocStore({
		caller: id(),
		key,
		collection: 'bookkeeping',
		doc
	});
};
