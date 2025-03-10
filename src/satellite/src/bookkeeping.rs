use ic_cdk::id;
use junobuild_satellite::{set_doc_store, SetDoc};
use junobuild_utils::encode_doc_data;
use crate::types::BookKeepingData;
use crate::types::BookKeepingStatus::TransferFromDone;

pub fn save_icp_transferred(key: String) -> Result<(), String> {
    let book_data: BookKeepingData = BookKeepingData {
        status: TransferFromDone
    };

    let data = encode_doc_data(&book_data)?;

    let doc: SetDoc = SetDoc {
        data,
        description: None,
        version: None
    };

    let _ = set_doc_store(id(), "bookkeeping".to_string(), key, doc)?;

    Ok(())
}