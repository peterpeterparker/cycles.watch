<script lang="ts">
  import {onMount} from 'svelte';
  import {listCanisters} from '../../services/idb.services';
  import Skeleton from '../ui/Skeleton.svelte';
  import NoCanister from './NoCanister.svelte';
  import IconClose from '../icons/IconClose.svelte';
  import AddCanister from './AddCanister.svelte';

  let canisterIds: string[] | undefined = undefined;

  onMount(async () => (canisterIds = await listCanisters()));
</script>

<h2>Canisters</h2>

{#if canisterIds === undefined}
  <Skeleton />
  <Skeleton animationDelay="100" />
  <Skeleton animationDelay="200" />
  <Skeleton animationDelay="300" />
  <Skeleton animationDelay="400" />
{:else if canisterIds.length === 0}
  <NoCanister />
{:else}
  {#each canisterIds as id (id)}
    <div class="canister">
      <button class="icon" aria-label="Remove canister">
        <IconClose />
      </button>
      {id}
    </div>
  {/each}

  <AddCanister display="inline" />
{/if}

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
