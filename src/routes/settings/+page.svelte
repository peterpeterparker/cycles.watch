<script lang="ts">
	import Settings from '$lib/components/settings/Settings.svelte';
	import Back from '$lib/components/core/Back.svelte';
	import User from '$lib/components/settings/User.svelte';
</script>

<Back />

<main>
	<section>
		<h1>Settings</h1>

		<p>Your local settings on <strong>Cycles.watch</strong>.</p>
	</section>

	<User />

	<Settings />
</main>
