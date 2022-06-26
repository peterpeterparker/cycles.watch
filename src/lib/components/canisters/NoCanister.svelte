<script lang="ts">
  import {emitAddCanister} from '../../utils/events.utils';
  import AddCanister from "./AddCanister.svelte";
</script>

<p>
  No canisters to watch for. <button class="text" on:click={emitAddCanister}>Add one</button> to your watchlist
  to get started!
  <AddCanister display="inline" />
</p>

<style lang="scss">
  button {
    display: inline-block;
    margin: var(--padding) 0;
  }
</style>
