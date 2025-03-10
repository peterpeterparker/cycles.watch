<script lang="ts">
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import WalletConnect from '$lib/components/wallets/WalletConnect.svelte';
	import { onDestroy } from 'svelte';
	import { isNullish } from '$lib/utils/utils';
	import WalletApprove from '$lib/components/wallets/WalletApprove.svelte';
	import {Principal} from "@dfinity/principal";

	interface Props {
		targetCanisterId: Principal;
	}

	let { targetCanisterId }: Props = $props();

	let wallet: IcpWallet | undefined | null = $state(undefined);
	let account: IcrcAccount | undefined | null = $state(undefined);

	const disconnect = () => {
		wallet?.disconnect();
		account = null;
		wallet = null;
	};

	onDestroy(disconnect);
</script>

{#if isNullish(account) || isNullish(wallet)}
	<WalletConnect bind:wallet bind:account />
{:else}
	<WalletApprove {wallet} {account} {targetCanisterId} onsuccess={disconnect} />
{/if}
