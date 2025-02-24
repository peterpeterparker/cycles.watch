import { createAgent } from '$lib/api/api.agent';
import { ICP_LEDGER_ID, SATELLITE_ID } from '$lib/constants/constants';
import { toasts } from '$lib/stores/toasts.store';
import type { RequestData } from '$lib/types/datastore';
import { assertAndConvertAmountToICPToken } from '$lib/utils/token.utils';
import { AnonymousIdentity } from '@dfinity/agent';
import type { Icrc2ApproveRequest } from '@dfinity/ledger-icp';
import { type IcrcAccount, IcrcLedgerCanister } from '@dfinity/ledger-icrc';
import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
import { Principal } from '@dfinity/principal';
import { isNullish, nowInBigIntNanoSeconds, TokenAmountV2 } from '@dfinity/utils';
import { type Doc, setDoc } from '@junobuild/core';

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

export interface ApproveAndRequestParams {
	userAmount: string;
	balance: bigint | undefined;
	wallet: IcpWallet;
	account: IcrcAccount;
}

export const approveAndRequest = async ({
	userAmount,
	balance,
	...rest
}: ApproveAndRequestParams): Promise<{ success: boolean }> => {
	// TODO: should we double the fee? one fee for the approval and one for the effective transfer in the backend?
	const { valid, tokenAmount } = assertAndConvertAmountToICPToken({
		amount: userAmount,
		balance
	});

	if (!valid || isNullish(tokenAmount)) {
		return { success: false };
	}

	try {
		await approve({
			tokenAmount,
			...rest
		});

		await requestSwap();

		return { success: true };
	} catch (err: unknown) {
		toasts.error({
			text: 'Approve and request failed.',
			detail: err
		});

		return { success: false };
	}
};

const requestSwap = async () => {
	const doc: Doc<RequestData> = {
		key: crypto.randomUUID(),
		data: {
			status: 'submitted'
		}
	};

	await setDoc({
		collection: 'request',
		doc
	});
};

const approve = async ({
	tokenAmount,
	wallet,
	account
}: { tokenAmount: TokenAmountV2 } & Omit<ApproveAndRequestParams, 'userAmount' | 'balance'>) => {
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
		owner: account.owner.toText(),
		request
	});
};
