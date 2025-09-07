<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { isWebAuthnAvailable } from '@junobuild/core';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let withPasskey = $state(true);

	onMount(() => {
		isWebAuthnAvailable().then((supported) => (withPasskey = supported));
	});
</script>

{#if withPasskey}
	{@render children()}
{/if}
