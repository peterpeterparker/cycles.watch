<script lang="ts">
  import IconPlus from '../icons/IconPlus.svelte';
  import {emitAddCanister} from '../../utils/events.utils';

  export let display: 'inline' | 'card' = 'card';

  export let card = true;
  $: card = display === 'card';
</script>

<div class={card ? 'card' : 'inline'}>
  <button
    type="button"
    class={card ? 'toolbar' : 'primary'}
    title="Add a canister"
    on:click={emitAddCanister}>
    <IconPlus slot="icon" />
    <span class={card ? 'visually-hidden' : ''}>Add a canister</span>
  </button>

  {#if card}
    <span>Add a canister</span>
  {/if}
</div>

<style lang="scss">
  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    min-height: 8.45rem;
  }

  .inline {
    margin-top: 0.45rem;
  }

  span {
    font-size: var(--font-size-small);
  }
</style>
