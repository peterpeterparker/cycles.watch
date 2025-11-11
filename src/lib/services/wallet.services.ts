import { createAgent } from '$lib/api/api.agent';
import { IC_TRANSACTION_FEE_ICP, ICP_LEDGER_ID, SATELLITE_ID } from '$lib/constants/constants';
import { toasts } from '$lib/stores/toasts.store';
import type { RequestData } from '$lib/types/datastore';
import { assertAndConvertAmountToICPToken } from '$lib/utils/token.utils';
import { IcpWallet } from '@dfinity/oisy-wallet-signer/icp-wallet';
import { isNullish, nowInBigIntNanoSeconds } from '@dfinity/utils';
import type { Icrc2ApproveRequest } from '@icp-sdk/canisters/ledger/icp';
import { type IcrcAccount, IcrcLedgerCanister } from '@icp-sdk/canisters/ledger/icrc';
import { AnonymousIdentity } from '@icp-sdk/core/agent';
import { Principal } from '@icp-sdk/core/principal';
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
	targetCanisterId: Principal;
}

export const approveAndRequest = async ({
	userAmount,
	balance,
	account,
	targetCanisterId,
	...rest
}: ApproveAndRequestParams): Promise<
	{ success: true; requestKey: string } | { success: false }
> => {
	const transferFee = IC_TRANSACTION_FEE_ICP;

	const { valid, tokenAmount } = assertAndConvertAmountToICPToken({
		amount: userAmount,
		balance,
		fee: transferFee
	});

	if (!valid || isNullish(tokenAmount)) {
		return { success: false };
	}

	// The wallet will pay for the fee of the transfer
	const swapAmount = tokenAmount.toE8s();
	const approveAmount = swapAmount + transferFee;

	try {
		await approve({
			amount: approveAmount,
			account,
			...rest
		});

		const { requestKey } = await requestSwap({ amount: swapAmount, account, targetCanisterId });

		return { success: true, requestKey };
	} catch (err: unknown) {
		toasts.error({
			text: 'Approve and request failed.',
			detail: err
		});

		return { success: false };
	}
};

const requestSwap = async ({
	amount,
	account: { owner: wallet_owner },
	targetCanisterId: target_canister_id
}: {
	amount: bigint;
	account: IcrcAccount;
	targetCanisterId: Principal;
}): Promise<{ requestKey: string }> => {
	const requestKey = crypto.randomUUID();

	const doc: Doc<RequestData> = {
		key: requestKey,
		data: {
			status: 'submitted',
			wallet_owner,
			target_canister_id,
			swap: {
				amount
			}
		}
	};

	await setDoc({
		collection: 'request',
		doc
	});

	return { requestKey };
};

const approve = async ({
	amount,
	wallet,
	account
}: { amount: bigint } & Omit<
	ApproveAndRequestParams,
	'userAmount' | 'balance' | 'targetCanisterId'
>) => {
	const FIVE_MINUTES = 5n * 60n * 1000n * 1000n * 1000n;

	const request: Icrc2ApproveRequest = {
		spender: {
			owner: Principal.fromText(SATELLITE_ID),
			subaccount: []
		},
		amount,
		expires_at: nowInBigIntNanoSeconds() + FIVE_MINUTES
	};

	await wallet.icrc2Approve({
		owner: account.owner.toText(),
		request
	});
};
