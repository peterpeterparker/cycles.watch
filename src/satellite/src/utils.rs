use crate::env::{CMC, ICP_LEDGER_ID};
use candid::Principal;
use ic_ledger_types::Subaccount;

pub fn icp_ledger_id() -> Result<Principal, String> {
    Principal::from_text(ICP_LEDGER_ID)
        .map_err(|_| "Cannot convert ICP ledger to Principal".to_string())
}

pub fn cmc_id() -> Result<Principal, String> {
    Principal::from_text(CMC).map_err(|_| "Cannot convert CMC ID to Principal".to_string())
}

pub fn convert_principal_to_sub_account(principal_id: &[u8]) -> Subaccount {
    let mut bytes = [0u8; 32];
    bytes[0] = principal_id.len().try_into().unwrap();
    bytes[1..1 + principal_id.len()].copy_from_slice(principal_id);
    Subaccount(bytes)
}
