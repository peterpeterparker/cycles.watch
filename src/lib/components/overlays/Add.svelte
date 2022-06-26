<script lang="ts">
  import Controller from '../canisters/Controller.svelte';
  import CanisterId from '../canisters/CanisterId.svelte';
  import {fly} from 'svelte/transition';
  import Modal from '../ui/Modal.svelte';

  let open = false;

  let step: 'controller' | 'canister_id' = 'controller';

  const close = () => {
    open = false;
    step = 'controller';
  };
</script>

<svelte:window on:openAddCanister={() => (open = true)} />

{#if open}
  <Modal on:papyClose={close}>
    <h3>Add a canister</h3>

    {#if step === 'controller'}
      <div in:fly={{x: 200, duration: 200}}>
        <Controller on:papyCancel={close} on:papyNext={() => (step = 'canister_id')} />
      </div>
    {:else if step === 'canister_id'}
      <div in:fly={{x: 200, duration: 200}}>
        <CanisterId on:papyBack={() => (step = 'controller')} on:papyDone={close} />
      </div>
    {/if}
  </Modal>
{/if}

<style lang="scss">
  @use '../../themes/mixins/overlay';

  .content {
    @include overlay.content;
  }

  button:first-of-type {
    margin-right: 0.45rem;
  }
</style>
