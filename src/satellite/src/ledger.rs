use candid::{Nat, Principal};
use ic_cdk::api::call::CallResult;
use ic_cdk::{call};
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};

pub async fn icrc_balance_of(
    ledger_id: Principal,
    account: &Account
) -> CallResult<Nat> {
    let (result,): (Nat,) = call(ledger_id, "icrc1_balance_of", (account,)).await?;
    Ok(result)
}

pub async fn icrc_transfer_from(
    ledger_id: Principal,
    from_account: &Account,
    to_account: &Account,
    icp_amount: &Nat,
) -> CallResult<Result<Nat, TransferFromError>> {
    let args: TransferFromArgs = TransferFromArgs {
        amount: icp_amount.clone(),
        from: from_account.clone(),
        to: to_account.clone(),
        created_at_time: None,
        fee: None,
        memo: None,
        spender_subaccount: None
    };

    let (result,): (Result<Nat, TransferFromError>,) = call(ledger_id, "icrc2_transfer_from", (args,)).await?;
    Ok(result)
}