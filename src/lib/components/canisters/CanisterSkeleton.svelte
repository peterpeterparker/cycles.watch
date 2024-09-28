<script lang="ts">
	import Skeleton from '../ui/Skeleton.svelte';
	import CanisterName from '$lib/components/canisters/CanisterName.svelte';

	export let canisterId: string;
</script>

<CanisterName {canisterId}>
	<slot name="name" slot="name" />
</CanisterName>

<Skeleton elementTag="h3" />

<Skeleton animationDelay={100} />
<Skeleton animationDelay={200} />

<Skeleton animationDelay={300} />
<Skeleton animationDelay={400} />
