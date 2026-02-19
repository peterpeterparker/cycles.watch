import { createAgent } from '$lib/api/api.agent';
import { CmcCanister } from '@icp-sdk/canisters/cmc';
import { Principal } from '@icp-sdk/core/principal';

const CMC_CANISTER_ID = import.meta.env.VITE_CMC_ID as string;

const NUMBER_XDR_PER_ONE_ICP = 10_000;

export const icpXdrConversionRate = async (): Promise<bigint> => {
	const agent = await createAgent({});

	const { getIcpToCyclesConversionRate } = CmcCanister.create({
		agent,
		canisterId: Principal.fromText(CMC_CANISTER_ID)
	});

	const xdr_permyriad_per_icp = await getIcpToCyclesConversionRate();

	const CYCLES_PER_XDR = BigInt(1_000_000_000_000);

	// trillionRatio
	return (xdr_permyriad_per_icp * CYCLES_PER_XDR) / BigInt(NUMBER_XDR_PER_ONE_ICP);
};
