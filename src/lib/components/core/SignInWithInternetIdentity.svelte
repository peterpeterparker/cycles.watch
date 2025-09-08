<script lang="ts">
	import IconInternetComputer from '$lib/components/icons/IconInternetComputer.svelte';
	import { signInWithII } from '$lib/services/auth.services';
</script>

<button type="button" onclick={signInWithII} class="primary">
	<IconInternetComputer />
	Continue with Internet Identity
</button>

<style lang="scss">
	button {
		display: flex;
		gap: 0.45rem;

		width: 100%;
	}
</style>
