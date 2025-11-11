import type { TransferResult as TransferResultType } from '@dfinity/ledger-icp/dist/candid/ledger';
import {
	AccountIdentifier as AccountIdentifierJs,
	type SubAccount as SubAccountType,
	toTransferRawRequest
} from '@icp-sdk/canisters/ledger/icp';
import { IDL } from '@icp-sdk/core/candid';
import { Principal } from '@icp-sdk/core/principal';
import { call } from '@junobuild/functions/ic-cdk';

const Tokens = IDL.Record({ e8s: IDL.Nat64 });

const Memo = IDL.Nat64;

const SubAccount = IDL.Vec(IDL.Nat8);

const TimeStamp = IDL.Record({ timestamp_nanos: IDL.Nat64 });

const AccountIdentifier = IDL.Vec(IDL.Nat8);

const TransferArgs = IDL.Record({
	to: AccountIdentifier,
	fee: Tokens,
	memo: Memo,
	from_subaccount: IDL.Opt(SubAccount),
	created_at_time: IDL.Opt(TimeStamp),
	amount: Tokens
});

const BlockIndex = IDL.Nat64;

const TransferError = IDL.Variant({
	TxTooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
	BadFee: IDL.Record({ expected_fee: Tokens }),
	TxDuplicate: IDL.Record({ duplicate_of: BlockIndex }),
	TxCreatedInFuture: IDL.Null,
	InsufficientFunds: IDL.Record({ balance: Tokens })
});

const TransferResult = IDL.Variant({
	Ok: BlockIndex,
	Err: TransferError
});

export const icpTransfer = async ({
	ledgerId,
	to,
	toSubAccount,
	amount,
	fee,
	memo
}: {
	ledgerId: Principal;
	to: Principal;
	toSubAccount: SubAccountType;
	amount: bigint;
	fee: bigint | undefined;
	memo: bigint | undefined;
}): Promise<TransferResultType> => {
	const accountIdentifier = AccountIdentifierJs.fromPrincipal({
		principal: to,
		subAccount: toSubAccount
	});

	const args = toTransferRawRequest({
		to: accountIdentifier,
		fee,
		amount,
		memo
	});

	return await call<TransferResultType>({
		canisterId: ledgerId,
		method: 'transfer',
		args: [[TransferArgs, args]],
		result: TransferResult
	});
};
