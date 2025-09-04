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
		padding-right: 0.75rem;
	}
</style>
