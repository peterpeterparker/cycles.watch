<script lang="ts">
	import { addCanister } from '$lib/services/watch.services';
	import CanisterId from './CanisterId.svelte';
</script>

<CanisterId add={addCanister} placeholder="Canister ID" on:papyDone>
	<p>Almost there, insert the canister ID you wish to observe and hit "Add".</p>
</CanisterId>

<style lang="scss">
	@use '../../themes/mixins/canister';

	@include canister.paragraph;
</style>
