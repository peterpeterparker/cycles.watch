<script>
	import SignInInternetIdentity from '$lib/components/core/SignInInternetIdentity.svelte';
</script>

<section>
	<p>
		With <strong>Cycles.watch</strong> you can monitor the cycles consumption of your canisters on
		the
		<a href="https://internetcomputer.org/" rel="external noopener norefferer" target="_blank"
			>Internet Computer</a
		>. It periodically refreshes their status and provides information on their remaining resources.
	</p>

	<div class="actions">
		<SignInInternetIdentity />
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
		text-align: center;
		max-width: 700px;
		margin: 0 auto;
	}
</style>
