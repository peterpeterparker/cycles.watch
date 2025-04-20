import { type RequestData, RequestDataSchema } from '$lib/types/datastore';
import type { Account } from '@dfinity/ledger-icrc/dist/candid/icrc_ledger';
import { type AssertSetDoc, defineAssert, defineHook, type OnSetDoc } from '@junobuild/functions';
import { id } from '@junobuild/functions/ic-cdk';
import { decodeDocData } from '@junobuild/functions/sdk';
import { icrcBalanceOf } from './api/ledger-icrc.api';
import { ICP_LEDGER_ID } from './constants/functions.constants';
import { saveIcpTransferred } from './services/bookkeeping.services';
import { notifyTopUp, transferIcpToCmc } from './services/cmc.services';
import { assertWalletBalance, transferIcpFromWallet } from './services/wallet.services';

export const assertSetDoc = defineAssert<AssertSetDoc>({
	collections: ['request'],
	assert: (context) => {
		const data = decodeDocData(context.data.data.proposed.data);
		RequestDataSchema.parse(data);
	}
});

export const onSetDoc = defineHook<OnSetDoc>({
	collections: ['request'],
	run: async (context) => {
		// ###############
		// Init data
		// ###############

		const data = decodeDocData<RequestData>(context.data.data.after.data);

		const fromAccount: Account = {
			owner: data.wallet_owner,
			subaccount: []
		};

		const {
			swap: { amount: requestAmount, fee },
			target_canister_id: targetCanisterId
		} = data;

		const ledgerId = ICP_LEDGER_ID;

		// ###############
		// Check current account balance. This way the process can stop early on
		// ###############
		await assertWalletBalance({
			ledgerId,
			fromAccount,
			amount: requestAmount,
			fee
		});

		// ###############
		// Transfer from wallet to satellite.
		// ###############

		const toAccount: Account = {
			owner: id(),
			subaccount: []
		};

		await transferIcpFromWallet({
			ledgerId,
			fromAccount,
			toAccount,
			amount: requestAmount,
			fee
		});

		// ###############
		// We keep an internal track of the transferred ICP
		// ###############

		await saveIcpTransferred(context.data.key);

		// ###############
		// Use ICP to topup the targeted canister with the provided ICP
		// ###############

		const blockIndex = await transferIcpToCmc({
			ledgerId,
			targetCanisterId,
			amount: requestAmount
		});

		// TODO: save ICP transferred to CMC

		await notifyTopUp({
			blockIndex,
			targetCanisterId
		});

		// TODO: save DONE

		// ###############
		// Just a print out to check the balance while developing.
		// ###############

		const balance = await icrcBalanceOf({
			ledgerId,
			account: toAccount
		});

		console.log('This is now the balance of the satellite:', balance);

		// TODO: save errors
	}
});
