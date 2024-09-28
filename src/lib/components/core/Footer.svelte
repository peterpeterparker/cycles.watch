<script>
	import IconJuno from '$lib/components/icons/IconJuno.svelte';
</script>

<footer>
	<a
		class="primary"
		href="https://juno.build"
		rel="external noopener norefferer"
		target="_blank"
		aria-label="Built with Juno"
	>
		<IconJuno />
		Build with Juno
	</a>
</footer>

<style lang="scss">
	footer {
		display: flex;
		justify-content: center;
		align-items: flex-end;

		flex: 2;

		padding: 2rem 0 1.45rem;
	}

	a {
		display: flex;
		gap: 0.45rem;
	}

	footer a {
		background: none;
		box-shadow: none;
	}
</style>
