<script lang="ts">
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { encodeIcrcAccount, type IcrcAccount as IcrcAccountLib } from '@dfinity/ledger-icrc';
	import { Principal } from '@dfinity/principal';
	import Button from '$lib/components/ui/Button.svelte';
	import IconPublish from '$lib/components/icons/IconPublish.svelte';
	import type { Icrc2ApproveRequest } from '@dfinity/ledger-icp';
	import { E8S_PER_ICP, SATELLITE_ID } from '$lib/constants/constants';
	import { base64ToUint8Array, isNullish, nonNullish } from '@dfinity/utils';
	import Identifier from '$lib/components/ui/Identifier.svelte';
	import WalletBalance from '$lib/components/wallets/WalletBalance.svelte';
	import WalletInput from '$lib/components/wallets/WalletInput.svelte';
	import { assertAndConvertAmountToICPToken } from '$lib/utils/token.utils';

	interface Props {
		wallet: IcpWallet;
		account: IcrcAccount;
	}

	let { wallet, account }: Props = $props();

	let icrcAccount = $derived<IcrcAccountLib>({
		owner: Principal.fromText(account.owner),
		subaccount: nonNullish(account.subaccount) ? base64ToUint8Array(account.subaccount) : undefined
	});

	let accountAsText = $derived(encodeIcrcAccount(icrcAccount));

	let userAmount: string = $state('');
	let balance: bigint | undefined = $state(undefined);

	const approve = async () => {
		const { valid, tokenAmount } = assertAndConvertAmountToICPToken({
			amount: userAmount,
			balance
		});

		if (!valid || isNullish(tokenAmount)) {
			return;
		}

		const request: Icrc2ApproveRequest = {
			spender: {
				owner: Principal.fromText(SATELLITE_ID),
				subaccount: []
			},
			amount: 1n * (E8S_PER_ICP / 2n)
			// TODO: expires_at: now + 5min
		};

		// TODO for next week:
		// - Expires at
		// - Implement the API endpoint in our serverless function

		await wallet.icrc2Approve({
			owner: account.owner,
			request
		});

		console.log('Approve ✅');
	};
</script>

<span>Account:</span>
<Identifier identifier={accountAsText} ariaLabel="Copy the account ID to clipboard" />

<WalletBalance account={icrcAccount} bind:balance />

<WalletInput bind:userAmount />

<div role="toolbar">
	<Button display="inline" text="Ask approval" icon={IconPublish} on:click={approve} />
</div>

<style lang="scss">
	span {
		font-weight: bold;
		margin: 0;
	}

	div[role='toolbar'] {
		margin: 0.75rem 0 0;
		--button-width: 100%;
	}
</style>
