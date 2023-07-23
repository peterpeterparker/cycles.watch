<script lang="ts">
  import CanisterName from '$lib/components/canisters/CanisterName.svelte';

  export let canisterId: string;
</script>

<CanisterName {canisterId}>
  <slot name="name" slot="name" />
</CanisterName>

<h3><slot name="title" /></h3>

<p class="status"><slot name="status" /></p>
<p><slot name="memory" /></p>

<p class="type"><slot name="type" /></p>

<style lang="scss">
  p {
    font-size: var(--font-size-very-small);
    margin: 0;
  }

  .status {
    margin-top: 0.45rem;
  }

  .type {
    margin-top: 0.75rem;
  }

  .type {
    min-height: 1.2rem;
  }
</style>
