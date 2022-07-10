<script lang="ts">
  import {authStore} from '../../stores/auth.store';
  import IconInternetComputer from '../icons/IconInternetComputer.svelte';
  import WhatsII from '../overlays/WhatsII.svelte';

  const signIn = async () => await authStore.signIn();
</script>

<div class="actions">
  <button type="button" on:click={signIn} class="primary">
    <IconInternetComputer />
    Sign in with Internet Identity
  </button>

  <WhatsII />
</div>

<style lang="scss">
  .actions {
    padding: 0.45rem 0;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
