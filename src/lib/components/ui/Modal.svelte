<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import { createEventDispatcher } from 'svelte';
	import IconBack from '../icons/IconBack.svelte';

	export let back: boolean = false;

	let visible = true;

	const dispatch = createEventDispatcher();

	const close = () => {
		visible = false;
		dispatch('papyClose');
	};

	const stickyFooter: boolean = $$slots.stickyFooter !== undefined ?? false;
	const footer: boolean = ($$slots.footer ?? false) || stickyFooter;
</script>

{#if visible}
	<div
		class="modal"
		transition:fade
		role="dialog"
		aria-labelledby="modalTitle"
		aria-describedby="modalContent"
		on:introend
	>
		<div class="backdrop" on:click|stopPropagation={close} />
		<div
			transition:scale={{ delay: 25, duration: 150, easing: quintOut }}
			class="wrapper"
			class:flex={!stickyFooter}
		>
			<div class="toolbar" class:back>
				{#if back}
					<button on:click|stopPropagation={() => dispatch('papyBack')} aria-label="Back"
						><IconBack /></button
					>
				{/if}
				<h3 id="modalTitle"><slot name="title" /></h3>
				<button on:click|stopPropagation={close} aria-label="Close" class="close"
					><IconClose /></button
				>
			</div>

			<div class="content" id="modalContent">
				<slot />
			</div>

			{#if footer}
				<footer class:sticky={stickyFooter}>
					<slot name="footer" />
					<slot name="stickyFooter" />
				</footer>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../../themes/mixins/interaction';
	@use '../../themes/mixins/section';
	@use '../../themes/mixins/overlay';
	@use '../../themes/mixins/shadow';

	.modal {
		position: fixed;
		inset: 0;

		z-index: calc(var(--z-index) + 998);
	}

	.backdrop {
		position: absolute;
		inset: 0;

		@include overlay.backdrop('light');

		@include interaction.tappable;
	}

	.wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		@include section.large;
		height: calc(min(100vh, 796px) - 2.75rem);

		@include shadow.strong;

		overflow: hidden;

		@supports (-webkit-touch-callout: none) {
			max-height: -webkit-fill-available;
		}
	}

	.flex {
		display: flex;
		flex-direction: column;
	}

	.toolbar {
		display: grid;
		grid-template-columns: 3.45rem 1fr 3.45rem;
		align-items: center;

		h3 {
			grid-column-start: 2;
			text-align: center;
			margin-bottom: 0;
		}

		button {
			margin: 0.45rem;

			border: none;
			box-shadow: none;

			justify-self: flex-start;

			&.close {
				grid-column-start: 3;
				justify-self: flex-end;
			}
		}
	}

	.content {
		position: relative;

		padding: 0 2.45rem;

		overflow: scroll;
		height: calc(100% - 60px);
		max-height: calc(100% - 60px);

		overflow-x: hidden;

		:global(section) {
			max-width: 100%;
		}
	}

	footer {
		display: flex;
		justify-content: center;

		padding: 0.75rem 2.25rem;

		background: rgba(var(--color-primary-rgb), 0.8);
	}

	.sticky {
		position: absolute;
		inset: auto 0 0;
	}
</style>
