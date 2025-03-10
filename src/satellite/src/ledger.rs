use candid::{Nat, Principal};
use ic_cdk::api::call::CallResult;
use ic_cdk::call;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::{TransferArg, TransferError};
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};

pub async fn icrc_balance_of(ledger_id: &Principal, account: &Account) -> Result<Nat, String> {
    let (result,): (Nat,) = call(ledger_id.clone(), "icrc1_balance_of", (account,))
        .await
        .map_err(|e| format!("Failed to call ICRC ledger icrc_balance_of: {:?}", e))
        .map_err(|e| format!("Failed to get the balance: {:?}", e))?;

    Ok(result)
}

pub async fn icrc_transfer_from(
    ledger_id: &Principal,
    from_account: &Account,
    to_account: &Account,
    amount: &Nat,
    fee: &Option<Nat>,
) -> CallResult<Result<Nat, TransferFromError>> {
    let args: TransferFromArgs = TransferFromArgs {
        amount: amount.clone(),
        from: from_account.clone(),
        to: to_account.clone(),
        created_at_time: None,
        fee: fee.clone(),
        memo: None,
        spender_subaccount: None,
    };

    let (result,): (Result<Nat, TransferFromError>,) =
        call(ledger_id.clone(), "icrc2_transfer_from", (args,)).await?;
    Ok(result)
}

pub async fn icrc_transfer(
    ledger_id: &Principal,
    to_account: &Account,
    amount: &Nat,
    fee: &Option<Nat>,
) -> CallResult<Result<Nat, TransferError>> {
    let args: TransferArg = TransferArg {
        amount: amount.clone(),
        to: to_account.clone(),
        created_at_time: None,
        fee: fee.clone(),
        memo: None,
        from_subaccount: None,
    };

    let (result,): (Result<Nat, TransferError>,) =
        call(ledger_id.clone(), "icrc1_transfer", (args,)).await?;
    Ok(result)
}
