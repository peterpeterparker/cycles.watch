use junobuild_utils::DocDataBigInt;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct RequestData {
    pub status: String,
    pub icp_amount: DocDataBigInt,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RequestStatus {
    Submitted,
    Swapped,
    Failed,
}