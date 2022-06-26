<script lang="ts">
  import {authSignedInStore} from '../lib/stores/auth.store';
  import SignIn from '../lib/components/core/SignIn.svelte';
  import Canisters from '../lib/components/canisters/Canisters.svelte';
  import Add from '../lib/components/overlays/Add.svelte';
  import Toolbar from "../lib/components/core/Toolbar.svelte";
</script>

<Toolbar />

<main>
  {#if !$authSignedInStore}
    <SignIn />
  {:else}
    <Canisters />

    <Add />
  {/if}
</main>
