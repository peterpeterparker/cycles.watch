import type {Identity} from '@dfinity/agent';
import {DelegationChain, DelegationIdentity, Ed25519KeyIdentity} from '@dfinity/identity';

export const initIdentity = ({
  identityKey,
  delegationChain
}: {
  identityKey: string;
  delegationChain: string;
}): Identity => {
  const chain: DelegationChain = DelegationChain.fromJSON(delegationChain);
  const key: Ed25519KeyIdentity = Ed25519KeyIdentity.fromJSON(identityKey);

  return DelegationIdentity.fromDelegation(key, chain);
};
