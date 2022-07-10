<script lang="ts">
  import {authStore} from '../../stores/auth.store';
  import IconInternetComputer from '../icons/IconInternetComputer.svelte';
  import WhatsII from '../overlays/WhatsII.svelte';
  import {emitOpenWhatsII} from "../../utils/events.utils";

  const signIn = async () => await authStore.signIn();
</script>

<div class="actions">
  <button type="button" on:click={signIn} class="primary">
    <IconInternetComputer />
    Sign in with Internet Identity
  </button>

  <button type="button" class="text" on:click={emitOpenWhatsII}>What's Internet Identity?</button>
</div>

<style lang="scss">
  .actions {
    padding: 0.45rem 0;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .text {
    font-size: var(--font-size-ultra-small);
  }
</style>
