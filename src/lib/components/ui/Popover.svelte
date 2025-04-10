<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import IconClose from '$lib/components/icons/IconClose.svelte';

	export let anchor: HTMLElement | undefined = undefined;
	export let visible = false;
	export let direction: 'ltr' | 'rtl' = 'ltr';
	export let center = false;
	export let closeButton = false;

	let bottom: number;
	let left: number;

	const initPosition = () =>
		({ bottom, left } = anchor ? anchor.getBoundingClientRect() : { bottom: 0, left: 0 });

	$: anchor, initPosition();

	const close = () => (visible = false);
</script>

<svelte:window on:resize={initPosition} />

{#if visible}
	<div
		role="menu"
		aria-orientation="vertical"
		transition:fade
		class="popover"
		tabindex="-1"
		style="--popover-top: {`${bottom}px`}; --popover-left: {`${left}px`}"
	>
		<button
			class="backdrop"
			aria-label="Close"
			tabindex="-1"
			on:click|stopPropagation={() => (visible = false)}
		></button>
		<div
			transition:scale={{ delay: 25, duration: 150, easing: quintOut }}
			class="wrapper"
			class:center
			class:rtl={direction === 'rtl'}
		>
			{#if closeButton}
				<button on:click|stopPropagation={close} aria-label="Close" class="close icon"
					><IconClose /></button
				>
			{/if}

			<slot />
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../../themes/mixins/overlay';

	.popover {
		@include overlay.popover;
	}
</style>
