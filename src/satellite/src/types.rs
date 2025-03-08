use junobuild_utils::{DocDataBigInt, DocDataPrincipal};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct RequestData {
    pub status: String,
    pub wallet_owner: DocDataPrincipal,
    pub swap: RequestDataSwap,
}

#[derive(Serialize, Deserialize)]
pub struct RequestDataSwap {
    pub amount: DocDataBigInt,
    pub fee: Option<DocDataBigInt>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RequestStatus {
    Submitted,
    Swapped,
    Failed,
}
