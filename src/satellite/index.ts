import type { RequestData } from '$lib/types/datastore';
import type { Account } from '@dfinity/ledger-icrc/dist/candid/icrc_ledger';
import { defineHook, type OnSetDoc } from '@junobuild/functions';
import { decodeDocData } from '@junobuild/functions/sdk';
import { assertWalletBalance } from './services';

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

		// TODO: process.env.ICP_LEDGER_ID
		const ledgerId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

		console.log(requestAmount, fee, targetCanisterId, ledgerId);

		// ###############
		// Check current account balance. This way the process can stop early on
		// ###############
		await assertWalletBalance({
			ledgerId,
			fromAccount,
			amount: requestAmount,
			fee
		});
	}
});
