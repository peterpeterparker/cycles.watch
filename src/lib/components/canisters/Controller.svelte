<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Principal from '$lib/components/core/Principal.svelte';

	const dispatch = createEventDispatcher();
</script>

<p>Add your signed-in principal ID as a controller of the canister.</p>

<Principal bold />

<div class="actions">
	<button type="button" on:click|stopPropagation={() => dispatch('papyNext')}> Done </button>
</div>

<style lang="scss">
	@use '../../themes/mixins/canister';

	@include canister.overlay;
</style>
