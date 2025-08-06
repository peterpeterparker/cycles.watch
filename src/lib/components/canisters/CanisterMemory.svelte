<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import type { Canister } from '$lib/types/canister';
	import { formatBytes } from '$lib/utils/number.utils';

	interface Props {
		canister: Canister;
	}

	let { canister }: Props = $props();

	let { data } = $derived(canister);

	let memorySizeInTotal = $derived(data?.memory_size);

	let memoryMetrics = $derived(data?.memory_metrics);

	let wasmMemorySize = $derived(memoryMetrics?.wasm_memory_size);
	let stableMemorySize = $derived(memoryMetrics?.stable_memory_size);
	let globalMemorySize = $derived(memoryMetrics?.global_memory_size);
	let wasmBinarySize = $derived(memoryMetrics?.wasm_binary_size);
	let wasmChunkStoreSize = $derived(memoryMetrics?.wasm_chunk_store_size);
	let customSectionsSize = $derived(memoryMetrics?.custom_sections_size);
	let canisterHistorySize = $derived(memoryMetrics?.canister_history_size);
	let snapshotsSize = $derived(memoryMetrics?.snapshots_size);

	const ONE_MB = 1000 * 1000;
	const ONE_KB = 1000;
</script>

<p class="total">
	{nonNullish(memorySizeInTotal) ? formatBytes(Number(memorySizeInTotal)) : '???'}
	<small>in total</small>
</p>

{#if nonNullish(memoryMetrics)}
	<p>
		{nonNullish(wasmMemorySize) ? formatBytes(Number(wasmMemorySize)) : '???'}
		<small>on heap </small>
	</p>

	<p>
		{nonNullish(stableMemorySize) ? formatBytes(Number(stableMemorySize)) : '???'}
		<small>on stable</small>
	</p>

	{#if (globalMemorySize ?? 0n) > ONE_MB}
		<p>
			{nonNullish(globalMemorySize) ? formatBytes(Number(globalMemorySize)) : '???'}
			<small>in global</small>
		</p>
	{/if}

	{#if (wasmChunkStoreSize ?? 0n) > 0n}
		<p>
			{nonNullish(wasmChunkStoreSize) ? formatBytes(Number(wasmChunkStoreSize)) : '???'}
			<small>in chunks</small>
		</p>
	{/if}

	{#if (snapshotsSize ?? 0n) > 0n}
		<p>
			{nonNullish(snapshotsSize) ? formatBytes(Number(snapshotsSize)) : '???'}
			<small>on snapshot</small>
		</p>
	{/if}

	<p>
		{nonNullish(customSectionsSize) ? formatBytes(Number(customSectionsSize)) : '???'}
		<small>of custom sections</small>
	</p>

	<p>
		{nonNullish(wasmBinarySize) ? formatBytes(Number(wasmBinarySize)) : '???'}
		<small>of code</small>
	</p>

	{#if (canisterHistorySize ?? 0n) > ONE_KB}
		<p>
			{nonNullish(canisterHistorySize) ? formatBytes(Number(canisterHistorySize)) : '???'}
			<small>in history</small>
		</p>
	{/if}
{/if}

<style lang="scss">
	p {
		font-size: var(--font-size-very-small);
		margin: 0;
	}

	.total {
		margin-bottom: 0.75rem;
	}

	small {
		font-size: var(--font-size-very-small);
	}
</style>
