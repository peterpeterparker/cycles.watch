import { createAgent } from '$lib/api/api.agent';
import { ICManagementCanister } from '@icp-sdk/canisters/ic-management';
import type { Identity } from '@icp-sdk/core/agent';
import { Principal } from '@icp-sdk/core/principal';
import type { CanisterInfo } from '../types/services';
import { toStatus } from '../utils/canister.utils';

export const canisterStatus = async ({
	canisterId,
	identity
}: {
	canisterId: string;
	identity: Identity;
}): Promise<CanisterInfo> => {
	const agent = await createAgent({
		identity
	});

	const { canisterStatus } = ICManagementCanister.create({
		agent
	});

	const { cycles, status, memory_size, memory_metrics } = await canisterStatus({
		canisterId: Principal.fromText(canisterId)
	});

	return { cycles, status: toStatus(status), memory_size, memory_metrics, canisterId };
};
