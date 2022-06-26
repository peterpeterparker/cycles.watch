<script lang="ts">
  import IconPlus from '../icons/IconPlus.svelte';
  import {emit} from '../../utils/events.utils';

  const add = async () => emit<void>({message: 'openAddCanister'});
</script>

<div>
  <button type="button" class="toolbar" title="Add a canister" on:click={add}>
    <IconPlus slot="icon" />
    <span class="visually-hidden">Add a canister</span>
  </button>

  <span>Add a canister</span>
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  span {
    font-size: var(--font-size-small);
  }
</style>
