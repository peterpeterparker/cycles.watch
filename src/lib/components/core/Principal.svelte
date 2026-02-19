<script lang="ts">
	import { authStore } from '$lib/stores/auth.store';
	import Copy from '$lib/components/ui/Copy.svelte';

	interface Props {
		bold?: boolean;
	}

	let { bold = false }: Props = $props();

	let principalId = $derived($authStore.user?.key ?? '');
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
