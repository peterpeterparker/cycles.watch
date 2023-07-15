<script lang="ts">
  import IconInternetComputer from '$lib/components/icons/IconInternetComputer.svelte';
  import {signIn} from '@junobuild/core';
</script>

<button type="button" on:click={signIn} class="primary">
  <IconInternetComputer />
  Continue with Internet Identity
</button>

<style lang="scss">
  button {
    padding-right: 0.75rem;
  }
</style>
