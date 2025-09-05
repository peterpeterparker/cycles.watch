<script lang="ts">
	import type { PasskeyProps } from '$lib/components/passkeys/SignInPasskey.svelte';
	import {
		signIn,
		type SignProgress,
		type SignProgressFn,
		WebAuthnSignInProgressStep
	} from '@junobuild/core';
	import { toasts } from '$lib/stores/toasts.store';
	import ProgressPasskey from '$lib/components/passkeys/ProgressPasskey.svelte';

	let { progress: wizardProgress, onProgress: wizardOnProgress }: PasskeyProps = $props();

	const onProgress: SignProgressFn<WebAuthnSignInProgressStep> = (progress) =>
		wizardOnProgress({ signIn: progress });

	let progress = $derived<SignProgress<WebAuthnSignInProgressStep> | undefined | null>(
		wizardProgress === undefined
			? undefined
			: 'signIn' in wizardProgress
				? wizardProgress.signIn
				: null
	);

	const onsubmit = async () => {
		try {
			await signIn({
				webauthn: {
					options: { onProgress }
				}
			});
		} catch (err: unknown) {
			wizardOnProgress(undefined);

			toasts.error({
				text: 'Unexpected error while signing in',
				detail: err
			});
		}
	};
</script>

{#if progress === undefined}
	<p>Already got one set-up?</p>

	<form {onsubmit}>
		<button type="submit">Use your passkey</button>
	</form>
{:else if progress !== null}
	<ProgressPasskey>
		{#if progress?.step === WebAuthnSignInProgressStep.RequestingUserCredential}
			Requesting user credential...
		{/if}

		{#if progress?.step === WebAuthnSignInProgressStep.FinalizingCredential}
			Finalizing credential...
		{/if}

		{#if progress?.step === WebAuthnSignInProgressStep.Signing}
			Signing request...
		{/if}

		{#if progress?.step === WebAuthnSignInProgressStep.FinalizingSession}
			Finalizing session...
		{/if}

		{#if progress?.step === WebAuthnSignInProgressStep.RetrievingUser}
			Loading user...
		{/if}
	</ProgressPasskey>
{/if}

<style lang="scss">
	form {
		margin: 0;
	}

	p {
		margin: 1.75rem 0 0;
	}
</style>
