import { encodeIcrcAccount } from '@dfinity/ledger-icrc';
import type { Account } from '@dfinity/ledger-icrc/dist/candid/icrc_ledger';
import { fromNullable } from '@dfinity/utils';
import { icrcBalanceOf, icrcTransferFrom } from '../api/ledger-icrc.api';

export const assertWalletBalance = async ({
	ledgerId,
	fromAccount,
	amount,
	fee
}: {
	ledgerId: string;
	fromAccount: Account;
	amount: bigint;
	fee: bigint | undefined;
}) => {
	const balance = await icrcBalanceOf({
		ledgerId,
		account: fromAccount
	});

	const total = amount + (fee ?? 10_000n);

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
	ledgerId: string;
	fromAccount: Account;
	toAccount: Account;
	amount: bigint;
	fee: bigint | undefined;
}): Promise<void> => {
	const result = await icrcTransferFrom(params);

	console.log('Result of the transfer from is:', result);
};
