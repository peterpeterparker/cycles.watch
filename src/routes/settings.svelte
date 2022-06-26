<script lang="ts">
  import {authSignedInStore} from '../lib/stores/auth.store';
  import SignIn from '../lib/components/core/SignIn.svelte';
  import Add from '../lib/components/overlays/Add.svelte';
  import CanisterIdsSettings from "../lib/components/canisters/CanisterIdsSettings.svelte";
  import Back from "../lib/components/core/Back.svelte";
</script>

<Back />

<main>
  {#if !$authSignedInStore}
    <SignIn />
  {:else}
    <section>
        <h1>Settings</h1>

        <p>Your local settings on <a href="/">Cycles.watch</a>.</p>

        <CanisterIdsSettings />
    </section>

    <Add />
  {/if}
</main>
