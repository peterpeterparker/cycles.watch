<script lang="ts">
  import Menu from './Menu.svelte';
  import Info from './Info.svelte';
  import {canistersInitialized} from '../../stores/canisters.store';
</script>

<nav class:ready={$canistersInitialized}>
  {#if $canistersInitialized}
    <Menu />
  {/if}

  <Info />
</nav>

<style lang="scss">
  nav {
    display: flex;
    justify-content: flex-end;
  }

  .ready {

  }
</style>
