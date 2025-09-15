import { createAgent } from '$lib/api/api.agent';
import {
	Actor,
	type ActorConfig,
	type ActorMethod,
	type ActorSubclass,
	type Identity
} from '@dfinity/agent';
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
	const agent = await createAgent({ identity });

	// Creates an actor with using the candid interface and the HttpAgent
	return Actor.createActor(idlFactory, {
		agent,
		...config
	});
};
