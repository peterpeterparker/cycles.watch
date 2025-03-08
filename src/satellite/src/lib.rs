mod assert;
mod env;
mod ledger;
mod types;
mod utils;

use crate::assert::assert_wallet_balance;
use crate::ledger::{icrc_balance_of, icrc_transfer_from};
use crate::types::RequestData;
use crate::utils::icp_ledger_id;
use candid::Nat;
use ic_cdk::{id, print, trap};
use icrc_ledger_types::icrc1::account::Account;
use junobuild_macros::on_set_doc;
use junobuild_satellite::{include_satellite, OnSetDocContext};
use junobuild_utils::decode_doc_data;

#[on_set_doc(collections = ["request"])]
async fn on_set_doc(context: OnSetDocContext) -> Result<(), String> {
    // ###############
    // Init data
    // ###############
    let data: RequestData = decode_doc_data(&context.data.data.after.data)?;

    let from_account: Account = Account::from(data.wallet_owner.value);

    let request_amount = data.swap.amount.value;
    let fee = data.swap.fee.map(|fee| fee.value);

    let ledger_id = icp_ledger_id()?;

    // ###############
    // Check current account balance. This way the process can stop early on
    // ###############

    assert_wallet_balance(&ledger_id, &from_account, &request_amount, &fee).await?;

    // ###############
    // Transfer from wallet to satellite.
    // ###############

    let to_account: Account = Account::from(id());

    let result = icrc_transfer_from(
        &ledger_id,
        &from_account,
        &to_account,
        &Nat::from(request_amount),
        &fee.map(|fee| Nat::from(fee)),
    )
    .await
    .map_err(|e| {
        trap(&format!(
            "Failed to call ICRC ledger icrc_transfer_from: {:?}",
            e
        ))
    })
    .map_err(|e| trap(&format!("Failed to execute the transfer from: {:?}", e)));

    print(format!("Result of the transfer from is {:?}", result));

    let satellite_balance = icrc_balance_of(&ledger_id, &to_account).await?;

    print(format!(
        "This is now the balance of the satellite {:?}",
        satellite_balance
    ));

    // TODO: next week - to be shown
    // 1. Show clean-up
    // 2. Show amount and fee
    // 3. Saturation add

    // TODO: next week implement
    // 1. Update some sort of status booking to keep track of the request and transfer
    // 2. Effectively gonna implement ICP -> cycles
    // 3. Update some sort of status (if it succeed or if error)
    // 4. onDisconnect on frontend

    Ok(())
}

include_satellite!();
