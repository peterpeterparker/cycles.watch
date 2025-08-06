<script lang="ts">
	import type { Canister } from '$lib/types/canister';
	import { formatTCycles } from '$lib/utils/cycles.utils';
	import { formatNumber } from '$lib/utils/number.utils';
	import CanisterSkeleton from './CanisterSkeleton.svelte';
	import CanisterInfo from './CanisterInfo.svelte';
	import { highlightStore } from '$lib/stores/highlight.store';
	import { fade } from 'svelte/transition';
	import CanisterToolbar from '$lib/components/canisters/CanisterToolbar.svelte';

	interface Props {
		canister: Canister;
	}

	let { canister }: Props = $props();

	let { id, data, status: syncStatus, group, meta } = $derived(canister);

	let name = $derived(meta?.name);

	let { type, id: groupId } = $derived(group ?? { id: '', type: 'nns' });
	let description = $derived(group?.description);

	let {
		status,
		memory_size,
		cycles,
		icp: _,
		cyclesStatus
	} = $derived(
		data ?? {
			status: undefined,
			cyclesStatus: undefined,
			memory_size: BigInt(0),
			cycles: BigInt(0),
			icp: 0
		}
	);

	let emoji = $derived(cyclesStatus === 'warn' ? ' ⚠️' : cyclesStatus === 'error' ? ' 🔥' : '');

	let hidden = $derived($highlightStore !== undefined && $highlightStore.id !== groupId);
</script>

<div>
	<article
		class:warn={cyclesStatus === 'warn'}
		class:error={cyclesStatus === 'error'}
		class:hidden
		transition:fade
	>
		{#if syncStatus === 'synced'}
			<CanisterInfo canisterId={id}>
				<svelte:fragment slot="title">{formatTCycles(cycles)} TCycles{emoji}</svelte:fragment>
				<svelte:fragment slot="status">{status ?? ''}</svelte:fragment>
				<svelte:fragment slot="memory"
					>{formatNumber(Number(memory_size) / 1000000)}mb</svelte:fragment
				>

				<svelte:fragment slot="type">
					{#if type !== 'nns'}
						{description} ({type})
					{/if}
				</svelte:fragment>

				<svelte:fragment slot="name">
					{#if name !== undefined}
						{name}
					{/if}
				</svelte:fragment>
			</CanisterInfo>
		{:else if syncStatus === 'error'}
			<CanisterInfo canisterId={id}>
				<svelte:fragment slot="title">Sync error❗️</svelte:fragment>
			</CanisterInfo>
		{:else if syncStatus === 'auth'}
			<CanisterInfo canisterId={id}>
				<svelte:fragment slot="title">Sign-in required 🔐️</svelte:fragment>
			</CanisterInfo>
		{:else}
			<CanisterSkeleton canisterId={id}>
				<svelte:fragment slot="name">
					{#if name !== undefined}
						{name}
					{/if}
				</svelte:fragment>
			</CanisterSkeleton>
		{/if}
	</article>

	{#if syncStatus !== 'syncing'}
		<CanisterToolbar {canister} {hidden} />
	{/if}
</div>

<style lang="scss">
	@use '../../themes/mixins/card';
	@use '../../themes/mixins/text';

	article {
		@include card.card(false);

		position: relative;

		padding: 1.25rem 1.75rem;

		:global(p.animated:nth-of-type(2)),
		:global(p.animated:nth-of-type(4)) {
			margin-top: 0.75rem;
		}

		opacity: 1;
		transition: opacity 0.25s ease-in-out;
	}

	.warn {
		border: 4px solid var(--color-warning-tint);
	}

	.error {
		border: 4px solid var(--color-error-tint);
	}

	.hidden {
		opacity: 0;
	}
</style>
