<script lang="ts">
  import IconEdit from '$lib/components/icons/IconEdit.svelte';
  import Popover from '$lib/components/ui/Popover.svelte';

  let visible: boolean | undefined;
  let canisterName: string | undefined;

  let saving = false;
</script>

<button on:click|stopPropagation={() => (visible = true)} aria-label="Edit" class="toolbar small">
  <IconEdit size="small" />
</button>

<Popover bind:visible center>
  <div class="container">
    <p>Canister name</p>

    <input
      bind:value={canisterName}
      type="text"
      placeholder="A shortname as hint"
      maxlength={64}
      disabled={saving} />
  </div>
</Popover>

<style lang="scss">
  .container {
    padding: 0.75rem;
  }

  p {
    font-weight: bold;
    margin: 0;
  }
</style>
