<script lang="ts">
  import {authStore} from '$lib/stores/auth.store';
  import {createEventDispatcher} from 'svelte';
  import Copy from '$lib/ui/Copy.svelte';

  const dispatch = createEventDispatcher();

  let principalId = '';
  $: principalId = $authStore.user?.key ?? '';
</script>

<p>
  Add following principal ID to the controllers of the canister with <a
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

<div class="actions">
  <button type="button" on:click|stopPropagation={() => dispatch('papyNext')}> Done </button>
</div>

<style lang="scss">
  @use '../../themes/mixins/canister';

  @include canister.overlay;
</style>
