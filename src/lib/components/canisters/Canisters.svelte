<script lang="ts">
  import {canistersStore, sortedCanisters} from '../../stores/canisters.store';
  import Canister from './Canister.svelte';
  import Spinner from '../ui/Spinner.svelte';
  import AddCanister from './AddCanister.svelte';
</script>

{#if !$canistersStore.initialized}
  <Spinner />
{:else}
  <section class="grid">
    {#each $sortedCanisters as canister (canister.id)}
      <Canister {canister} />
    {/each}
    <AddCanister />
  </section>
{/if}

<style lang="scss">
  @use '../../themes/mixins/grid';

  .grid {
    @include grid.posts;
  }
</style>
