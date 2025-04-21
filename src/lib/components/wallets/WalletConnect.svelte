<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import IconOisy from '$lib/components/icons/IconOisy.svelte';
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { CONTAINER, OISY_SIGN_URL } from '$lib/constants/constants';
	import { isNullish } from '@dfinity/utils';
	import { toasts } from '$lib/stores/toasts.store';

	interface Props {
		wallet: IcpWallet | undefined | null;
		accounts: IcrcAccount[] | undefined | null;
	}

	let { wallet = $bindable(undefined), accounts = $bindable(undefined) }: Props = $props();

	const iOS = /apple/i.test(navigator?.vendor);
	const installedApp = 'standalone' in window.navigator ? window.navigator.standalone : false;

	// OISY_SIGN_URL = https://oisy.com/sign

	const connectOISY = async () => {
		if (iOS && installedApp) {
			const url = `x-safari-${OISY_SIGN_URL}`;

			await connect({ url, target: '_self' });
			return;
		}

		await connect({ url: OISY_SIGN_URL });
	};

	const connect = async (params: { url: string; target?: string }) => {
		await disconnect();

		wallet = await IcpWallet.connect({
			...params,
			host: CONTAINER,
			onDisconnect
		});

		const { allPermissionsGranted } = await wallet.requestPermissionsNotGranted();

		if (!allPermissionsGranted) {
			toasts.warn('Permissions have not been granted.');
			return;
		}

		accounts = await wallet.accounts();

		if (isNullish(accounts) || accounts.length === 0) {
			toasts.error({ text: 'The wallet did not provide any account.' });
			await disconnect();
		}
	};

	const onDisconnect = () => {
		accounts = null;
		wallet = null;
	};

	const disconnect = async () => {
		await wallet?.disconnect();
	};
</script>

<div>
	<h3>Top-up</h3>
	<p>Connect a Wallet to get started.</p>
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
