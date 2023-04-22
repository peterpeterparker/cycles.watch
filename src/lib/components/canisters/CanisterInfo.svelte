<script lang="ts">
  import Copy from '$lib/components/ui/Copy.svelte';

  export let canisterId: string;
</script>

<h3><slot name="title" /></h3>

<p class="status"><slot name="status" /></p>
<p><slot name="memory" /></p>

<p class="type"><slot name="type" /></p>

<p class="canister-id">
  <span>{canisterId}</span>
  <Copy value={canisterId} ariaLabel="Copy canister ID to clipboard" />
</p>

<style lang="scss">
  p {
    font-size: var(--font-size-very-small);
    margin: 0;
  }

  .status {
    margin-top: 0.45rem;
  }

  .canister-id,
  .type {
    margin-top: 0.75rem;
  }

  .type {
    min-height: 1rem;
  }
</style>
