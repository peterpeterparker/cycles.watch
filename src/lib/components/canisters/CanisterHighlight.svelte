<script lang="ts">
  import {SvelteComponent} from 'svelte';
  import IconHighlight from '../icons/IconHighlight.svelte';
  import IconFlashlightOff from '../icons/IconFlashlightOff.svelte';
  import type {CanisterGroup} from '../../types/canister';
  import {highlightStore} from '../../stores/highlight.store';

  export let group: CanisterGroup;

  let icon: typeof SvelteComponent;
  $: icon = $highlightStore !== undefined ? IconFlashlightOff : IconHighlight;

  const highlight = () => highlightStore.set($highlightStore !== undefined ? undefined : group);
</script>

<button
  on:click|stopPropagation={highlight}
  aria-label={$highlightStore !== undefined ? 'Show all canister' : 'Highlight'}
  class="icon">
  <svelte:component this={icon} size="small" />
</button>
