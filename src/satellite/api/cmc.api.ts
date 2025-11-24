import type { Principal } from '@icp-sdk/core/principal';
import { type CmcDid, CMCCanister } from '@junobuild/functions/canisters/cmc';

export const cmcNotifyTopUp = async ({
	blockIndex,
	targetCanisterId
}: {
	blockIndex: bigint;
	targetCanisterId: Principal;
}): Promise<CmcDid.NotifyTopUpResult> => {
	const args: CmcDid.NotifyTopUpArg = {
		block_index: blockIndex,
		canister_id: targetCanisterId
	};

	const { notifyTopUp } = new CMCCanister();

	return await notifyTopUp({ args });
};
