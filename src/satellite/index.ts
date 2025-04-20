import type { RequestData } from '$lib/types/datastore';
import type { Account } from '@dfinity/ledger-icrc/dist/candid/icrc_ledger';
import { defineHook, type OnSetDoc } from '@junobuild/functions';
import { id } from '@junobuild/functions/ic-cdk';
import { decodeDocData } from '@junobuild/functions/sdk';
import { assertWalletBalance, transferIcpFromWallet } from './services/wallet.services';
import {icrcBalanceOf} from "./api/ledger-icrc.api";
import {saveIcpTransferred} from "./bookkeeping";

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
		// Just a print out to check the balance while developing.
		// ###############

		const balance = await icrcBalanceOf({
			ledgerId,
			account: toAccount
		});

		console.log("This is now the balance of the satellite:", balance);
	}
});
