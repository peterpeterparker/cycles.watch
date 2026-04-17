import type { Principal } from '@icp-sdk/core/principal';
import {
	CMCCanister,
	type NotifyTopUpArgs,
	type NotifyTopUpResult
} from '@junobuild/functions/canisters/cmc';

export const cmcNotifyTopUp = async ({
	blockIndex,
	targetCanisterId
}: {
	blockIndex: bigint;
	targetCanisterId: Principal;
}): Promise<NotifyTopUpResult> => {
	const args: NotifyTopUpArgs = {
		block_index: blockIndex,
		canister_id: targetCanisterId
	};

	const { notifyTopUp } = new CMCCanister();

	return await notifyTopUp({ args });
};
