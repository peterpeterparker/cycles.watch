<script lang="ts">
	import {
		type SignProgress,
		type SignProgressFn,
		signUp,
		WebAuthnSignUpProgressStep
	} from '@junobuild/core';
	import type { PasskeyProps } from '$lib/components/passkeys/SignInPasskey.svelte';
	import { toasts } from '$lib/stores/toasts.store';
	import ProgressPasskey from '$lib/components/passkeys/ProgressPasskey.svelte';

	let { progress: wizardProgress, onProgress: wizardOnProgress }: PasskeyProps = $props();

	type ProgressSignUp =
		| {
				state: 'init' | 'setup' | 'hidden';
		  }
		| {
				state: 'progress';
				detail: SignProgress<WebAuthnSignUpProgressStep>;
		  };

	const onProgress: SignProgressFn<WebAuthnSignUpProgressStep> = (progress) =>
		wizardOnProgress({ signUp: progress });

	let progress = $derived<ProgressSignUp>(
		wizardProgress === undefined
			? { state: 'init' }
			: 'signUp' in wizardProgress
				? { state: 'progress', detail: wizardProgress.signUp }
				: 'setup' in wizardProgress
					? { state: 'setup' }
					: { state: 'hidden' }
	);

	const goToSetup = () => {
		wizardOnProgress({ setup: null });
	};

	const onsubmit = async ($event: SubmitEvent) => {
		$event.preventDefault();

		try {
			await signUp({
				webauthn: {
					options: {
						onProgress,
						...(inputText !== '' && {
							passkey: {
								user: {
									displayName: inputText
								}
							}
						})
					}
				}
			});
		} catch (err: unknown) {
			wizardOnProgress(undefined);

			toasts.error({
				text: 'Unexpected error while signing up',
				detail: err
			});
		}
	};

	let inputText = $state('');
</script>

{#if progress.state === 'init'}
	<p>First time here? Use your device (Face ID, Windows Hello, or screen lock) to get in.</p>

	<button onclick={goToSetup}>Create a new passkey</button>
{:else if progress.state === 'setup'}
	<p>Want to give it a nickname so you'll spot it easily later?</p>

	<form {onsubmit}>
		<input id="passkeyName" bind:value={inputText} type="text" placeholder="A optional nickname" />

		<button type="submit">Create now</button>
	</form>
{:else if progress.state === 'progress'}
	<ProgressPasskey>
		{#if progress?.detail.step === WebAuthnSignUpProgressStep.CreatingUserCredential}
			Creating user credential...
		{/if}

		{#if progress?.detail.step === WebAuthnSignUpProgressStep.ValidatingUserCredential}
			Validating user credential...
		{/if}

		{#if progress?.detail.step === WebAuthnSignUpProgressStep.FinalizingCredential}
			Finalizing credential...
		{/if}

		{#if progress?.detail.step === WebAuthnSignUpProgressStep.Signing}
			Signing request...
		{/if}

		{#if progress?.detail.step === WebAuthnSignUpProgressStep.FinalizingSession}
			Finalizing session...
		{/if}

		{#if progress?.detail.step === WebAuthnSignUpProgressStep.RegisteringUser}
			Registering user...
		{/if}
	</ProgressPasskey>
{/if}

<style lang="scss">
	p,
	form {
		margin: 0;
	}

	input {
		width: 100%;
	}
</style>
