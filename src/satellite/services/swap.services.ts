import { type RequestData, type RequestDataSwap } from '$lib/types/datastore';
import { jsonReplacer } from '@dfinity/utils';
import type { Principal } from '@icp-sdk/core/principal';
import type { OnSetDocContext } from '@junobuild/functions';
import type { IcrcLedgerDid } from '@junobuild/functions/canisters/ledger/icrc';
import { id } from '@junobuild/functions/ic-cdk';
import { decodeDocData } from '@junobuild/functions/sdk';
import { ICP_LEDGER_ID } from '../constants/functions.constants';
import {
	saveIcpToCyclesFailed,
	saveIcpToCyclesSwapped,
	saveIcpTransferredFromWallet,
	saveIcpTransferredToCmc
} from './bookkeeping.services';
import { notifyTopUp, transferIcpToCmc } from './cmc.services';
import { assertWalletBalance, transferIcpFromWallet } from './wallet.services';

export const swapIcpToCycles = async ({ caller, data: contextData }: OnSetDocContext) => {
	// ###############
	// Init data
	// ###############

	const requestKey = contextData.key;

	const data = decodeDocData<RequestData>(contextData.data.after.data);

	const fromAccount: IcrcLedgerDid.Account = {
		owner: data.wallet_owner,
		subaccount: []
	};

	const {
		swap: { amount, fee },
		target_canister_id: targetCanisterId
	} = data;

	const ledgerId = ICP_LEDGER_ID;

	// ###############
	// Check current account balance. This way the process can stop early on
	// ###############
	await assertWalletBalance({
		ledgerId,
		fromAccount,
		amount,
		fee
	});

	// ###############
	// Execute the swap.
	// ###############

	const result = await executeSwap({
		amount,
		fee,
		fromAccount,
		ledgerId,
		targetCanisterId,
		requestKey,
		caller
	});

	// ###############
	// We keep an internal track of the success or error of the swap.
	// ###############

	if (!result.success) {
		saveIcpToCyclesFailed({
			requestKey,
			error: result.err,
			caller
		});
		return;
	}

	saveIcpToCyclesSwapped({
		requestKey,
		cycles: result.cycles,
		caller
	});
};

type ExecuteSwapParams = {
	targetCanisterId: Principal;
	ledgerId: Principal;
	fromAccount: IcrcLedgerDid.Account;
	requestKey: string;
} & RequestDataSwap &
	Pick<OnSetDocContext, 'caller'>;

const executeSwap = async (
	params: ExecuteSwapParams
): Promise<{ success: true; cycles: bigint } | { success: false; err?: unknown }> => {
	try {
		const { cycles } = await tryExecuteSwap(params);
		return { success: true, cycles };
	} catch (err: unknown) {
		const parsedError =
			err instanceof Error && 'message' in err ? err.message : JSON.stringify(err, jsonReplacer);

		console.error('Error executing Swap:', parsedError);

		return {
			success: false,
			err: parsedError
		};
	}
};

const tryExecuteSwap = async ({
	targetCanisterId,
	ledgerId,
	fromAccount,
	amount: requestAmount,
	fee,
	requestKey,
	caller
}: ExecuteSwapParams): Promise<{ cycles: bigint }> => {
	// ###############
	// Transfer from wallet to satellite.
	// ###############

	const toAccount: IcrcLedgerDid.Account = {
		owner: id(),
		subaccount: []
	};

	const blockIndexWallet = await transferIcpFromWallet({
		ledgerId,
		fromAccount,
		toAccount,
		amount: requestAmount,
		fee
	});

	// ###############
	// We keep an internal track of the transferred ICP from the wallet
	// ###############

	saveIcpTransferredFromWallet({
		requestKey,
		blockIndex: blockIndexWallet,
		caller
	});

	// ###############
	// Use ICP to topup the targeted canister with the provided ICP
	// ###############

	const blockIndex = await transferIcpToCmc({
		ledgerId,
		targetCanisterId,
		amount: requestAmount
	});

	// We keep an internal track of the transferred ICP to the CMC
	saveIcpTransferredToCmc({
		requestKey,
		blockIndex,
		caller
	});

	const cycles = await notifyTopUp({
		blockIndex,
		targetCanisterId
	});

	return { cycles };
};
