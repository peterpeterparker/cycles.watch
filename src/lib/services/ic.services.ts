import { createAgent } from '$lib/api/api.agent';
import type { Identity } from '@dfinity/agent';
import { ICManagementCanister } from '@dfinity/ic-management';
import { Principal } from '@dfinity/principal';
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

	const { cycles, status, memory_size, memory_metrics } = await canisterStatus(
		Principal.fromText(canisterId)
	);

	return { cycles, status: toStatus(status), memory_size, memory_metrics, canisterId };
};
