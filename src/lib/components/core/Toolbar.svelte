<script lang="ts">
  import Menu from './Menu.svelte';
  import GitHub from './GitHub.svelte';
</script>

<nav>
  <Menu />

  <GitHub />
</nav>

<style lang="scss">
  nav {
    display: flex;
    justify-content: space-between;
  }
</style>
