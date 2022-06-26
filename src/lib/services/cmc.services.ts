import type {_SERVICE as CMCActor} from '../canisters/cmc/cmc.did';
import {idlFactory} from '../canisters/cmc/cmc.utils.did';
import {createActor} from '../utils/actor.utils';

const CMC_CANISTER_ID = import.meta.env.VITE_IC_CMC_CANISTER_ID as string;

const createCMCActor = (): Promise<CMCActor> =>
  createActor<CMCActor>({
    config: {
      canisterId: CMC_CANISTER_ID
    },
    idlFactory
  });

const NUMBER_XDR_PER_ONE_ICP = 10_000;

export const icpXdrConversionRate = async (): Promise<bigint> => {
  const actor: CMCActor = await createCMCActor();

  const {data} = await actor.get_icp_xdr_conversion_rate();
  const {xdr_permyriad_per_icp} = data;

  const CYCLES_PER_XDR = BigInt(1_000_000_000_000);

  // trillionRatio
  return (xdr_permyriad_per_icp * CYCLES_PER_XDR) / BigInt(NUMBER_XDR_PER_ONE_ICP);
};
