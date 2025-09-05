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
	import { onMount } from 'svelte';
	import { isWebAuthnAvailable } from '@junobuild/core';
	import Popover from '$lib/components/ui/Popover.svelte';
	import CreatePasskey from '$lib/components/passkeys/CreatePasskey.svelte';

	let withPasskey = $state(true);
	let visible = $state(false);
	let progress = $state<PasskeyProgress | undefined>(undefined);

	onMount(() => {
		isWebAuthnAvailable().then((supported) => (withPasskey = supported));
	});

	const start = () => {
		progress = undefined;
		visible = true;
	};

	const onProgress = (passkeyProgress: PasskeyProgress | undefined) => {
		progress = passkeyProgress;
	};
</script>

{#if withPasskey}
	<button type="button" onclick={start} class="primary">
		<IconPasskey />
		Continue with Passkey
	</button>
{/if}

<Popover bind:visible center>
	<div class="container">
		<CreatePasskey {progress} {onProgress} />
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
