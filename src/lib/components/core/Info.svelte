<script lang="ts">
  import Popover from '../ui/Popover.svelte';
  import IconPapyrs from '../icons/IconPapyrs.svelte';
  import IconEmoji from '../icons/IconEmoji.svelte';
  import IconInfo from '../icons/IconInfo.svelte';

  let visible: boolean | undefined;
  let button: HTMLButtonElement | undefined;
</script>

<button class="toolbar" on:click={() => (visible = true)} bind:this={button} title="Open for some information">
  <IconInfo slot="icon" />
  <span class="visually-hidden">Information</span>
</button>

<Popover bind:visible anchor={button} direction="rtl">
  <a
    aria-label="Blog on web3 with Papyrs"
    href="https://papy.rs"
    class="menu"
    aria-haspopup="menu"
    rel="noopener norefferer">
    <IconPapyrs />
    <span>Blog on Papyrs</span>
  </a>

  <a
    aria-label="Made by David Dal Busco"
    href="https://daviddalbusco.com"
    class="menu"
    aria-haspopup="menu"
    rel="noopener norefferer">
    <IconEmoji />
    <span>Made by David</span>
  </a>
</Popover>
