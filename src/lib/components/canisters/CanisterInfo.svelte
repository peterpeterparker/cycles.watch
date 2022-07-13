<script lang="ts">
  import Copy from '../ui/Copy.svelte';

  export let canisterId: string;
</script>

<h3><slot name="title" /></h3>
<p><slot name="icp" /></p>

<p class="status"><slot name="status" /></p>
<p><slot name="memory" /></p>

<p class="type"><slot name="type" /></p>

<p class="canister-id">
  <span>{canisterId}</span>
  <Copy value={canisterId} ariaLabel="Copy canister ID to clipboard" />
</p>

<div class="highlight"><slot name="highlight" /></div>

<style lang="scss">
  p {
    font-size: var(--font-size-very-small);
    margin: 0;
  }

  .status {
    margin-top: 0.45rem;
  }

  .canister-id, .type {
    margin-top: 0.75rem;
  }

  .type {
    min-height: 1rem;
  }

  .highlight {
    position: absolute;
    inset: 0.45rem 0.45rem auto auto;
  }
</style>
