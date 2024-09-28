<script lang="ts">
	import CanisterEdit from '$lib/components/canisters/CanisterEdit.svelte';
	import CanisterHighlight from '$lib/components/canisters/CanisterHighlight.svelte';
	import type { Canister } from '$lib/types/canister';

	export let canister: Canister;
	export let hidden: boolean;
</script>

{#if !hidden}
	<div class="toolbar">
		{#if canister.group?.type !== 'sns' || canister.group?.description === 'root'}
			<CanisterEdit {canister} />
		{/if}

		<CanisterHighlight {canister} />
	</div>
{/if}

<style lang="scss">
	.toolbar {
		display: flex;
		justify-content: flex-start;
		margin: 0.25rem 0.5rem 0;
	}
</style>
