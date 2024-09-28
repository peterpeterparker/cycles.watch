<script lang="ts">
	import IconPlus from '../icons/IconPlus.svelte';
	import { emitAddCanister } from '../../utils/events.utils';
	import Button from '../ui/Button.svelte';

	export let display: 'inline' | 'card' = 'card';
</script>

<Button icon={IconPlus} text="Add a canister" {display} on:click={emitAddCanister} />
