<script lang="ts">
	import NoCanister from '../canisters/NoCanister.svelte';
	import IconClose from '../icons/IconClose.svelte';
	import AddCanister from '../canisters/AddCanister.svelte';
	import { canistersUniqueGroups, canistersStore } from '../../stores/canisters.store';
	import type { Canister } from '../../types/canister';
	import { removeCanister } from '../../services/watch.services';
	import Spinner from '../ui/Spinner.svelte';
	import Options from './Options.svelte';

	const remove = (canister: Canister) => removeCanister(canister);
</script>

{#if !$canistersStore.initialized}
	<Spinner />
{:else if $canistersStore.canisters.length === 0}
	<section>
		<h2>Canisters</h2>

		<NoCanister />

		<Options />
	</section>
{:else}
	<section>
		<h2>Canisters</h2>

		<p>The list of canisters to be observed.</p>

		{#each $canistersUniqueGroups as canister (canister.id)}
			<div class="canister">
				<button
					type="button"
					class="icon"
					aria-label="Remove canister"
					on:click={() => remove(canister)}
				>
					<IconClose />
				</button>
				{canister.id}{canister.group?.type === 'sns' ? ' (sns)' : ''}
			</div>
		{/each}

		<AddCanister display="inline" />
	</section>

	<Options />
{/if}

<style lang="scss">
	.canister {
		display: flex;
		align-items: center;

		button {
			margin-right: 0.45rem;
		}
	}

	h2 {
		margin-top: 2.75rem;
	}

	p {
		margin-bottom: 0.75rem;
	}
</style>
