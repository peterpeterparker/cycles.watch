import type {
	NotifyTopUpArg as NotifyTopUpArgType,
	NotifyTopUpResult as NotifyTopUpResultType
} from '@icp-sdk/canisters/cmc/dist/candid/cmc';
import { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';
import { call } from '@junobuild/functions/ic-cdk';
import { CMC_ID } from '../constants/functions.constants';

const BlockIndex = IDL.Nat64;

const NotifyTopUpArg = IDL.Record({
	block_index: BlockIndex,
	canister_id: IDL.Principal
});

const Cycles = IDL.Nat;

const NotifyError = IDL.Variant({
	Refunded: IDL.Record({
		block_index: IDL.Opt(BlockIndex),
		reason: IDL.Text
	}),
	InvalidTransaction: IDL.Text,
	Other: IDL.Record({
		error_message: IDL.Text,
		error_code: IDL.Nat64
	}),
	Processing: IDL.Null,
	TransactionTooOld: BlockIndex
});

const NotifyTopUpResult = IDL.Variant({ Ok: Cycles, Err: NotifyError });

export const cmcNotifyTopUp = async ({
	blockIndex,
	targetCanisterId
}: {
	blockIndex: bigint;
	targetCanisterId: Principal;
}): Promise<NotifyTopUpResultType> => {
	const args: NotifyTopUpArgType = {
		block_index: blockIndex,
		canister_id: targetCanisterId
	};

	return await call<NotifyTopUpResultType>({
		canisterId: CMC_ID,
		method: 'notify_top_up',
		args: [[NotifyTopUpArg, args]],
		result: NotifyTopUpResult
	});
};
