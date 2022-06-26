<script lang="ts">
  import {canistersStore} from '../../stores/canisters.store';
  import Canister from './Canister.svelte';
  import Spinner from '../ui/Spinner.svelte';
  import AddCanister from './AddCanister.svelte';
  import NoCanister from './NoCanister.svelte';
  import Worker from '../core/Worker.svelte';
</script>

<Worker>
  {#if $canistersStore === undefined}
    <Spinner />
  {:else if $canistersStore.length === 0}
    <section>
      <NoCanister />
    </section>
  {:else}
    <section class="grid">
      {#each $canistersStore as canister (canister.id)}
        <Canister {canister} />
      {/each}
      <AddCanister />
    </section>
  {/if}
</Worker>

<style lang="scss">
  @use '../../themes/mixins/grid';

  .grid {
    @include grid.posts;
  }
</style>
