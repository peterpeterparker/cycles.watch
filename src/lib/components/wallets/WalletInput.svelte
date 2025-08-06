<script lang="ts">
	import Value from '$lib/components/ui/Value.svelte';
	import { nonNullish } from '@dfinity/utils';
	import { icpXdrConversionRateStore } from '$lib/stores/cmc.store';
	import { formatTCycles, icpToCycles } from '$lib/utils/cycles.utils';

	interface Props {
		userAmount: string;
	}

	let { userAmount = $bindable('') }: Props = $props();

	let convertedCycles: number | undefined = $derived(
		nonNullish($icpXdrConversionRateStore) && !isNaN(Number(userAmount)) && nonNullish(userAmount)
			? icpToCycles({ icp: Number(userAmount), trillionRatio: $icpXdrConversionRateStore })
			: undefined
	);

	let displayTCycles = $derived(
		nonNullish(convertedCycles) ? `${formatTCycles(BigInt(convertedCycles ?? 0))}` : ''
	);
</script>

<div>
	<Value ref="icp-amount">
		{#snippet label()}
			Amount in ICP
		{/snippet}

		<input id="icp-amount" bind:value={userAmount} type="text" placeholder="How many?" />
	</Value>
</div>

<div>
	<Value>
		{#snippet label()}
			Expected Top-up (≈)
		{/snippet}

		{displayTCycles} T Cycles
	</Value>
</div>

<style lang="scss">
	div {
		margin: 1.25rem 0 0;
	}

	input {
		width: 100%;
	}
</style>
