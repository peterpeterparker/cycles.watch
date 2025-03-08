use crate::ledger::icrc_balance_of;
use candid::Principal;
use icrc_ledger_types::icrc1::account::Account;

pub async fn assert_wallet_balance(
    ledger_id: &Principal,
    from_account: &Account,
    amount: &u64,
    fee: &Option<u64>,
) -> Result<(), String> {
    let balance = icrc_balance_of(&ledger_id, &from_account).await?;

    let total = amount.saturating_add(fee.unwrap_or(0u64));

    if balance < total {
        return Err(format!("Balance {} is smaller than {}", balance, total));
    }

    Ok(())
}
