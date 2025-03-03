use junobuild_utils::{DocDataBigInt, DocDataPrincipal};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct RequestData {
    pub status: String,
    pub icp_amount: DocDataBigInt,
    pub wallet_owner: DocDataPrincipal,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RequestStatus {
    Submitted,
    Swapped,
    Failed,
}