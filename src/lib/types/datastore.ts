import { Principal } from '@dfinity/principal';
import { z } from 'zod';
import { nonNullish } from '@dfinity/utils';

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
	'transfer-from-done',
	'transfer-from-wallet-done',
	'swapped',
	'failed'
]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BookKeepingDataSchema = z
	.object({
		status: BookKeepingStatusSchema,
		block_index: z.bigint().optional(),
		cycles: z.bigint().optional()
	})
	.refine((data) => nonNullish(data.block_index) !== nonNullish(data.cycles), {
		message: "Exactly one of 'block_index' or 'cycles' must be set."
	});

export type RequestDataSwap = z.infer<typeof RequestDataSwapSchema>;
export type RequestData = z.infer<typeof RequestDataSchema>;
export type BookKeepingStatus = z.infer<typeof BookKeepingStatusSchema>;
export type BookKeepingData = z.infer<typeof BookKeepingDataSchema>;
