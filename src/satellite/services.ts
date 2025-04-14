import type { Account } from '@dfinity/ledger-icrc/dist/candid/icrc_ledger';
import { icrcBalanceOf, icrcTransferFrom } from './ledgerIcrc';

export const assertWalletBalance = async ({
	ledgerId,
	fromAccount
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

	console.log('Balance ->', balance);
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
