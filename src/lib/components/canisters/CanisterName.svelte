<script lang="ts">
	import Copy from '$lib/components/ui/Copy.svelte';

	export let canisterId: string;
</script>

<p class="name"><slot name="name" /></p>

<p>
	<span>{canisterId}</span>
	<Copy value={canisterId} ariaLabel="Copy canister ID to clipboard" />
</p>

<hr />

<style lang="scss">
	@use '../../themes/mixins/text';

	p {
		font-size: var(--font-size-very-small);
		margin: 0;
	}

	.name {
		min-height: 1.2rem;
		margin-bottom: 0.15rem;
	}

	.name {
		margin-top: 0.15rem;
		@include text.truncate;
	}

	hr {
		width: 100%;
		border: 1px solid var(--color-primary);
		margin-bottom: 1.5rem;
	}
</style>
