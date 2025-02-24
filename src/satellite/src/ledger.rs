use candid::{Nat, Principal};
use ic_cdk::api::call::CallResult;
use ic_cdk::call;
use icrc_ledger_types::icrc1::account::Account;

pub async fn icrc_balance_of(
    ledger_id: Principal,
    account: Account
) -> CallResult<Nat> {
    let (result,): (Nat,) = call(ledger_id, "icrc1_balance_of", (account,)).await?;
    Ok(result)
}