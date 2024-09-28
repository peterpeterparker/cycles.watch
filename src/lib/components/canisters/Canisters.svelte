<script lang="ts">
	import { canistersStore, sortedCanisters } from '$lib/stores/canisters.store';
	import Canister from './Canister.svelte';
	import Spinner from '../ui/Spinner.svelte';
</script>

{#if !$canistersStore.initialized}
	<Spinner />
{:else}
	<section class="grid">
		{#each $sortedCanisters as canister (canister.id)}
			<Canister {canister} />
		{/each}
	</section>
{/if}

<style lang="scss">
	@use '../../themes/mixins/grid';

	.grid {
		@include grid.posts;
	}
</style>
