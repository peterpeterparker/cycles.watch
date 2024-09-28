<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Principal from '$lib/components/core/Principal.svelte';

	const dispatch = createEventDispatcher();
</script>

<p>
	Add following principal ID to the controllers of the canister with <a
		href="https://internetcomputer.org/docs/current/references/cli-reference/dfx-parent/"
		rel="external noopener norefferer"
		target="_blank"
		aria-label="dfx command line tool">dfx</a
	>
	or
	<a
		href="https://nns.ic0.app/#/canisters"
		rel="external noopener norefferer"
		target="_blank"
		aria-label="Open the Network Nervous System frontend dapp">NNS dapp</a
	>.
</p>

<Principal bold />

<div class="actions">
	<button type="button" on:click|stopPropagation={() => dispatch('papyNext')}> Done </button>
</div>

<style lang="scss">
	@use '../../themes/mixins/canister';

	@include canister.overlay;
</style>
