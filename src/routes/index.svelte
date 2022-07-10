<script lang="ts">
  import Canisters from '../lib/components/canisters/Canisters.svelte';
  import Toolbar from '../lib/components/core/Toolbar.svelte';
  import Welcome from '../lib/components/core/Welcome.svelte';
  import {canistersEmpty} from '../lib/stores/canisters.store';
</script>

<Toolbar />

<main>
  {#if $canistersEmpty}
    <Welcome />
  {:else}
    <Canisters />
  {/if}
</main>
