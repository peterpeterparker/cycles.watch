mod env;
mod ledger;
mod services;
mod types;
mod utils;

use crate::ledger::icrc_balance_of;
use crate::services::{assert_wallet_balance, transfer_icp};
use crate::types::RequestData;
use crate::utils::icp_ledger_id;
use ic_cdk::{id, print};
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

    transfer_icp(
        &ledger_id,
        &from_account,
        &to_account,
        &request_amount,
        &fee,
    )
    .await?;

    // ###############
    // Just a print out to check the balance while developing.
    // ###############

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
