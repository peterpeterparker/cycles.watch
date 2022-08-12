import type {Principal} from '@dfinity/principal';
import type {
  CanisterStatusResultV2,
  _SERVICE as SnsRootActor
} from '../canisters/sns_root/sns_root.did';
import {idlFactory} from '../canisters/sns_root/sns_root.utils.did';
import type {SnsCanisterInfo} from '../types/services';
import {createActor} from '../utils/actor.utils';
import {toStatus} from '../utils/canister.utils';

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

  // TODO: this will be soon modified to variants, see canistersSummary details
  const canisters: Array<[string, Principal, CanisterStatusResultV2]> =
    await get_sns_canisters_summary([]);

  const findCanisterInfo = (
    type: 'root' | 'governance' | 'ledger' | 'swap'
  ): SnsCanisterInfo | undefined => {
    const info: [string, Principal, CanisterStatusResultV2] | undefined = canisters.find(
      /* eslint-disable @typescript-eslint/no-unused-vars */
      ([canisterType, _canisterId, _status]: [string, Principal, CanisterStatusResultV2]) =>
        canisterType === type
    );

    if (!info) {
      return undefined;
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [_canisterType, canisterId, status] = info;

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
