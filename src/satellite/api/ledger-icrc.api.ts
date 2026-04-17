import { Principal } from '@icp-sdk/core/principal';
import {
	IcrcLedgerCanister,
	type Account,
	type Tokens,
	type TransferFromArgs,
	type TransferFromResult
} from '@junobuild/functions/canisters/ledger/icrc';

export const icrcBalanceOf = async ({
	ledgerId,
	account
}: {
	ledgerId: Principal;
	account: Account;
}): Promise<Tokens> => {
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
	fromAccount: Account;
	toAccount: Account;
	amount: bigint;
	fee: bigint | undefined;
}): Promise<TransferFromResult> => {
	const args: TransferFromArgs = {
		amount,
		from: fromAccount,
		to: toAccount,
		fee
	};

	const { icrc2TransferFrom } = new IcrcLedgerCanister({ canisterId: ledgerId });
	return await icrc2TransferFrom({ args });
};
