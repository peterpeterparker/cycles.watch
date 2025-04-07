<script lang="ts">
	import type { IcrcAccount } from '@dfinity/oisy-wallet-signer';
	import { base64ToUint8Array, nonNullish } from '@dfinity/utils';
	import Value from '$lib/components/ui/Value.svelte';
	import type { IcrcAccount as IcrcAccountLib } from '@dfinity/ledger-icrc/dist/types/types/ledger.responses';
	import { Principal } from '@dfinity/principal';
	import { encodeIcrcAccount } from '@dfinity/ledger-icrc';
	import { shortenWithMiddleEllipsis } from '$lib/utils/format.utils';

	interface Props {
		accounts: IcrcAccount[];
		selectedAccount: IcrcAccountLib | undefined;
	}

	let { accounts, selectedAccount = $bindable(undefined) }: Props = $props();

	let icrcAccounts = $derived<IcrcAccountLib[]>(
		accounts.map((account) => ({
			owner: Principal.fromText(account.owner),
			subaccount: nonNullish(account.subaccount)
				? base64ToUint8Array(account.subaccount)
				: undefined
		}))
	);
</script>

<div>
	<Value>
		{#snippet label()}
			Account
		{/snippet}

		<select bind:value={selectedAccount}>
			{#each icrcAccounts as account, index (index)}
				<option value={account}> {shortenWithMiddleEllipsis(encodeIcrcAccount(account))} </option>
			{/each}
		</select>
	</Value>
</div>

<style lang="scss">
	div {
		margin: 0 0 1.25rem;
	}

	select {
		width: 100%;
	}
</style>
