<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import IconOisy from '$lib/components/icons/IconOisy.svelte';
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { CONTAINER } from '$lib/constants/constants';

	interface Props {
		wallet: IcpWallet | undefined | null;
		account: IcrcAccount | undefined | null;
	}

	let { wallet = $bindable(undefined), account = $bindable(undefined) }: Props = $props();

	const connectOISY = async () => {
		wallet = await IcpWallet.connect({
			url: 'http://localhost:5175/sign/',
			host: CONTAINER
		});

		const { allPermissionsGranted } = await wallet.requestPermissionsNotGranted();

		if (!allPermissionsGranted) {
			// TODO: Inform the user that all permissions are required to continue
			return;
		}

		const accounts = await wallet.accounts();

		account = accounts?.[0];
	};
</script>

<div>
	<span>Connect a Wallet</span>
	<Button display="inline" text="OISY" icon={IconOisy} on:click={connectOISY} />
</div>

<style lang="scss">
	span {
		font-weight: bold;
		margin: 0;
	}

	div {
		--button-width: 100%;
	}
</style>
