<script lang="ts">
	import IconInternetComputer from '$lib/components/icons/IconInternetComputer.svelte';
	import { signInWithII } from '$lib/services/auth.services';
	import SignInPasskey from '$lib/components/passkeys/SignInPasskey.svelte';
</script>

<div role="toolbar" class="container">
	<SignInPasskey />

	<button type="button" onclick={signInWithII} class="primary">
		<IconInternetComputer />
		Continue with Internet Identity
	</button>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;

		padding: 1rem 0;
	}

	button {
		display: flex;
		gap: 0.45rem;

		width: 100%;
	}
</style>
