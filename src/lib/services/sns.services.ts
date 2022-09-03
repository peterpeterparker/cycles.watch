import type {Principal} from '@dfinity/principal';
import type {
  CanisterStatusResultV2,
  CanisterSummary,
  GetSnsCanistersSummaryResponse,
  _SERVICE as SnsRootActor
} from '../canisters/sns_root/sns_root.did';
import {idlFactory} from '../canisters/sns_root/sns_root.utils.did';
import type {SnsCanisterInfo} from '../types/services';
import {createActor} from '../utils/actor.utils';
import {toStatus} from '../utils/canister.utils';
import {fromNullable} from '../utils/did.utils';

const createSnsRootActor = ({canisterId}: {canisterId: string}): Promise<SnsRootActor> =>
  createActor<SnsRootActor>({
    config: {
      canisterId
    },
    idlFactory
  });

export const snsCanisters = async ({
  rootCanisterId
}: {
  rootCanisterId: string;
}): Promise<SnsCanisterInfo[]> => {
  const {get_sns_canisters_summary}: SnsRootActor = await createSnsRootActor({
    canisterId: rootCanisterId
  });

  const canisters: GetSnsCanistersSummaryResponse = await get_sns_canisters_summary({
    update_canister_list: [false]
  });

  const findCanisterInfo = (
    type: 'root' | 'governance' | 'ledger' | 'swap'
  ): SnsCanisterInfo | undefined => {
    const info: CanisterSummary | undefined = fromNullable(canisters[type]);

    if (!info) {
      return undefined;
    }

    const canisterId: Principal | undefined = fromNullable(info.canister_id);
    const status: CanisterStatusResultV2 | undefined = fromNullable(info.status);

    if (!canisterId || !status) {
      return undefined;
    }

    return {
      canisterId: canisterId.toText(),
      type,
      memory_size: status.memory_size,
      cycles: status.cycles,
      status: toStatus(status.status)
    };
  };

  const rootCanisterInfo: SnsCanisterInfo | undefined = findCanisterInfo('root');
  const governanceCanisterInfo: SnsCanisterInfo | undefined = findCanisterInfo('governance');
  const ledgerCanisterInfo: SnsCanisterInfo | undefined = findCanisterInfo('ledger');

  return [rootCanisterInfo, governanceCanisterInfo, ledgerCanisterInfo].filter(
    (info: SnsCanisterInfo | undefined) => info !== undefined
  ) as SnsCanisterInfo[];
};
