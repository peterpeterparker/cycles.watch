<script lang="ts">
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="progress">
	<div class="spinner">
		<Spinner />
	</div>

	<span>{@render children()}</span>
</div>

<style lang="scss">
	.progress {
		display: flex;
		flex-direction: column;
	}

	.spinner {
		position: relative;

		min-height: 3.45rem;
	}

	span {
		text-align: center;
	}
</style>
