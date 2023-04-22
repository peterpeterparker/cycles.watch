<script lang="ts">
  import {authSignedInStore} from '$lib/stores/auth.store';
  import Principal from '$lib/components/core/Principal.svelte';
</script>

{#if $authSignedInStore}
  <section>
    <h2>Your principal ID</h2>

    <Principal />
  </section>
{/if}

<style lang="scss">
    h2 {
      margin-top: 2.75rem;
    }
</style>