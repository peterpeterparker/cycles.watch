<script lang="ts">
	import IconCopy from '../icons/IconCopy.svelte';

	export let value: string;
	export let ariaLabel: string;

	const copyToClipboard = async () => await navigator.clipboard.writeText(value);
</script>

<button on:click|stopPropagation={copyToClipboard} aria-label={ariaLabel} class="icon">
	<IconCopy />
</button>

<style lang="scss">
	button {
		padding: 2px;
		vertical-align: bottom;
		width: var(--button-copy-width);
	}
</style>
