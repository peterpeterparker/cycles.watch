mod types;
mod ledger;
mod env;

use candid::Principal;
use ic_cdk::{print, trap};
use icrc_ledger_types::icrc1::account::Account;
use junobuild_macros::on_set_doc;
use junobuild_satellite::{include_satellite, OnSetDocContext};
use junobuild_utils::decode_doc_data;
use crate::env::ICP_LEDGER_ID;
use crate::ledger::icrc_balance_of;
use crate::types::RequestData;

#[on_set_doc(collections = ["request"])]
async fn on_set_doc(context: OnSetDocContext) -> Result<(), String> {
    let data: RequestData = decode_doc_data(&context.data.data.after.data)?;

    print(format!("There is a new swap request {:?}", data.icp_amount.value));

    let account: Account = Account::from(context.caller);

    let balance = icrc_balance_of(Principal::from_text(ICP_LEDGER_ID).unwrap(), account)
        .await
        .map_err(|e| trap(&format!("Failed to call ICRC ledger: {:?}", e)))
        .map_err(|e| trap(&format!("Failed to get the balance: {:?}", e)));

    print(format!("Balance of the caller is {:?}", balance));

    // TODO: implement ICP -> cycles swap
    // keep track of the requests
    // update status accordingly

    Ok(())
}

include_satellite!();
