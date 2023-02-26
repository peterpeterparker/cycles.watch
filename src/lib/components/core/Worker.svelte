<script lang="ts">
  import {onWorkerMessage} from '../../services/watch.services';
  import {onDestroy, onMount} from 'svelte';
  import {requestNotificationPermission} from '../../services/notification.services';
  import {authSignedInStore, authStore} from '../../stores/auth.store';
  import {initData} from "$lib/services/data.services";

  export let syncWorker: Worker | undefined = undefined;

  const startTimer = async () => {
    const SyncWorker = await import('$lib/workers/cycles.worker?worker');
    syncWorker = new SyncWorker.default();

    syncWorker.onmessage = onWorkerMessage;

    syncWorker.postMessage({msg: 'startCyclesTimer', data: {}});
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

  $: $authSignedInStore,
    (async () => {
      if (!$authSignedInStore) {
        return;
      }

      await initData($authStore.user!);

      stopTimer();
      await startTimer();
    })();
</script>

<svelte:window on:addCanister={addCanister} on:addSnsCanister={addSnsCanister} />

<slot />
