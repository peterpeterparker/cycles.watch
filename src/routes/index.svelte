<script lang="ts">
  import {authSignedInStore} from '../lib/stores/auth.store';
  import SignIn from '../lib/components/core/SignIn.svelte';
  import Canisters from '../lib/components/canisters/Canisters.svelte';
  import Watch from '../lib/components/overlays/Watch.svelte';
</script>

<main>
  {#if !$authSignedInStore}
    <SignIn />
  {:else}
    <Canisters />

    <Watch />
  {/if}
</main>
