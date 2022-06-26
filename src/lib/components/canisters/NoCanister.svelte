<script lang="ts">
  import {emitAddCanister} from '../../utils/events.utils';
</script>

<p>
  No canisters to watch for. <button class="text" on:click={emitAddCanister}>Add one</button> to your watchlist
  to get started!
</p>
