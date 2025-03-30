<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { IcrcAccount } from '@dfinity/ledger-icrc';
	import { onMount } from 'svelte';
	import { getBalance } from '$lib/services/wallet.services';
	import { nonNullish } from '@dfinity/utils';
	import Value from '$lib/components/ui/Value.svelte';
	import { formatICP } from '$lib/utils/icp.utils';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';

	interface Props {
		account: IcrcAccount;
		balance: bigint | undefined;
	}

	let { account, balance = $bindable(undefined) }: Props = $props();

	onMount(async () => {
		const { balance: result } = await getBalance({ account });
		balance = result;
	});
</script>

<div>
	<Value>
		{#snippet label()}
			Balance
		{/snippet}

		{#if nonNullish(balance)}
			<span in:fade>{formatICP(balance)} ICP</span>
		{:else}
			<span class="loader">&ZeroWidthSpace;<Skeleton elementTag="span" /></span>
		{/if}
	</Value>
</div>

<style lang="scss">
	.loader {
		display: flex;
	}
</style>
