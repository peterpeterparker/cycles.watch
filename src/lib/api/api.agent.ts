import { CONTAINER } from '$lib/constants/constants';
import { nonNullish } from '$lib/utils/utils';
import type { Identity } from '@icp-sdk/core/agent';
import { HttpAgent } from '@icp-sdk/core/agent';

// TODO: agent should be cached per principal / user id for best performance
export const createAgent = async ({ identity }: { identity?: Identity }): Promise<HttpAgent> => {
	const host = CONTAINER ?? 'https://icp-api.io';

	const local = (): boolean => {
		const { hostname }: URL = new URL(host);
		return ['127.0.0.1', 'localhost'].includes(hostname);
	};

	return await HttpAgent.create({
		...(nonNullish(identity) && { identity }),
		...(nonNullish(host) && { host }),
		shouldFetchRootKey: local()
	});
};
