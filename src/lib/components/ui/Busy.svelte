<script lang="ts">
	import { fade } from 'svelte/transition';
	import { busy } from '$lib/stores/busy.store';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { nonNullish } from '$lib/utils/utils';
</script>

{#if nonNullish($busy)}
	<div transition:fade>
		<div class="content">
			{#if $busy.spinner}
				<div class="spinner">
					<Spinner />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../../themes/mixins/interaction';
	@use '../../themes/mixins/overlay';

	@mixin inset {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	div {
		z-index: calc(var(--z-index) + 1000);

		position: fixed;
		@include inset;

		@include overlay.backdrop(dark, $blur: false);
	}

	.backdrop {
		position: absolute;
		@include inset;

		background: transparent;

		@include interaction.tappable;
	}

	.content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		width: fit-content;

		background: transparent;
	}

	.spinner {
		position: relative;
		height: 30px;
		margin: 1.45rem;

		--spinner-color: white;
	}

	.close {
		align-self: flex-end;
	}

	.text {
		color: var(--color-card);
	}
</style>
