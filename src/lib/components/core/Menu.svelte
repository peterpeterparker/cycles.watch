<script lang="ts">
  import IconMenu from '../icons/IconMenu.svelte';
  import Popover from '../ui/Popover.svelte';
  import IconSignOut from '../icons/IconSignOut.svelte';
  import IconSignIn from '../icons/IconSignIn.svelte';
  import {authSignedInStore, authStore} from '../../stores/auth.store';
  import IconPlus from '../icons/IconPlus.svelte';
  import {emit} from '../../utils/events.utils';
  import IconGitHub from '../icons/IconGitHub.svelte';

  let visible: boolean | undefined;
  let button: HTMLButtonElement | undefined;

  const close = () => (visible = false);

  const onAction = async (callback: () => Promise<void>) => {
    close();

    await callback();
  };

  const signIn = async () => await authStore.signIn();
  const signOut = async () => await authStore.signOut();
  const add = async () => emit<void>({message: 'openAddCanister'});
</script>

<button class="toolbar" on:click={() => (visible = true)} bind:this={button}>
  <IconMenu slot="icon" />
  <span class="visually-hidden">Menu</span>
</button>

<Popover bind:visible anchor={button}>
  {#if $authSignedInStore}
    <button
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      class="menu"
      on:click={async () => await onAction(add)}>
      <IconPlus />
      <span>Add canister</span>
    </button>

    <button
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      on:click={async () => await onAction(signOut)}
      class="menu">
      <IconSignOut />
      <span>Sign out</span>
    </button>
  {:else}
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

  <hr />

  <a
    aria-label="Cycles.watch in open source - Repo on GitHub"
    href="https://github.com/papyrs/cycles.watch"
    class="menu"
    aria-haspopup="menu"
    rel="external noopener norefferer">
    <IconGitHub />
    <span>GitHub</span>
  </a>
</Popover>

<style lang="scss">
  hr {
    width: 80%;
    margin: 0.45rem auto;
    background: var(--color-theme);
  }
</style>
