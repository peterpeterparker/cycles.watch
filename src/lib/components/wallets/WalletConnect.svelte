<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import IconOisy from '$lib/components/icons/IconOisy.svelte';
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { CONTAINER } from '$lib/constants/constants';
	import IconJuno from '$lib/components/icons/IconJuno.svelte';

	interface Props {
		wallet: IcpWallet | undefined | null;
		account: IcrcAccount | undefined | null;
	}

	let { wallet = $bindable(undefined), account = $bindable(undefined) }: Props = $props();

	const connectOISY = async () => {
		await connect('http://localhost:5175/sign/');
	};

	const connectJuno = async () => {
		await connect('http://localhost:5173/sign/');
	};

	const connect = async (url: string) => {
		wallet = await IcpWallet.connect({
			url,
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
	<h3>Top-up</h3>
	<p>Connect a Wallet to get started.</p>
	<Button display="inline" text="Juno" icon={IconJuno} on:click={connectJuno} />
	<Button display="inline" text="OISY" icon={IconOisy} on:click={connectOISY} />
</div>

<style lang="scss">
	p {
		max-width: 240px;
	}

	div {
		--button-width: 100%;
		padding: 0 0 1.75rem;
	}
</style>
