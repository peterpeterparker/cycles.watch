<script lang="ts">
  import Modal from '../ui/Modal.svelte';
  let open = false;
</script>

<button class="text" on:click={() => (open = true)}>What's Internet Identity?</button>

{#if open}
  <Modal on:papyClose={() => (open = false)}>
    <what-is-ii />
  </Modal>
{/if}

<style lang="scss">
  @use '../../themes/mixins/shadow';

  button {
    font-size: var(--font-size-ultra-small);
  }

  :global(what-is-ii img) {
    @include shadow.shadow;
    border-style: solid;
  }
</style>
