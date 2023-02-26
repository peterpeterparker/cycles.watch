<script lang="ts">
  import IconInternetComputer from '$lib/icons/IconInternetComputer.svelte';
  import {signIn} from "@junobuild/core";
</script>

<div class="actions">
  <button type="button" on:click={signIn} class="primary">
    <IconInternetComputer />
    Sign in with Internet Identity
  </button>

  <button type="button" class="text" on:click>What's Internet Identity?</button>
</div>

<style lang="scss">
  .actions {
    padding: 0.45rem 0;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .text {
    font-size: var(--font-size-ultra-small);
  }
</style>
