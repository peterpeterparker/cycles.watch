<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import IconOisy from '$lib/components/icons/IconOisy.svelte';

	const connectOISY = () => {
		console.log('TODO');
	};
</script>

<Button display="inline" text="OISY" icon={IconOisy} on:click={connectOISY} />
