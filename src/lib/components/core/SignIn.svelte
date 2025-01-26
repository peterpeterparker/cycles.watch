<script lang="ts">
	import IconInternetComputer from '$lib/components/icons/IconInternetComputer.svelte';
	import { signIn } from '@junobuild/core';

	const onclick = async () => await signIn();
</script>

<button type="button" {onclick} class="primary">
	<IconInternetComputer />
	Continue with Internet Identity
</button>

<style lang="scss">
	button {
		padding-right: 0.75rem;
	}
</style>
