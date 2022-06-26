<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import {addCanister} from '../../services/watch.services';

  const dispatch = createEventDispatcher();

  let saving = false;

  let canisterId: string | undefined;
  let validConfirm = false;

  $: validConfirm = canisterId !== undefined && canisterId !== '';

  const handleSubmit = async ($event: MouseEvent | TouchEvent) => {
    $event.preventDefault();

    if (!validConfirm) {
      return;
    }

    await addCanister(canisterId);

    dispatch('papyDone');
  };
</script>

<p>Almost there, insert the canister ID you wish to observe and hit "Add".</p>

<form on:submit={async ($event) => await handleSubmit($event)}>
  <input
    bind:value={canisterId}
    type="text"
    aria-label="Canister ID"
    placeholder="Canister ID"
    maxlength={64}
    disabled={saving} />

  <div class="actions">
    <button type="button" on:click|stopPropagation={() => dispatch('papyBack')} disabled={saving}>
      Back
    </button>

    <button type="submit" disabled={saving || !validConfirm}> Add </button>
  </div>
</form>

<style lang="scss">
  p:first-of-type {
    margin-top: 1.25rem;
  }

  form {
    margin: 0;
  }

  .actions {
    margin-top: 0.75rem;
  }

  input {
    margin: 0 0 0.45rem;
  }
</style>
