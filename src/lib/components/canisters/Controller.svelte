<script lang="ts">
  import {authStore} from '../../stores/auth.store';
  import {createEventDispatcher} from 'svelte';
  import Copy from '../ui/Copy.svelte';

  const dispatch = createEventDispatcher();

  let principalId = '';
  $: principalId = $authStore.identity?.getPrincipal()?.toText() ?? '';
</script>

<p>
  To add a canister to your watchlist, your principal ID on <strong>Cycles.watch</strong> must be one
  its controller because querying the state of smart contracts is not public on the Internet Computer.
</p>

<p>
  Add following principal ID to the controllers with <a
    href="https://internetcomputer.org/docs/current/references/cli-reference/dfx-parent/"
    rel="external noopener norefferer"
    target="_blank"
    aria-label="dfx command line tool">dfx</a>
  or
  <a
    href="https://nns.ic0.app/#/canisters"
    rel="external noopener norefferer"
    target="_blank"
    aria-label="Open the Network Nervous System frontend dapp">NNS dapp</a
  >.
</p>

<p>
  <strong aria-label="Your principal ID">{principalId}</strong>
  <Copy value={principalId} ariaLabel="Copy principal ID to clipboard" />
</p>

<button type="button" on:click|stopPropagation={() => dispatch('papyCancel')}> Cancel </button>

<button type="button" on:click|stopPropagation={() => dispatch('papyNext')}> Next </button>

<style lang="scss">
  p:first-of-type {
    margin-top: 1.25rem;
  }
</style>
