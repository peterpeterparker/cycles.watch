<script lang="ts">
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { encodeIcrcAccount, type IcrcAccount as IcrcAccountLib } from '@dfinity/ledger-icrc';
	import { Principal } from '@dfinity/principal';
	import Button from '$lib/components/ui/Button.svelte';
	import IconPublish from '$lib/components/icons/IconPublish.svelte';
	import type { Icrc2ApproveRequest } from '@dfinity/ledger-icp';
	import { SATELLITE_ID } from '$lib/constants/constants';
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
	import { approveAndRequest } from '$lib/services/wallet.services';

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

	// TODO: next week
	// - Implement the request
	// - Initialize the server functions
	// - Do the effective transfer of the amount of icp

	const approve = async () => {
		const { success } = await approveAndRequest({
			balance,
			userAmount,
			account: icrcAccount,
			wallet
		});

		if (!success) {
			return;
		}

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
