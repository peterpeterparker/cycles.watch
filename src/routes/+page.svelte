<script lang="ts">
	import Canisters from '$lib/components/canisters/Canisters.svelte';
	import Toolbar from '$lib/components/core/Toolbar.svelte';
	import Welcome from '$lib/components/core/Welcome.svelte';
	import { canistersEmpty } from '$lib/stores/canisters.store';
	import Footer from '$lib/components/core/Footer.svelte';
	import { authSignedInStore } from '$lib/stores/auth.store';
</script>

<Toolbar />

<main>
	{#if $canistersEmpty && !$authSignedInStore}
		<Welcome />
	{:else}
		<Canisters />
	{/if}

	<Footer />
</main>
