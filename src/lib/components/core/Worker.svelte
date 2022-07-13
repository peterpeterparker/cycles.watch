<script lang="ts">
  import type {InternetIdentityAuth} from '../../types/identity';
  import {internetIdentityAuth} from '../../utils/identity.utils';
  import {onWorkerMessage} from '../../services/watch.services';
  import {onDestroy, onMount} from 'svelte';
  import {requestNotificationPermission} from '../../services/notification.services';
  import {authSignedInStore} from '../../stores/auth.store';

  export let syncWorker: Worker | undefined = undefined;

  const startTimer = async () => {
    const internetIdentity: InternetIdentityAuth = await internetIdentityAuth();

    const SyncWorker = await import('$lib/workers/cycles.worker?worker');
    syncWorker = new SyncWorker.default();

    syncWorker.onmessage = onWorkerMessage;

    syncWorker.postMessage({msg: 'startCyclesTimer', data: {internetIdentity}});
  };

  const stopTimer = () => syncWorker?.postMessage({msg: 'stopCyclesTimer'});

  onMount(async () => {
    await requestNotificationPermission();

    await startTimer();
  });

  onDestroy(stopTimer);

  const addCanister = ({detail}: CustomEvent<string>) =>
    syncWorker?.postMessage({msg: 'addCanister', data: detail});

  const addSnsCanister = ({detail}: CustomEvent<string>) =>
      syncWorker?.postMessage({msg: 'addSnsCanister', data: detail});

  $: $authSignedInStore, (() => {
      if (!$authSignedInStore) {
          return;
      }

      stopTimer();
      startTimer();
  })()
</script>

<svelte:window on:addCanister={addCanister} on:addSnsCanister={addSnsCanister} />

<slot />
