<script lang="ts">
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { encodeIcrcAccount, type IcrcAccount as IcrcAccountLib } from '@dfinity/ledger-icrc';
	import { Principal } from '@dfinity/principal';
	import Button from '$lib/components/ui/Button.svelte';
	import { base64ToUint8Array, isNullish, nonNullish } from '@dfinity/utils';
	import Identifier from '$lib/components/ui/Identifier.svelte';
	import WalletBalance from '$lib/components/wallets/WalletBalance.svelte';
	import WalletInput from '$lib/components/wallets/WalletInput.svelte';
	import { approveAndRequest } from '$lib/services/wallet.services';
	import { toasts } from '$lib/stores/toasts.store';
	import WalletAccounts from '$lib/components/wallets/WalletAccounts.svelte';

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

		const { success } = await approveAndRequest({
			balance,
			userAmount,
			account: selectedAccount,
			wallet,
			targetCanisterId
		});

		if (!success) {
			return;
		}

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
