use crate::ledger::{icrc_balance_of, icrc_transfer, icrc_transfer_from};
use candid::{Nat, Principal};
use ic_cdk::print;
use icrc_ledger_types::icrc1::account::Account;
use ic_ledger_types::{Subaccount, Tokens};
use crate::env::CMC;
use crate::utils::{cmc_id, convert_principal_to_sub_account};

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

pub async fn transfer_icp_from_wallet(
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

pub async fn transfer_icp_to_cmc(ledger_id: &Principal, target_canister_id: &Principal, amount: &u64) -> Result<Nat, String> {
    // TODO: create a constant for the fee -
    let send_amount = amount - 10_000u64;

    let cmc = cmc_id()?;

    let to_sub_account: Subaccount = convert_principal_to_sub_account(target_canister_id.as_slice());

    let to_account: Account = Account {
        owner: cmc,
        subaccount: Some(to_sub_account.0)
    };

    // result === block_index
    let result = icrc_transfer(
        &ledger_id,
        &to_account,
        &Nat::from(send_amount.clone()),
        &None, // TODO: pass &fee.map(|fee| Nat::from(fee)),
    )
        .await
        .map_err(|e| format!("Failed to call ICRC ledger icrc_transfer: {:?}", e))
        .and_then(|result| {
            result.map_err(|e| format!("Failed to execute the transfer: {:?}", e))
        })?;

    print(format!("The block index of the transfer is {:?}", result));

    Ok(result)

}