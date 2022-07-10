<script lang="ts">
  import {authStore} from '../../stores/auth.store';
  import IconInternetComputer from '../icons/IconInternetComputer.svelte';
  import WhatsII from '../overlays/WhatsII.svelte';

  const signIn = async () => await authStore.signIn();
</script>

<section>
  <p>
    <strong>Cycles.watch</strong> tracks the cycles' consumption of canister smart contracts
    <small
      >(on the
      <a href="https://internetcomputer.org/" rel="external noopener norefferer"
        >Internet Computer</a
      >)</small
    >. It refreshes periodically their state and notifies you when they are about to get out of
    resources.
  </p>

  <p>
    Its usage is anonymous and settings are saved offline - i.e. in your browser <small>
      (<a
        href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
        rel="external noopener norefferer">IndexedDB API</a
      >)</small
    >.
  </p>

  <p>
    Notifications are optional and thrown locally <small
      >(<a
        href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API"
        rel="external noopener norefferer">Notifications API</a
      >)</small
    >. Please note that on the contrary to "Push Notifications", these are emitted only if the dapp
    is opened on your device (regardless if active, idle or in the background).
  </p>

  <div class="actions">
    <button type="button" on:click={signIn} class="primary">
      <IconInternetComputer />
      Sign in with Internet Identity
    </button>

    <WhatsII />
  </div>
</section>

<style lang="scss">
  .actions {
    width: 100%;

    padding: 0.45rem 0;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  small {
    vertical-align: middle;
    font-size: var(--font-size-very-small);
  }
</style>
