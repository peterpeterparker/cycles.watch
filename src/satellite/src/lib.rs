use ic_cdk::print;
use junobuild_macros::on_set_doc;
use junobuild_satellite::{include_satellite, OnSetDocContext};

#[on_set_doc(collections = ["request"])]
async fn on_set_doc(_context: OnSetDocContext) -> Result<(), String> {

    print("There is a new request");

    // TODO: implement ICP -> cycles swap
    // keep track of the requests
    // update status accordingly

    Ok(())
}

include_satellite!();
