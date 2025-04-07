import type { Account } from '@dfinity/ledger-icrc/dist/candid/icrc_ledger';
import {icrcBalanceOf} from "./ledgerIcrc";

export const assertWalletBalance = async ({ledgerId, fromAccount}: {
    ledgerId: string,
    fromAccount: Account,
    amount: bigint,
    fee: bigint | undefined,
}) => {
    const balance = await icrcBalanceOf({
        ledgerId,
        account: fromAccount
    });

    console.log('Balance ->', balance);
}