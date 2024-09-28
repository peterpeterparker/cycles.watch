<script lang="ts">
	import { authStore } from '$lib/stores/auth.store';
	import Copy from '$lib/components/ui/Copy.svelte';

	export let bold = false;

	let principalId = '';
	$: principalId = $authStore.user?.key ?? '';
</script>

<p>
	<span aria-label="Your principal ID" class:bold>{principalId}</span>
	<Copy value={principalId} ariaLabel="Copy principal ID to clipboard" />
</p>

<style lang="scss">
	.bold {
		font-weight: bold;
	}
</style>
