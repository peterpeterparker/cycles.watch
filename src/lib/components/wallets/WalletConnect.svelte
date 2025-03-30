<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import IconOisy from '$lib/components/icons/IconOisy.svelte';
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { CONTAINER, JUNO_SIGN_URL, OISY_SIGN_URL } from '$lib/constants/constants';
	import IconJuno from '$lib/components/icons/IconJuno.svelte';
	import { isNullish } from '@dfinity/utils';
	import { toasts } from '$lib/stores/toasts.store';

	interface Props {
		wallet: IcpWallet | undefined | null;
		account: IcrcAccount | undefined | null;
	}

	let { wallet = $bindable(undefined), account = $bindable(undefined) }: Props = $props();

	const connectOISY = async () => {
		await connect(OISY_SIGN_URL);
	};

	const connectJuno = async () => {
		await connect(JUNO_SIGN_URL);
	};

	const connect = async (url: string) => {
		await disconnect();

		wallet = await IcpWallet.connect({
			url,
			host: CONTAINER,
			onDisconnect
		});

		const { allPermissionsGranted } = await wallet.requestPermissionsNotGranted();

		if (!allPermissionsGranted) {
			toasts.warn('Permissions have not been granted.');
			return;
		}

		const accounts = await wallet.accounts();

		account = accounts?.[0];

		if (isNullish(account)) {
			toasts.error({ text: 'The wallet did not provide any account.' });
			await disconnect();
		}
	};

	const onDisconnect = () => {
		account = null;
		wallet = null;
	};

	const disconnect = async () => {
		await wallet?.disconnect();
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
