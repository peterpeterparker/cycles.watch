<script lang="ts">
	import type { Component } from 'svelte';

	export let display: 'inline' | 'card' = 'card';
	export let text: string;

	export let icon: Component;

	export let card = true;
	$: card = display === 'card';
</script>

<div class={card ? 'card' : 'inline'}>
	<button type="button" class={card ? 'toolbar' : 'primary'} title={text} on:click>
		<svelte:component this={icon} slot="icon" />
		<span class={card ? 'visually-hidden' : ''}>{text}</span>
	</button>

	{#if card}
		<span>{text}</span>
	{/if}
</div>

<style lang="scss">
	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		min-height: 8.45rem;
		max-height: 13rem;
	}

	.inline {
		margin-top: 0.45rem;

		button {
			gap: var(--padding);
			text-align: left;
		}
	}

	span {
		font-size: var(--font-size-small);
	}
</style>
