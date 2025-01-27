<script lang="ts">
	import Popover from '$lib/components/ui/Popover.svelte';
	import IconPublish from '$lib/components/icons/IconPublish.svelte';
	import type { Canister } from '$lib/types/canister';
	import Wallet from "$lib/components/wallets/Wallet.svelte";

	interface Props {
		canister: Canister;
	}

	let { canister: _ }: Props = $props();

	let visible = $state(false);
</script>

<button
	onclick={($event) => {
		$event.stopPropagation();
		visible = true;
	}}
	aria-label="Top-up"
	class="toolbar small"
>
	<IconPublish size="small" />
</button>

<Popover bind:visible center>
	<div class="container">
		<Wallet />
	</div>
</Popover>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		padding: 0 1.75rem;

		width: 100%;

		:global(button) {
			width: 100%;
		}
	}
</style>
