import { CONTAINER } from '$lib/constants/constants';
import { nonNullish } from '$lib/utils/utils';
import {
	Actor,
	HttpAgent,
	type ActorConfig,
	type ActorMethod,
	type ActorSubclass,
	type Identity
} from '@dfinity/agent/lib/cjs/index';
import type { IDL } from '@dfinity/candid';

export const createActor = async <T = Record<string, ActorMethod>>({
	config,
	idlFactory,
	identity
}: {
	config: ActorConfig;
	idlFactory: IDL.InterfaceFactory;
	identity?: Identity;
}): Promise<ActorSubclass<T>> => {
	const host = CONTAINER ?? 'https://icp-api.io';

	const local = (): boolean => {
		const { hostname }: URL = new URL(host);
		return ['127.0.0.1', 'localhost'].includes(hostname);
	};

	const agent = await HttpAgent.create({
		...(nonNullish(identity) && { identity }),
		...(nonNullish(host) && { host }),
		shouldFetchRootKey: local()
	});

	// Creates an actor with using the candid interface and the HttpAgent
	return Actor.createActor(idlFactory, {
		agent,
		...config
	});
};
