import { fromNullable, jsonReplacer } from '@dfinity/utils';
import { encodeIcrcAccount } from '@icp-sdk/canisters/ledger/icrc';
import type { Account } from '@icp-sdk/canisters/ledger/icrc/dist/candid/icrc_ledger';
import type { Principal } from '@icp-sdk/core/principal';
import { icrcBalanceOf, icrcTransferFrom } from '../api/ledger-icrc.api';
import { IC_TRANSACTION_FEE_ICP } from '../constants/functions.constants';

export const assertWalletBalance = async ({
	ledgerId,
	fromAccount,
	amount,
	fee
}: {
	ledgerId: Principal;
	fromAccount: Account;
	amount: bigint;
	fee: bigint | undefined;
}) => {
	const balance = await icrcBalanceOf({
		ledgerId,
		account: fromAccount
	});

	const total = amount + (fee ?? IC_TRANSACTION_FEE_ICP);

	if (balance < total) {
		const encodedAccountText = encodeIcrcAccount({
			owner: fromAccount.owner,
			subaccount: fromNullable(fromAccount.subaccount)
		});

		throw new Error(
			`Balance ${balance} is smaller than ${total} for account ${encodedAccountText}.`
		);
	}
};

export const transferIcpFromWallet = async (params: {
	ledgerId: Principal;
	fromAccount: Account;
	toAccount: Account;
	amount: bigint;
	fee: bigint | undefined;
}): Promise<bigint> => {
	const result = await icrcTransferFrom(params);

	if ('Err' in result) {
		throw new Error(`Failed to transfer ICP from wallet: ${JSON.stringify(result, jsonReplacer)}`);
	}

	return result.Ok;
};
