import { SubAccount } from '@dfinity/ledger-icp';
import type { Principal } from '@dfinity/principal';
import { jsonReplacer } from '@dfinity/utils';
import { cmcNotifyTopUp } from '../api/cmc.api';
import { icpTransfer } from '../api/ledger-icp.api';
import { CMC_ID, IC_TRANSACTION_FEE_ICP } from '../constants/functions.constants';

export const transferIcpToCmc = async ({
	ledgerId,
	targetCanisterId,
	amount
}: {
	ledgerId: Principal;
	targetCanisterId: Principal;
	amount: bigint;
}): Promise<bigint> => {
	const sendAmount = amount - IC_TRANSACTION_FEE_ICP;

	const subAccount = SubAccount.fromPrincipal(targetCanisterId);

	const MEMO_CANISTER_TOP_UP = BigInt(0x50555054); // == 'TPUP'

	const result = await icpTransfer({
		ledgerId,
		to: CMC_ID,
		toSubAccount: subAccount,
		amount: sendAmount,
		fee: IC_TRANSACTION_FEE_ICP,
		memo: MEMO_CANISTER_TOP_UP
	});

	if ('Err' in result) {
		throw new Error(
			`Failed to transfer ICP for the CMC and subaccount: ${JSON.stringify(result, jsonReplacer)}`
		);
	}

	return result.Ok;
};

export const notifyTopUp = async (params: {
	blockIndex: bigint;
	targetCanisterId: Principal;
}): Promise<void> => {
	const result = await cmcNotifyTopUp(params);

	if ('Err' in result) {
		throw new Error(
			`Failed to notify the CMC to topup canister with params ${JSON.stringify(params, jsonReplacer)}: ${JSON.stringify(result, jsonReplacer)}`
		);
	}
};
