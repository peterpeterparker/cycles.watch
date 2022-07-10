<script lang="ts">
  import type {InternetIdentityAuth} from '../../types/identity';
  import {internetIdentityAuth} from '../../utils/identity.utils';
  import {onWorkerMessage} from '../../services/watch.services';
  import {onDestroy, onMount} from 'svelte';
  import {requestNotificationPermission} from '../../services/notification.services';

  export let syncWorker: Worker | undefined = undefined;

  const startTimer = async () => {
    const internetIdentity: InternetIdentityAuth = await internetIdentityAuth();

    const SyncWorker = await import('$lib/workers/cycles.worker?worker');
    syncWorker = new SyncWorker.default();

    syncWorker.onmessage = onWorkerMessage;

    syncWorker.postMessage({msg: 'startCyclesTimer', data: {internetIdentity}});
  };

  onMount(async () => {
    await requestNotificationPermission();

    await startTimer();
  });

  onDestroy(() => syncWorker?.postMessage({msg: 'stopCyclesTimer'}));

  const addCanister = ({detail}: CustomEvent<string>) =>
    syncWorker?.postMessage({msg: 'addCanister', data: detail});
</script>

<svelte:window on:addCanister={addCanister} />

<slot />
