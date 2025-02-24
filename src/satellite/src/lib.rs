mod types;

use ic_cdk::print;
use junobuild_macros::on_set_doc;
use junobuild_satellite::{include_satellite, OnSetDocContext};
use junobuild_utils::decode_doc_data;
use crate::types::RequestData;

#[on_set_doc(collections = ["request"])]
async fn on_set_doc(context: OnSetDocContext) -> Result<(), String> {
    let data: RequestData = decode_doc_data(&context.data.data.after.data)?;

    print(format!("There is a new swap request {:?}", data.icp_amount));

    // TODO: implement ICP -> cycles swap
    // keep track of the requests
    // update status accordingly

    Ok(())
}

include_satellite!();
