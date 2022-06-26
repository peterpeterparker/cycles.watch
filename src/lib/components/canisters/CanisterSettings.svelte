<script lang="ts">
  import Skeleton from '../ui/Skeleton.svelte';
  import NoCanister from './NoCanister.svelte';
  import IconClose from '../icons/IconClose.svelte';
  import AddCanister from './AddCanister.svelte';
  import Worker from '../core/Worker.svelte';
  import {canistersStore} from '../../stores/canisters.store';
  import type {Canister} from '../../types/canister';
  import {removeCanister} from '../../services/watch.services';

  const remove = (canister: Canister) => removeCanister(canister);
</script>

<h2>Canisters</h2>

<p>The list of canisters which should be observed.</p>

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
        <button
          type="button"
          class="icon"
          aria-label="Remove canister"
          on:click={() => remove(canister)}>
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

  p {
    margin-bottom: 0.75rem;
  }
</style>
