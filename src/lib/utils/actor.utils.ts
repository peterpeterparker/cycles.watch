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
	const host: string = import.meta.env.VITE_IC_HOST as string;

	const agent: HttpAgent = new HttpAgent({ ...(identity && { identity }), ...(host && { host }) });

	const local = (): boolean => {
		const { hostname }: URL = new URL(host);
		return ['127.0.0.1', 'localhost', 'nnsdapp.dfinity.network'].includes(hostname);
	};

	if (local()) {
		// Fetch root key for certificate validation during development
		await agent.fetchRootKey();
	}

	// Creates an actor with using the candid interface and the HttpAgent
	return Actor.createActor(idlFactory, {
		agent,
		...config
	});
};
