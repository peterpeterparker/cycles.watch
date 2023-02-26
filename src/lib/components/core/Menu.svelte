<script lang="ts">
  import IconMenu from '$lib/components/icons/IconMenu.svelte';
  import Popover from '$lib/components/ui/Popover.svelte';
  import IconSignOut from '$lib/components/icons/IconSignOut.svelte';
  import IconSignIn from '$lib/components/icons/IconSignIn.svelte';
  import {authSignedInStore} from '$lib/stores/auth.store';
  import IconSettings from '$lib/components/icons/IconSettings.svelte';
  import {goto} from '$app/navigation';
  import {canistersStore} from '$lib/stores/canisters.store';
  import {signIn, signOut} from '@junobuild/core';
  import {clear} from 'idb-keyval';

  let visible: boolean | undefined;
  let button: HTMLButtonElement | undefined;

  const close = () => (visible = false);

  const onAction = async (callback: () => Promise<void>) => {
    close();

    await callback();
  };

  const logout = async () => {
    await clear();
    await signOut();
  };
</script>

<button
  class="toolbar"
  on:click={() => (visible = true)}
  bind:this={button}
  title="Open to access more features">
  <IconMenu slot="icon" />
  <span class="visually-hidden">Menu</span>
</button>

<Popover bind:visible anchor={button}>
  <button
    type="button"
    role="menuitem"
    aria-haspopup="menu"
    class="menu"
    on:click={async () => await goto('/settings')}>
    <IconSettings />
    <span>Settings</span>
  </button>

  {#if $authSignedInStore}
    <button
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      on:click={async () => await onAction(logout)}
      class="menu">
      <IconSignOut />
      <span>Sign out</span>
    </button>
  {:else if $canistersStore.initialized}
    <button
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      on:click={async () => await onAction(signIn)}
      class="menu">
      <IconSignIn />
      <span>Sign in</span>
    </button>
  {/if}
</Popover>

<style lang="scss">
  hr {
    width: 80%;
    margin: 0.45rem auto;
    background: var(--color-theme);
  }
</style>
