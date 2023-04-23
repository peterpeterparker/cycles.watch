<script lang="ts">
  import CanisterEdit from '$lib/components/canisters/CanisterEdit.svelte';
  import CanisterHighlight from '$lib/components/canisters/CanisterHighlight.svelte';
  import type {Canister} from '$lib/types/canister';

  export let canister: Canister;
</script>

<div class="toolbar">
  <CanisterEdit {canister} />
  <CanisterHighlight {canister} />
</div>

<style lang="scss">
  .toolbar {
    display: flex;
    justify-content: flex-start;
    margin: 0.25rem 0.5rem 0;
  }
</style>
