import { toNullable } from '@dfinity/utils';
import { Principal } from '@icp-sdk/core/principal';
import { IcrcLedgerCanister, type IcrcLedgerDid } from '@junobuild/functions/canisters/ledger/icrc';

export const icrcBalanceOf = async ({
	ledgerId,
	account
}: {
	ledgerId: Principal;
	account: IcrcLedgerDid.Account;
}): Promise<IcrcLedgerDid.Tokens> => {
	const { icrc1BalanceOf } = new IcrcLedgerCanister({ canisterId: ledgerId });
	return await icrc1BalanceOf({ account });
};

export const icrcTransferFrom = async ({
	ledgerId,
	fromAccount,
	toAccount,
	amount,
	fee
}: {
	ledgerId: Principal;
	fromAccount: IcrcLedgerDid.Account;
	toAccount: IcrcLedgerDid.Account;
	amount: bigint;
	fee: bigint | undefined;
}): Promise<IcrcLedgerDid.TransferFromResult> => {
	const args: IcrcLedgerDid.TransferFromArgs = {
		amount,
		from: fromAccount,
		to: toAccount,
		created_at_time: toNullable(),
		fee: toNullable(fee),
		memo: toNullable(),
		spender_subaccount: toNullable()
	};

	const { icrc2TransferFrom } = new IcrcLedgerCanister({ canisterId: ledgerId });
	return await icrc2TransferFrom({ args });
};
