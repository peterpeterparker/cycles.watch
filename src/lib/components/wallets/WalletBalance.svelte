<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { IcrcAccount } from '@dfinity/ledger-icrc';
	import { onMount } from 'svelte';
	import { getBalance } from '$lib/services/wallet.services';
	import { nonNullish } from '@dfinity/utils';
	import Value from '$lib/components/ui/Value.svelte';
	import { formatICP } from '$lib/utils/icp.utils';

	interface Props {
		account: IcrcAccount;
		balance: bigint | undefined
	}

	let { account, balance = $bindable(undefined) }: Props = $props();

	onMount(async () => {
		const { balance: result } = await getBalance({ account });
		balance = result;
	});
</script>

{#if nonNullish(balance)}
	<div in:fade>
		<Value>
			{#snippet label()}
				Balance
			{/snippet}

			{formatICP(balance)} ICP
		</Value>
	</div>
{/if}
