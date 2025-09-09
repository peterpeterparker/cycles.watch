<script lang="ts">
	import IconPasskey from '$lib/components/icons/IconPasskey.svelte';
	import PasskeyGuard from '$lib/components/passkeys/PasskeyGuard.svelte';
	import { emit } from '$lib/utils/events.utils';

	const loginWithPasskey = async () => emit({ message: 'continueWithPasskey' });
</script>

<PasskeyGuard>
	<button type="button" onclick={loginWithPasskey} class="primary">
		<IconPasskey />
		Continue with Passkey
	</button>
</PasskeyGuard>

<style lang="scss">
	button {
		display: flex;
		gap: 0.45rem;

		width: 100%;
	}
</style>
