<script>
	import SignIn from '$lib/components/core/SignIn.svelte';
</script>

<section>
	<p>
		<strong>Cycles.watch</strong> monitors the cycles consumption of canisters on the
		<a href="https://internetcomputer.org/" rel="external noopener norefferer" target="_blank"
			>Internet Computer</a
		>. It periodically refreshes their state and provides information on their remaining resources.
	</p>

	<div class="actions">
		<SignIn />
	</div>
</section>

<style lang="scss">
	.actions {
		width: 100%;

		padding: 0.45rem 0;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	p {
		@media (min-width: 768px) {
			margin: 0;
		}
	}
</style>
