<script lang="ts">
	import SignInPasskeyButton from '$lib/components/passkeys/SignInPasskeyButton.svelte';
	import SignInWithInternetIdentity from '$lib/components/core/SignInWithInternetIdentity.svelte';
</script>

<div role="toolbar" class="container">
	<SignInPasskeyButton />

	<SignInWithInternetIdentity />
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;

		padding: 1rem 0;
	}
</style>
