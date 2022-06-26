<script lang="ts">
  import type {InternetIdentityAuth} from '../../types/identity';
  import {internetIdentityAuth} from '../../utils/identity.utils';
  import {onDestroy, onMount} from 'svelte';
  import {authSignedInStore} from '../../stores/auth.store';
  import {canistersStore} from '../../stores/canisters.store';
  import Canister from './Canister.svelte';
  import {emit} from '../../utils/events.utils';
  import Spinner from '../ui/Spinner.svelte';
  import {onWorkerMessage} from '../../services/watch.services';
  import {requestNotificationPermission} from '../../services/notification.services';

  let syncWorker: Worker | undefined = undefined;

  const startTimer = async () => {
    const internetIdentity: InternetIdentityAuth = await internetIdentityAuth();

    const SyncWorker = await import('$lib/workers/cycles.worker?worker');
    syncWorker = new SyncWorker.default();

    syncWorker.onmessage = onWorkerMessage;

    syncWorker.postMessage({msg: 'startCyclesTimer', data: {internetIdentity}});
  };

  onMount(async () => {
    await requestNotificationPermission();

    if (!$authSignedInStore) {
      return;
    }

    await startTimer();
  });

  onDestroy(() => syncWorker?.postMessage({msg: 'stopCyclesTimer'}));

  const watch = async () => emit<void>({message: 'openAddCanister'});

  const addCanister = ({detail}: CustomEvent<string>) =>
    syncWorker?.postMessage({msg: 'addCanister', data: detail});
</script>

<svelte:window on:addCanister={addCanister} />

{#if $canistersStore === undefined}
  <Spinner />
{:else if $canistersStore.length === 0}
  <section>
    <p>
      No canisters to watch for. <button class="text" on:click={watch}>Add one</button> to your watchlist
      to get started!
    </p>
  </section>
{:else}
  <section class="grid">
    {#each $canistersStore as canister (canister.id)}
      <Canister {canister} />
    {/each}
  </section>
{/if}

<style lang="scss">
  @use '../../themes/mixins/grid';

  .grid {
    @include grid.posts;
  }

  button {
    display: inline-block;
    margin: var(--padding) 0;
  }
</style>
