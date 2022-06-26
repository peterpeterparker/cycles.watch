<script lang="ts">
  import Skeleton from '../ui/Skeleton.svelte';
  import NoCanister from './NoCanister.svelte';
  import IconClose from '../icons/IconClose.svelte';
  import AddCanister from './AddCanister.svelte';
  import Worker from '../core/Worker.svelte';
  import {canistersStore} from '../../stores/canisters.store';
</script>

<h2>Canisters</h2>

<Worker>
  {#if $canistersStore === undefined}
    <Skeleton />
    <Skeleton animationDelay="100" />
    <Skeleton animationDelay="200" />
    <Skeleton animationDelay="300" />
    <Skeleton animationDelay="400" />
  {:else if canistersStore.length === 0}
    <NoCanister />
  {:else}
    {#each $canistersStore as canister (canister.id)}
      <div class="canister">
        <button class="icon" aria-label="Remove canister">
          <IconClose />
        </button>
        {canister.id}
      </div>
    {/each}

    <AddCanister display="inline" />
  {/if}
</Worker>

<style lang="scss">
  .canister {
    display: flex;
    align-items: center;

    button {
      margin-right: 0.45rem;
    }
  }

  h2 {
    margin-top: 1.75rem;
  }
</style>
