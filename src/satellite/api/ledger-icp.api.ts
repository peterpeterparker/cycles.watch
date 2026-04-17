import { nonNullish } from '@dfinity/utils';
import {
	AccountIdentifier as AccountIdentifierJs,
	type SubAccount as SubAccountType
} from '@icp-sdk/canisters/ledger/icp';
import { Principal } from '@icp-sdk/core/principal';
import {
	IcpLedgerCanister,
	type TransferArgs,
	type TransferResult
} from '@junobuild/functions/canisters/ledger/icp';

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
}): Promise<TransferResult> => {
	const accountIdentifier = AccountIdentifierJs.fromPrincipal({
		principal: to,
		subAccount: toSubAccount
	});

	const TRANSACTION_FEE = BigInt(10_000);

	const args: TransferArgs = {
		to: accountIdentifier.toUint8Array(),
		fee: nonNullish(fee) ? { e8s: fee } : { e8s: TRANSACTION_FEE },
		memo: memo ?? 0n,
		amount: { e8s: amount }
	};

	const { transfer } = new IcpLedgerCanister({ canisterId: ledgerId });
	return await transfer({ args });
};
