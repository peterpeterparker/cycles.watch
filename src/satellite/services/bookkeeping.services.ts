import type { BookKeepingData } from '$lib/types/datastore';
import type { SetDoc } from '@junobuild/functions';
import { id } from '@junobuild/functions/ic-cdk';
import { encodeDocData, setDocStore } from '@junobuild/functions/sdk';

export const saveIcpTransferred = async (key: string) => {
	const bookData: BookKeepingData = {
		status: 'transfer-from-done'
	};

	const data = encodeDocData(bookData);

	const doc: SetDoc = {
		data
	};

	setDocStore({
		caller: id(),
		key,
		collection: 'bookkeeping',
		doc
	});
};
