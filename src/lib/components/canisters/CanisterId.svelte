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

    if (!validConfirm || canisterId === undefined) {
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
    <button type="submit" disabled={saving || !validConfirm}> Add </button>
  </div>
</form>

<style lang="scss">
  @use '../../themes/mixins/canister';

  @include canister.overlay;

  form {
    margin: 0;
  }

  input {
    margin: 0 0 1.25rem;
  }
</style>
