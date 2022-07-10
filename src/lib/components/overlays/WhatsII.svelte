<script lang="ts">
  import Modal from '../ui/Modal.svelte';
  let open = false;
</script>

<svelte:window on:openWhatsII={() => (open = true)} />

{#if open}
  <Modal on:papyClose={() => (open = false)}>
    <what-is-ii />
  </Modal>
{/if}

<style lang="scss">
  @use '../../themes/mixins/shadow';

  :global(what-is-ii img) {
    @include shadow.shadow;
    border-style: solid;
  }
</style>
