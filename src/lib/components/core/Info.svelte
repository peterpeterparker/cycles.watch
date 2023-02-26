<script lang="ts">
  import Popover from '../ui/Popover.svelte';
  import IconJuno from '../icons/IconJuno.svelte';
  import IconInfo from '../icons/IconInfo.svelte';
  import IconGitHub from '../icons/IconGitHub.svelte';

  let visible: boolean | undefined;
  let button: HTMLButtonElement | undefined;
</script>

<button
  class="toolbar"
  on:click={() => (visible = true)}
  bind:this={button}
  title="Open for some information">
  <IconInfo slot="icon" />
  <span class="visually-hidden">Information</span>
</button>

<Popover bind:visible anchor={button} direction="rtl">
  <a
    aria-label="Cycles.watch in open source - Repo on GitHub"
    href="https://github.com/peterpeterparker/cycles.watch"
    class="menu"
    aria-haspopup="menu"
    rel="external noopener norefferer">
    <IconGitHub />
    <span>GitHub</span>
  </a>

  <a
    aria-label="Developed and deploy with Juno.build"
    href="https://juno.build"
    class="menu"
    aria-haspopup="menu"
    rel="noopener norefferer">
    <IconJuno />
    <span>Build with Juno</span>
  </a>
</Popover>
