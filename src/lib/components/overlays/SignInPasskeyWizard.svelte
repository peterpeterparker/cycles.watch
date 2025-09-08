<script lang="ts">
	import { authSignedInStore } from '$lib/stores/auth.store.js';
	import SignInPasskey from '$lib/components/passkeys/SignInPasskey.svelte';
</script>

{#if !$authSignedInStore}
	<SignInPasskey />
{/if}
