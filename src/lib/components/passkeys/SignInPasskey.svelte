<script lang="ts" module>
	import type {
		WebAuthnSignInProgressStep,
		WebAuthnSignUpProgressStep,
		SignProgress
	} from '@junobuild/core';

	export type PasskeyProgress =
		| {
				signUp: SignProgress<WebAuthnSignUpProgressStep>;
		  }
		| {
				signIn: SignProgress<WebAuthnSignInProgressStep>;
		  }
		| { setup: null };

	export interface PasskeyProps {
		progress: PasskeyProgress | undefined;
		onProgress: (progress: PasskeyProgress | undefined) => void;
	}
</script>

<script lang="ts">
	import IconPasskey from '$lib/components/icons/IconPasskey.svelte';
	import Popover from '$lib/components/ui/Popover.svelte';
	import CreatePasskey from '$lib/components/passkeys/CreatePasskey.svelte';
	import UsePasskey from '$lib/components/passkeys/UsePasskey.svelte';
	import { nonNullish } from '@dfinity/utils';
	import PasskeyGuard from '$lib/components/passkeys/PasskeyGuard.svelte';

	let visible = $state(false);
	let progress = $state<PasskeyProgress | undefined>(undefined);

	const start = () => {
		progress = undefined;
		visible = true;
	};

	const onProgress = (passkeyProgress: PasskeyProgress | undefined) => {
		progress = passkeyProgress;
	};
</script>

<PasskeyGuard>
	<button type="button" onclick={start} class="primary">
		<IconPasskey />
		Continue with Passkey
	</button>
</PasskeyGuard>

<svelte:window oncontinueWithPasskey={start} />

<Popover bind:visible center closeDisabled={nonNullish(progress)}>
	<div class="container">
		<CreatePasskey {progress} {onProgress} />

		<UsePasskey {progress} {onProgress} />
	</div>
</Popover>

<style lang="scss">
	button {
		display: flex;
		gap: 0.45rem;

		width: 100%;
	}

	.container {
		display: flex;
		flex-direction: column;

		padding: 0 1.75rem;

		width: 100%;
	}
</style>
