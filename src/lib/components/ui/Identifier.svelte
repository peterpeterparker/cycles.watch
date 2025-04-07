<script lang="ts">
	import Copy from '$lib/components/ui/Copy.svelte';
	import { shortenWithMiddleEllipsis } from '$lib/utils/format.utils';

	interface Props {
		identifier: string;
		ariaLabel: string;
		shorten?: boolean;
	}

	let { identifier, ariaLabel, shorten = true }: Props = $props();

	let shortIdentifier: string = $derived(
		shorten ? shortenWithMiddleEllipsis(identifier) : identifier
	);
</script>

<p>
	<span>{shortIdentifier}</span>
	<Copy value={identifier} {ariaLabel} />
</p>

<style lang="scss">
	p {
		--button-copy-width: fit-content;
	}
</style>
