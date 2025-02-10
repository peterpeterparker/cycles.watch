<script lang="ts">
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { encodeIcrcAccount, type IcrcAccount as IcrcAccountLib } from '@dfinity/ledger-icrc';
	import { Principal } from '@dfinity/principal';
	import Button from '$lib/components/ui/Button.svelte';
	import IconPublish from '$lib/components/icons/IconPublish.svelte';
	import type { Icrc2ApproveRequest } from '@dfinity/ledger-icp';
	import { E8S_PER_ICP, SATELLITE_ID } from '$lib/constants/constants';
	import {
		base64ToUint8Array,
		isNullish,
		nonNullish,
		nowInBigIntNanoSeconds
	} from '@dfinity/utils';
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

	// TODO: extract approve function to wallet.services
	// TODO: create a swap.services in which I'll implement a function to do both approve and request

	// TODO: next week
	// - Implement the request
	// - Initialize the server functions
	// - Do the effective transfer of the amount of icp

	const approve = async () => {
		// TODO: should we double the fee? one fee for the approval and one for the effective transfer in the backend?
		const { valid, tokenAmount } = assertAndConvertAmountToICPToken({
			amount: userAmount,
			balance
		});

		if (!valid || isNullish(tokenAmount)) {
			return;
		}

		const FIVE_MINUTES = 5n * 60n * 1000n * 1000n * 1000n;

		const request: Icrc2ApproveRequest = {
			spender: {
				owner: Principal.fromText(SATELLITE_ID),
				subaccount: []
			},
			amount: tokenAmount.toE8s(),
			expires_at: nowInBigIntNanoSeconds() + FIVE_MINUTES
		};

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
