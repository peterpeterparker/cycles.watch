use crate::ledger::{icrc_balance_of, icrc_transfer_from};
use candid::{Nat, Principal};
use ic_cdk::print;
use icrc_ledger_types::icrc1::account::Account;

pub async fn assert_wallet_balance(
    ledger_id: &Principal,
    from_account: &Account,
    amount: &u64,
    fee: &Option<u64>,
) -> Result<(), String> {
    let balance = icrc_balance_of(&ledger_id, &from_account).await?;

    let total = amount.saturating_add(fee.unwrap_or(10_000u64));

    if balance < total {
        return Err(format!("Balance {} is smaller than {}", balance, total));
    }

    Ok(())
}

pub async fn transfer_icp(
    ledger_id: &Principal,
    from_account: &Account,
    to_account: &Account,
    amount: &u64,
    fee: &Option<u64>,
) -> Result<(), String> {
    let result = icrc_transfer_from(
        &ledger_id,
        &from_account,
        &to_account,
        &Nat::from(amount.clone()),
        &fee.map(|fee| Nat::from(fee)),
    )
    .await
    .map_err(|e| format!("Failed to call ICRC ledger icrc_transfer_from: {:?}", e))
    .and_then(|result| {
        result.map_err(|e| format!("Failed to execute the transfer from: {:?}", e))
    })?;

    print(format!("Result of the transfer from is {:?}", result));

    Ok(())
}
