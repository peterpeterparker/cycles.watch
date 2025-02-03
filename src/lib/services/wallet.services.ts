import { createAgent } from '$lib/api/api.agent';
import { ICP_LEDGER_ID } from '$lib/constants/constants';
import { toasts } from '$lib/stores/toasts.store';
import { AnonymousIdentity } from '@dfinity/agent';
import { type IcrcAccount, IcrcLedgerCanister } from '@dfinity/ledger-icrc';
import { Principal } from '@dfinity/principal';

export const getBalance = async ({
	account
}: {
	account: IcrcAccount;
}): Promise<{ success: boolean; balance?: bigint }> => {
	const agent = await createAgent({ identity: new AnonymousIdentity() });

	try {
		const { balance } = IcrcLedgerCanister.create({
			agent,
			canisterId: Principal.fromText(ICP_LEDGER_ID)
		});

		const result = await balance(account);

		return {
			success: true,
			balance: result
		};
	} catch (err: unknown) {
		toasts.error({
			text: 'Unexpected error while loading the account balance',
			detail: err
		});

		return { success: false };
	}
};
