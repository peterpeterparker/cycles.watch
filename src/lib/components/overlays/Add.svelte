<script lang="ts">
  import Controller from '../canisters/Controller.svelte';
  import CanisterId from '../canisters/CanisterId.svelte';
  import {fly} from 'svelte/transition';
  import Modal from '../ui/Modal.svelte';
  import CanisterType from '../canisters/CanisterType.svelte';
  import {authSignedInStore} from '../../stores/auth.store';
  import CanisterSignIn from '../canisters/CanisterSignIn.svelte';

  let open = false;

  let step: 'type' | 'auth' | 'whats-ii' | 'controller' | 'canister_id' | 'canister_root_id' =
    'type';

  const onClose = () => {
    open = false;
    step = 'type';
  };

  const onBack = () => {
    switch (step) {
      case 'canister_id':
        step = 'controller';
        break;
      case 'whats-ii':
        step = 'auth';
        break;
      default:
        step = 'type';
        break;
    }
  };

  let back = false;
  $: back = step !== 'type';

  let title = true;
  $: title = step !== 'whats-ii';
</script>

<svelte:window on:openAddCanister={() => (open = true)} />

{#if open}
  <Modal on:papyClose={onClose} on:papyBack={onBack} {back}>
    {#if title}
      <h3>Add a canister</h3>
    {/if}

    {#if step === 'type'}
      <div in:fly={{x: 200, duration: 200}}>
        <CanisterType
          on:papyCancel={onClose}
          on:papyAddCanister={() => (step = $authSignedInStore ? 'controller' : 'auth')}
          on:papyAddSns={() => (step = 'canister_root_id')} />
      </div>
    {:else if step === 'auth'}
      <div in:fly={{x: 200, duration: 200}}>
        <CanisterSignIn
          on:papyCanisterSignedIn={() => (step = 'controller')}
          on:papyOpenWhatsII={() => (step = 'whats-ii')} />
      </div>
    {:else if step === 'whats-ii'}
      <div in:fly={{x: 200, duration: 200}}>
        <what-is-ii />
      </div>
    {:else if step === 'controller'}
      <div in:fly={{x: 200, duration: 200}}>
        <Controller on:papyNext={() => (step = 'canister_id')} />
      </div>
    {:else if step === 'canister_id'}
      <div in:fly={{x: 200, duration: 200}}>
        <CanisterId on:papyDone={onClose} />
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
