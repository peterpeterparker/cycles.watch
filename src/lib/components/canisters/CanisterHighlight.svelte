<script lang="ts">
	import type { Component } from 'svelte';
	import IconHighlight from '$lib/components/icons/IconHighlight.svelte';
	import IconFlashlightOff from '$lib/components/icons/IconFlashlightOff.svelte';
	import type { CanisterGroup } from '$lib/types/canister';
	import { highlightStore } from '$lib/stores/highlight.store';
	import { canistersUniqueGroups } from '$lib/stores/canisters.store';
	import type { Canister } from '$lib/types/canister';

	export let canister: Canister;

	let group: CanisterGroup | undefined;
	$: ({ group } = canister);

	let icon: Component;
	$: icon = $highlightStore !== undefined ? IconFlashlightOff : IconHighlight;

	const highlight = () => highlightStore.set($highlightStore !== undefined ? undefined : group);
</script>

{#if $canistersUniqueGroups.length > 1}
	<button
		on:click|stopPropagation={highlight}
		aria-label={$highlightStore !== undefined ? 'Show all canister' : 'Highlight'}
		class="toolbar small"
	>
		<svelte:component this={icon} size="small" />
	</button>
{/if}
