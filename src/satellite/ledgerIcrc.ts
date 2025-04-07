import { IDL } from '@dfinity/candid';
import type { Account } from '@dfinity/ledger-icrc/dist/candid/icrc_ledger';
import { Principal } from '@dfinity/principal';
import { call } from '@junobuild/functions/ic-cdk';

const SubAccount = IDL.Vec(IDL.Nat8);

const Account = IDL.Record({
	owner: IDL.Principal,
	subaccount: IDL.Opt(SubAccount)
});

const Tokens = IDL.Nat;

export const icrcBalanceOf = ({
	ledgerId,
	account
}: {
	ledgerId: string;
	account: Account;
}): Promise<bigint> =>
	call<bigint>({
		canisterId: Principal.fromText(ledgerId),
		method: 'icrc1_balance_of',
		args: [[Account, account]],
		result: Tokens
	});
