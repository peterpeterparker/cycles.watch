import {
	AccountIdentifier as AccountIdentifierJs,
	type SubAccount as SubAccountType,
	toTransferRawRequest
} from '@icp-sdk/canisters/ledger/icp';
import { Principal } from '@icp-sdk/core/principal';
import { IcpLedgerCanister, type IcpLedgerDid } from '@junobuild/functions/canisters/ledger/icp';

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
}): Promise<IcpLedgerDid.TransferResult> => {
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

	const { transfer } = new IcpLedgerCanister({ canisterId: ledgerId });
	return await transfer({ args });
};
