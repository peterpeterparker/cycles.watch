<script lang="ts">
  import {canistersStore} from '../../stores/canisters.store';
  import Canister from './Canister.svelte';
  import Spinner from '../ui/Spinner.svelte';
  import AddCanister from './AddCanister.svelte';
</script>

{#if !$canistersStore.initialized}
  <Spinner />
{:else}
  <section class="grid">
    {#each $canistersStore.canisters as canister (canister.id)}
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
