mod types;
mod ledger;
mod env;

use candid::{Nat, Principal};
use ic_cdk::{id, print, trap};
use icrc_ledger_types::icrc1::account::Account;
use junobuild_macros::on_set_doc;
use junobuild_satellite::{include_satellite, OnSetDocContext};
use junobuild_utils::decode_doc_data;
use crate::env::ICP_LEDGER_ID;
use crate::ledger::{icrc_balance_of, icrc_transfer_from};
use crate::types::RequestData;

#[on_set_doc(collections = ["request"])]
async fn on_set_doc(context: OnSetDocContext) -> Result<(), String> {
    let data: RequestData = decode_doc_data(&context.data.data.after.data)?;

    print(format!("There is a new swap request from {} for {:?}", data.wallet_owner.value.to_text(), data.icp_amount.value));

    let from_account: Account = Account::from(data.wallet_owner.value);

    let balance = icrc_balance_of(Principal::from_text(ICP_LEDGER_ID).unwrap(), &from_account)
        .await
        .map_err(|e| trap(&format!("Failed to call ICRC ledger icrc_balance_of: {:?}", e)))
        .map_err(|e| trap(&format!("Failed to get the balance: {:?}", e)));

    // TODO: if balance < icp_amount => error

    print(format!("Balance of the caller is {:?}", balance));

    // TODO: `?!?!?!
    let smaller_amount = data.icp_amount.value - 10_000;

    let to_account: Account = Account::from(id());

    let result = icrc_transfer_from(Principal::from_text(ICP_LEDGER_ID).unwrap(), &from_account, &to_account, &Nat::from(smaller_amount))
        .await
        .map_err(|e| trap(&format!("Failed to call ICRC ledger icrc_transfer_from: {:?}", e)))
        .map_err(|e| trap(&format!("Failed to execute the transfer from: {:?}", e)));

    print(format!("Result of the transfer from is {:?}", result));

    let satellite_balance = icrc_balance_of(Principal::from_text(ICP_LEDGER_ID).unwrap(), &to_account)
        .await
        .map_err(|e| trap(&format!("Failed to call ICRC ledger icrc_balance_of: {:?}", e)))
        .map_err(|e| trap(&format!("Failed to get the balance: {:?}", e)));

    print(format!("This is now the balance of the satellite {:?}", satellite_balance));

    // TODO: implement ICP -> cycles swap
    // keep track of the requests
    // update status accordingly

    Ok(())
}

include_satellite!();
