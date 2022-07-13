<script lang="ts">
  import {onDestroy, SvelteComponent} from 'svelte';
  import IconHighlight from '../icons/IconHighlight.svelte';
  import IconFlashlightOff from '../icons/IconFlashlightOff.svelte';
  import type {CanisterGroup} from '../../types/canister';
  import {highlightStore} from '../../stores/highlight.store';
  import {canistersUniqueGroups} from '../../stores/canisters.store';

  export let group: CanisterGroup;

  let icon: typeof SvelteComponent;
  $: icon = $highlightStore !== undefined ? IconFlashlightOff : IconHighlight;

  const highlight = () => highlightStore.set($highlightStore !== undefined ? undefined : group);

  onDestroy(() => setTimeout(() => highlightStore.set(undefined), 500));
</script>

{#if $canistersUniqueGroups.length > 0}
  <button
    on:click|stopPropagation={highlight}
    aria-label={$highlightStore !== undefined ? 'Show all canister' : 'Highlight'}
    class="icon">
    <svelte:component this={icon} size="small" />
  </button>
{/if}
