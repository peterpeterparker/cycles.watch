<script lang="ts">
  import CanisterEdit from '$lib/components/canisters/CanisterEdit.svelte';
  import CanisterHighlight from '$lib/components/canisters/CanisterHighlight.svelte';
  import type {CanisterGroup} from '$lib/types/canister';

  export let group: CanisterGroup;
</script>

<div class="toolbar">
  <CanisterEdit />
  <CanisterHighlight {group} />
</div>

<style lang="scss">
  .toolbar {
    display: flex;
    justify-content: center;
    justify-content: flex-start;
    margin: 0.25rem 0.5rem 0;
  }
</style>
