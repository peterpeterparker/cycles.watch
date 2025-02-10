<script lang="ts">
	import Value from '$lib/components/ui/Value.svelte';

	let userAmount: string = $state('');
</script>

<div>
	<Value ref="icp-amount">
		{#snippet label()}
			Amount in ICP
		{/snippet}

		<input
			id="icp-amount"
			bind:value={userAmount}
			type="text"
			placeholder="How many ICP to convert?"
		/>
	</Value>
</div>

<div>
	<Value>
		{#snippet label()}
			Converted to Cycles
		{/snippet}

		Amount of Cycles
	</Value>
</div>

<style lang="scss">
	div {
		margin: 1.25rem 0 0;
	}
</style>
