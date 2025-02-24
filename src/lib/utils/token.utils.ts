import { IC_TRANSACTION_FEE_ICP } from '$lib/constants/constants';
import { toasts } from '$lib/stores/toasts.store';
import { FromStringToTokenError, ICPToken, isNullish, TokenAmountV2 } from '@dfinity/utils';

const amountToICPToken = (amount: string): TokenAmountV2 | undefined => {
	const token = TokenAmountV2.fromString({ token: ICPToken, amount });

	if (Object.values(FromStringToTokenError).includes(token as string | FromStringToTokenError)) {
		return undefined;
	}

	return <TokenAmountV2>token;
};

export const assertAndConvertAmountToICPToken = ({
	amount,
	balance,
	fee = IC_TRANSACTION_FEE_ICP
}: {
	amount: string | undefined;
	balance: bigint | undefined;
	fee?: bigint;
}): { valid: boolean; tokenAmount?: TokenAmountV2 } => {
	if (isNullish(balance) || balance === 0n) {
		toasts.error({
			text: 'Your balance is undefined or null.'
		});
		return { valid: false };
	}

	if (isNullish(amount)) {
		toasts.error({
			text: 'No amount provided.'
		});
		return { valid: false };
	}

	const tokenAmount = amountToICPToken(amount);

	if (isNullish(tokenAmount)) {
		toasts.error({
			text: 'Cannot convert amount to token.'
		});
		return { valid: false };
	}

	if (tokenAmount.toE8s() === 0n) {
		toasts.error({
			text: 'Amount cannot be zero.'
		});
		return { valid: false };
	}

	if (balance - fee < tokenAmount.toE8s()) {
		toasts.error({
			text: 'Invalid amount. Not enough balance.'
		});
		return { valid: false };
	}

	return { valid: true, tokenAmount };
};
