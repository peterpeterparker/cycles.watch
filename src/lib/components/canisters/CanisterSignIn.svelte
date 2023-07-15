<script lang="ts">
  import {authSignedInStore} from '../../stores/auth.store';
  import {createEventDispatcher} from 'svelte';
  import SignIn from '../core/SignIn.svelte';

  const dispatch = createEventDispatcher();

  $: $authSignedInStore,
    (() => {
      if (!$authSignedInStore) {
        return;
      }

      dispatch('papyCanisterSignedIn');
    })();
</script>

<p>
  To add a canister to your watchlist, your principal ID on <strong>Cycles.watch</strong> must be one
  its controller because querying the state of smart contracts is not public on the Internet Computer.
</p>

<p>That is why, to get started, you first need to sign-in anonymously.</p>

<SignIn />

<style lang="scss">
  p:first-of-type {
    margin-top: 1.25rem;
  }
</style>
