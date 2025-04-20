import { Principal } from '@dfinity/principal';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BookKeepingDataSchema = z.object({
	status: z.enum(['transfer-from-done', 'swapped', 'failed'])
});

export type RequestDataSwap = z.infer<typeof RequestDataSwapSchema>;
export type RequestData = z.infer<typeof RequestDataSchema>;
export type BookKeepingData = z.infer<typeof BookKeepingDataSchema>;
