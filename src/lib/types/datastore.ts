import { nonNullish } from '@dfinity/utils';
import { Principal } from '@icp-sdk/core/principal';
import { z } from 'zod';

const PrincipalSchema = z.custom<Principal>((val) => val instanceof Principal, {
	message: 'Expected a Principal'
});

const RequestDataSwapSchema = z.object({
	amount: z.bigint(),
	fee: z.bigint().optional()
});

export const RequestDataSchema = z.object({
	status: z.enum(['submitted', 'swapped', 'failed']),
	wallet_owner: PrincipalSchema,
	swap: RequestDataSwapSchema,
	target_canister_id: PrincipalSchema
});

const BookKeepingStatusSchema = z.enum([
	'transfer-from-wallet-done',
	'transfer-to-cmc-done',
	'swapped',
	'failed'
]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BookKeepingDataSchema = z
	.object({
		status: BookKeepingStatusSchema,
		block_index: z.bigint().optional(),
		cycles: z.bigint().optional(),
		error: z.unknown().optional()
	})
	.refine((data) => [data.block_index, data.cycles, data.error].filter(nonNullish).length === 1, {
		message: "Exactly one of 'block_index', 'cycles', or 'error' can be set."
	});

export type RequestDataSwap = z.infer<typeof RequestDataSwapSchema>;
export type RequestData = z.infer<typeof RequestDataSchema>;
export type BookKeepingStatus = z.infer<typeof BookKeepingStatusSchema>;
export type BookKeepingData = z.infer<typeof BookKeepingDataSchema>;
