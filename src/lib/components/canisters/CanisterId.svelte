<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  export let add: (canisterId: string) => Promise<void>;
  export let placeholder: string;

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

    await add(canisterId);

    dispatch('papyDone');
  };
</script>

<slot />

<form on:submit={async ($event) => await handleSubmit($event)}>
  <input
    bind:value={canisterId}
    type="text"
    aria-label={placeholder}
    placeholder={placeholder}
    maxlength={64}
    disabled={saving} />

  <div class="actions">
    <button type="submit" disabled={saving || !validConfirm}> Add </button>
  </div>
</form>

<style lang="scss">
  @use '../../themes/mixins/canister';

  @include canister.actions;

  form {
    margin: 0;
  }

  input {
    margin: 0 0 1.25rem;
  }
</style>
