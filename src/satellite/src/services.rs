use crate::ledger_icp::icp_transfer;
use crate::ledger_icrc::{icrc_balance_of, icrc_transfer_from};
use crate::utils::{cmc_id, convert_principal_to_sub_account};
use candid::{CandidType, Nat, Principal};
use ic_cdk::api::call::CallResult;
use ic_cdk::{call, print};
use ic_ledger_types::{BlockIndex, Memo, Subaccount, Tokens};
use icrc_ledger_types::icrc1::account::Account;
use serde::Deserialize;

pub async fn assert_wallet_balance(
    ledger_id: &Principal,
    from_account: &Account,
    amount: &u64,
    fee: &Option<u64>,
) -> Result<(), String> {
    let balance = icrc_balance_of(&ledger_id, &from_account).await?;

    let total = amount.saturating_add(fee.unwrap_or(10_000u64));

    if balance < total {
        return Err(format!("Balance {} is smaller than {}", balance, total));
    }

    Ok(())
}

pub async fn transfer_icp_from_wallet(
    ledger_id: &Principal,
    from_account: &Account,
    to_account: &Account,
    amount: &u64,
    fee: &Option<u64>,
) -> Result<(), String> {
    let result = icrc_transfer_from(
        &ledger_id,
        &from_account,
        &to_account,
        &Nat::from(amount.clone()),
        &fee.map(|fee| Nat::from(fee)),
    )
    .await
    .map_err(|e| format!("Failed to call ICRC ledger icrc_transfer_from: {:?}", e))
    .and_then(|result| {
        result.map_err(|e| format!("Failed to execute the transfer from: {:?}", e))
    })?;

    print(format!("Result of the transfer from is {:?}", result));

    Ok(())
}

pub async fn transfer_icp_to_cmc(
    ledger_id: &Principal,
    target_canister_id: &Principal,
    amount: &u64,
) -> Result<BlockIndex, String> {
    // TODO: create a constant for the fee -
    let send_amount = amount - 10_000u64;

    let cmc = cmc_id()?;

    let to_sub_account: Subaccount =
        convert_principal_to_sub_account(target_canister_id.as_slice());

    const MEMO_CANISTER_TOP_UP: Memo = Memo(0x50555054); // == 'TPUP'

    // TODO: pass &fee.map(|fee| Nat::from(fee)),
    const IC_TRANSACTION_FEE_ICP: Tokens = Tokens::from_e8s(10_000);

    let send_amount_tokens = Tokens::from_e8s(send_amount);

    let result = icp_transfer(
        ledger_id,
        &cmc,
        &to_sub_account,
        MEMO_CANISTER_TOP_UP,
        send_amount_tokens,
        IC_TRANSACTION_FEE_ICP,
    )
    .await
    .map_err(|e| format!("Failed to call ICP ledger transfer: {:?}", e))
    .and_then(|result| result.map_err(|e| format!("Failed to execute the transfer: {:?}", e)))?;

    print(format!("The block index of the transfer is {:?}", result));

    Ok(result)
}

#[derive(CandidType, Deserialize)]
pub struct TopUpCanisterArgs {
    pub block_index: BlockIndex,
    pub canister_id: Principal,
}

pub type Cycles = u128;

#[derive(CandidType, Deserialize)]
pub enum NotifyError {
    Refunded {
        reason: String,
        block_index: Option<BlockIndex>,
    },
    InvalidTransaction(String),
    TransactionTooOld(BlockIndex),
    Processing,
    Other {
        error_code: u64,
        error_message: String,
    },
}

impl std::fmt::Display for NotifyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Refunded {
                reason,
                block_index,
            } => write!(f, "Refunded {}: {:?}", reason, block_index),
            Self::InvalidTransaction(msg) => write!(f, "InvalidTransaction {}", msg),
            Self::TransactionTooOld(block_index) => write!(f, "TransactionTooOld {}", block_index),
            Self::Processing => write!(f, "Processing"),
            Self::Other {
                error_code,
                error_message,
            } => write!(f, "Other {}: {}", error_code, error_message),
        }
    }
}

pub async fn notify_top_up_to_cmc(
    target_canister_id: &Principal,
    block_index: &BlockIndex,
) -> Result<(), String> {
    let args = TopUpCanisterArgs {
        block_index: block_index.clone(),
        canister_id: *target_canister_id,
    };

    print(format!(
        "My args: {} {}",
        args.block_index,
        args.canister_id.to_text()
    ));

    let cmc = cmc_id()?;

    let result: CallResult<(Result<Cycles, NotifyError>,)> =
        call(cmc, "notify_top_up", (args,)).await;

    match result {
        Err((_, message)) => {
            ic_cdk::print(format!("FAILED TO TOPUP {}", message));

            // TODO:
            // If the topup fails in the Cmc canister, it refunds the caller.
            // let was_refunded = matches!(error, NotifyError::Refunded { .. });
            Err(["Top-up failed.", &message].join(" - "))
        }
        Ok((result_cycles,)) => {
            match result_cycles {
                Err(notify_error) => {
                    ic_cdk::print(format!("FAILED TO NOTIFY {}", notify_error.to_string()));
                }
                Ok(cycles) => {
                    ic_cdk::print(format!("Cycles {:?}", cycles));
                }
            }

            Ok(())
        }
    }
}
