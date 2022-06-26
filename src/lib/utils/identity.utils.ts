import type {Identity} from '@dfinity/agent';
import {LocalStorage} from '@dfinity/auth-client';
import {isDelegationValid} from '@dfinity/authentication';
import {DelegationChain, DelegationIdentity, Ed25519KeyIdentity} from '@dfinity/identity';
import type {InternetIdentityAuth} from '../types/identity';

export const internetIdentityAuth = async (): Promise<InternetIdentityAuth> => {
  const storage: LocalStorage = new LocalStorage('ic-');

  const identityKey: string | null = await storage.get('identity');
  const delegationChain: string | null = await storage.get('delegation');

  if (!delegationChain || !isDelegationValid(DelegationChain.fromJSON(delegationChain))) {
    throw new Error('Internet identity has expired. Please login again.');
  }

  return {
    identityKey,
    delegationChain
  };
};

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
