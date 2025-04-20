<script lang="ts">
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import WalletConnect from '$lib/components/wallets/WalletConnect.svelte';
	import { onDestroy } from 'svelte';
	import { isNullish } from '$lib/utils/utils';
	import WalletApprove from '$lib/components/wallets/WalletApprove.svelte';
	import { Principal } from '@dfinity/principal';

	interface Props {
		targetCanisterId: Principal;
		onsuccess: () => void;
	}

	let { targetCanisterId, onsuccess }: Props = $props();

	let wallet: IcpWallet | undefined | null = $state(undefined);
	let accounts: IcrcAccount[] | undefined | null = $state(undefined);

	const disconnect = () => {
		wallet?.disconnect();
		accounts = null;
		wallet = null;
	};

	const close = () => {
		disconnect();
		onsuccess();
	};

	onDestroy(disconnect);
</script>

{#if isNullish(accounts) || isNullish(wallet)}
	<WalletConnect bind:wallet bind:accounts />
{:else}
	<WalletApprove {wallet} {accounts} {targetCanisterId} onsuccess={close} />
{/if}
