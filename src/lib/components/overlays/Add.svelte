<script lang="ts">
  import Controller from '../canisters/Controller.svelte';
  import CanisterId from '../canisters/CanisterId.svelte';
  import {fly} from 'svelte/transition';
  import Modal from '../ui/Modal.svelte';
  import CanisterType from '../canisters/CanisterType.svelte';
  import {authSignedInStore} from "../../stores/auth.store";
  import CanisterSignIn from "../canisters/CanisterSignIn.svelte";

  let open = false;

  let step: 'type' | 'auth' | 'controller' | 'canister_id' | 'canister_root_id' = 'type';

  const close = () => {
    open = false;
    step = 'type';
  };
</script>

<svelte:window on:openAddCanister={() => (open = true)} />

{#if open}
  <Modal on:papyClose={close}>
    <h3>Add a canister</h3>

    {#if step === 'type'}
      <div in:fly={{x: 200, duration: 200}}>
        <CanisterType
          on:papyCancel={close}
          on:papyAddCanister={() => (step = $authSignedInStore ? 'controller' : 'auth')}
          on:papyAddSns={() => (step = 'canister_root_id')} />
      </div>
    {:else if step === 'auth'}
      <div in:fly={{x: 200, duration: 200}}>
        <CanisterSignIn on:papyCanisterSignedIn={() => (step = 'controller')} />
      </div>
    {:else if step === 'controller'}
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
