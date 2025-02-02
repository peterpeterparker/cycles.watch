<script lang="ts">
	import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { encodeIcrcAccount } from '@dfinity/ledger-icrc';
	import { Principal } from '@dfinity/principal';
	import Button from '$lib/components/ui/Button.svelte';
	import IconPublish from '$lib/components/icons/IconPublish.svelte';
	import type { Icrc2ApproveRequest } from '@dfinity/ledger-icp';
	import { SATELLITE_ID } from '$lib/constants/constants';

	interface Props {
		wallet: IcpWallet;
		account: IcrcAccount;
	}

	let { wallet, account }: Props = $props();

	let accountAsText = $derived(
		encodeIcrcAccount({
			owner: Principal.fromText(account.owner)
			// TODO: expose base64ToUint8Array in signer library
			// subaccount: nonNullish(account.subaccount)
			// 				? base64ToUint8Array(account.subaccount)
			// 		: undefined
		})
	);

	const approve = async () => {
		const E8S_PER_ICP = 100_000_000n;

		const request: Icrc2ApproveRequest = {
			spender: {
				owner: Principal.fromText(SATELLITE_ID),
				subaccount: []
			},
			amount: 1n * (E8S_PER_ICP / 2n)
			// TODO: expires_at: now + 5min
		};

        // TODO for next week:
        // - Display balance
        // - ICP / Cycles
        // - Input field
        // - Expires at
        // - Decode subaccount

		await wallet.icrc2Approve({
			owner: account.owner,
			request
		});

        console.log("Approve ✅");
	};
</script>

<span>Account</span>
<p>{accountAsText}</p>

<Button display="inline" text="Ask approval" icon={IconPublish} on:click={approve} />

<style lang="scss">
	span {
		font-weight: bold;
		margin: 0;
	}
</style>
