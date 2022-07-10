<script lang="ts">
  import Canisters from '../lib/components/canisters/Canisters.svelte';
  import Add from '../lib/components/overlays/Add.svelte';
  import Toolbar from '../lib/components/core/Toolbar.svelte';
  import Welcome from "../lib/components/core/Welcome.svelte";
  import {canistersInitialized} from "../lib/stores/canisters.store";
</script>

<Toolbar />

<main>
  {#if !$canistersInitialized}
    <Welcome />
  {:else}
    <Canisters />
  {/if}

  <Add />
</main>
