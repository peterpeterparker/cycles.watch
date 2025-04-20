import { RequestDataSchema } from '$lib/types/datastore';
import {
	type AssertSetDoc,
	defineAssert,
	defineHook,
	type OnSetDoc,
	type OnSetDocContext,
	type RunFunction
} from '@junobuild/functions';
import { decodeDocData } from '@junobuild/functions/sdk';
import { swapIcpToCycles } from './services/swap.services';

export const assertSetDoc = defineAssert<AssertSetDoc>({
	collections: ['request'],
	assert: (context) => {
		const data = decodeDocData(context.data.data.proposed.data);
		RequestDataSchema.parse(data);
	}
});

const collections = ['request'] as const;

type OnSetDocCollection = (typeof collections)[number];

export const onSetDoc = defineHook<OnSetDoc>({
	collections,
	run: async (context) => {
		const fn: Record<OnSetDocCollection, RunFunction<OnSetDocContext>> = {
			request: swapIcpToCycles
		};

		await fn[context.data.collection as OnSetDocCollection]?.(context);
	}
});
