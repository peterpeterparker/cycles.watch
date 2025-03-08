mod env;
mod ledger;
mod types;
mod utils;

use crate::ledger::{icrc_balance_of, icrc_transfer_from};
use crate::types::RequestData;
use crate::utils::icp_ledger_id;
use candid::{Nat};
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

    let ledger_id = icp_ledger_id()?;

    // ###############
    // Check current account balance. This way the process can stop early on
    // ###############

    let balance = icrc_balance_of(&ledger_id, &from_account).await?;

    // TODO: if balance < icp_amount => error

    print(format!("Balance of the caller is {:?}", balance));

    // TODO: `?!?!?!
    let smaller_amount = data.icp_amount.value - 10_000;

    let to_account: Account = Account::from(id());

    let result = icrc_transfer_from(
        &ledger_id,
        &from_account,
        &to_account,
        &Nat::from(smaller_amount),
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

    // TODO: next week
    // 1. Clean include fee in allowed amount
    // 2. Clean up code
    // 3. Update some sort of status booking to keep track of the request and transfer
    // 4. Effectively gonna implement ICP -> cycles
    // 5. Update some sort of status (if it succeed or if error)

    Ok(())
}

include_satellite!();
