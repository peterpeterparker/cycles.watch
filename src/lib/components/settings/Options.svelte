<script lang="ts">
  import {onMount} from 'svelte';
  import type {Settings} from '../../types/settings';
  import {getSettings, updateTimerInterval, updateWarnTCycles} from '../../services/idb.services';
  import {DEFAULT_SETTINGS} from '../../constants/constants';
  import {busy} from '$lib/stores/busy.store';
  import {setSettings} from '$lib/services/juno.services';

  let timer: number | undefined;
  let warn: number | undefined;

  onMount(async () => {
    const {timerInterval, warnTCycles}: Settings = await getSettings();
    timer = timerInterval;
    warn = warnTCycles;
  });

  const five_min = 5 * 60 * 1000;
  const ten_min = 10 * 60 * 1000;
  const thirty_min = 30 * 60 * 1000;
  const one_hour = 60 * 60 * 1000;

  const onWarnInput = async () => {
    if (isNaN(Number(warn))) {
      return;
    }

    busy.start();

    try {
      const warnTCycles = Number(warn);

      await Promise.all([updateWarnTCycles(warnTCycles), setSettings({settings: {warnTCycles}})]);
    } catch (err: unknown) {
      console.error(err);
    }

    busy.stop();
  };

  const onTimerInterval = async (timerInterval: number) => {
    busy.start();

    try {
      await Promise.all([
        updateTimerInterval(timerInterval),
        setSettings({settings: {timerInterval}})
      ]);
    } catch (err: unknown) {
      console.error(err);
    }

    busy.stop();
  };
</script>

{#if timer !== undefined && warn !== undefined}
  <section>
    <h2>Options</h2>

    <p>
      Timer:

      <select
        bind:value={timer}
        on:change={async () => await onTimerInterval(timer ?? DEFAULT_SETTINGS.timerInterval)}>
        <option value={five_min}> Every 5 minutes </option>
        <option value={ten_min}> Every 10 minutes </option>
        <option value={thirty_min}> Every 30 minutes </option>
        <option value={one_hour}> Every hour </option>
      </select>
    </p>

    <p>
      Warning limit:

      <input bind:value={warn} type="text" placeholder="Value in TCycles" on:input={onWarnInput} />
    </p>
  </section>
{/if}

<style lang="scss">
  input {
    min-width: fit-content;
  }

  p {
    margin-bottom: 0;
  }

  h2 {
    margin-top: 2.75rem;
  }
</style>
