<script lang="ts">
  import Menu from './Menu.svelte';
  import Info from './Info.svelte';
</script>

<nav>
  <Menu />

  <Info />
</nav>

<style lang="scss">
  nav {
    display: flex;
    justify-content: space-between;
  }
</style>
