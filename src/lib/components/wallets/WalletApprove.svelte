<script lang="ts">
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { type IcrcAccount as IcrcAccountLib } from '@icp-sdk/canisters/ledger/icrc';
	import { Principal } from '@icp-sdk/core/principal';
	import Button from '$lib/components/ui/Button.svelte';
	import { isNullish } from '@dfinity/utils';
	import WalletBalance from '$lib/components/wallets/WalletBalance.svelte';
	import WalletInput from '$lib/components/wallets/WalletInput.svelte';
	import { approveAndRequest } from '$lib/services/wallet.services';
	import { toasts } from '$lib/stores/toasts.store';
	import WalletAccounts from '$lib/components/wallets/WalletAccounts.svelte';
	import { pollSwapResult } from '$lib/services/swap.services';

	interface Props {
		wallet: IcpWallet;
		accounts: IcrcAccount[];
		onsuccess: () => void;
		targetCanisterId: Principal;
	}

	let { wallet, accounts, onsuccess, targetCanisterId }: Props = $props();

	let selectedAccount = $state<IcrcAccountLib | undefined>(undefined);

	let userAmount: string = $state('');
	let balance: bigint | undefined = $state(undefined);

	const approve = async () => {
		if (isNullish(selectedAccount)) {
			toasts.error({
				text: 'An account must be selected.'
			});
			return;
		}

		const result = await approveAndRequest({
			balance,
			userAmount,
			account: selectedAccount,
			wallet,
			targetCanisterId
		});

		if (!result.success) {
			return;
		}

		// We on purpose do not await here
		pollSwapResult({ requestKey: result.requestKey });

		toasts.success('Swapping ICP to cycles submitted...');

		onsuccess();
	};
</script>

<WalletAccounts {accounts} bind:selectedAccount />

<WalletBalance account={selectedAccount} bind:balance />

<WalletInput bind:userAmount />

<div role="toolbar">
	<Button display="inline" text="Submit" on:click={approve} />
</div>

<style lang="scss">
	span {
		font-weight: bold;
		margin: 0;
	}

	div[role='toolbar'] {
		margin: 0.75rem 0;
		--button-width: 100%;
	}
</style>
