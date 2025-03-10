<script lang="ts">
	import Popover from '$lib/components/ui/Popover.svelte';
	import IconPublish from '$lib/components/icons/IconPublish.svelte';
	import type { Canister } from '$lib/types/canister';
	import Wallet from '$lib/components/wallets/Wallet.svelte';
	import {Principal} from "@dfinity/principal";

	interface Props {
		canister: Canister;
	}

	let { canister }: Props = $props();

	let visible = $state(false);

	let targetCanisterId = $derived(Principal.fromText(canister.id))
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
		<Wallet {targetCanisterId} />
	</div>
</Popover>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		padding: 0 1.75rem;

		width: 100%;
	}
</style>
