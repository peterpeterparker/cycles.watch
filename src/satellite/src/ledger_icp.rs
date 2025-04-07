use candid::Principal;
use ic_cdk::api::call::CallResult;
use ic_ledger_types::{
    transfer, AccountIdentifier, Memo, Subaccount, Tokens, TransferArgs, TransferResult,
    DEFAULT_SUBACCOUNT,
};

pub async fn icp_transfer(
    ledger_id: &Principal,
    to: &Principal,
    to_sub_account: &Subaccount,
    memo: Memo,
    amount: Tokens,
    fee: Tokens,
) -> CallResult<TransferResult> {
    let account_identifier: AccountIdentifier = AccountIdentifier::new(to, to_sub_account);

    let args = TransferArgs {
        memo,
        amount,
        fee,
        from_subaccount: Some(DEFAULT_SUBACCOUNT),
        to: account_identifier,
        created_at_time: None,
    };

    transfer(ledger_id.clone(), args).await
}
