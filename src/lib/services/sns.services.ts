import type {Principal} from '@dfinity/principal';
import type {
  CanisterStatusResultV2,
  CanisterSummary,
  GetSnsCanistersSummaryResponse,
  _SERVICE as SnsRootActor
} from '../canisters/sns_root/sns_root.did';
import {idlFactory} from '../canisters/sns_root/sns_root.utils.did';
import type {SnsCanisterInfo, SnsCanisterInfoType} from '../types/services';
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

  const findCanisterSummaryInfo = (
    type: 'root' | 'governance' | 'ledger' | 'swap' | 'index'
  ): SnsCanisterInfo | undefined => {
    const info: CanisterSummary | undefined = fromNullable(canisters[type]);

    if (!info) {
      return undefined;
    }

    return findCanisterInfo({type, info});
  };

  const findCanisterInfo = ({
    type,
    info
  }: {
    type: SnsCanisterInfoType;
    info: CanisterSummary;
  }): SnsCanisterInfo | undefined => {
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

  const rootCanisterInfo: SnsCanisterInfo | undefined = findCanisterSummaryInfo('root');
  const governanceCanisterInfo: SnsCanisterInfo | undefined = findCanisterSummaryInfo('governance');
  const ledgerCanisterInfo: SnsCanisterInfo | undefined = findCanisterSummaryInfo('ledger');
  const swapCanisterInfo: SnsCanisterInfo | undefined = findCanisterSummaryInfo('swap');
  const indexCanisterInfo: SnsCanisterInfo | undefined = findCanisterSummaryInfo('index');
  const dappsCanisterInfos: (SnsCanisterInfo | undefined)[] = canisters.dapps.map(
    (info: CanisterSummary) => findCanisterInfo({type: 'dapps', info})
  );
  const archivesCanisterInfos: (SnsCanisterInfo | undefined)[] = canisters.archives.map(
    (info: CanisterSummary) => findCanisterInfo({type: 'archives', info})
  );

  return [
    rootCanisterInfo,
    governanceCanisterInfo,
    ledgerCanisterInfo,
    swapCanisterInfo,
    indexCanisterInfo,
    ...dappsCanisterInfos,
    ...archivesCanisterInfos
  ].filter((info: SnsCanisterInfo | undefined) => info !== undefined) as SnsCanisterInfo[];
};
