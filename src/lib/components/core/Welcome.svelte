<script>
  import AddCanister from '../canisters/AddCanister.svelte';
  import IconJuno from '$lib/components/icons/IconJuno.svelte';
</script>

<section>
  <p>
    <strong>Cycles.watch</strong> monitors the cycles consumption of canister smart contracts on the
    <a href="https://internetcomputer.org/" rel="external noopener norefferer" target="_blank"
      >Internet Computer</a>
    blockchain. It periodically refreshes their state and provides information on their remaining resources.
  </p>

  <p>
    This tool is used anonymously and its settings are saved in a <a
      href="https://juno.build/"
      rel="external noopener norefferer"
      target="_blank">Juno "Satellite"</a>
    <IconJuno />.
  </p>

  <p>
    Notifications are optional and generated locally. Note that unlike push notifications, these are
    only generated if the dapp is open on your device, regardless of whether it's active, idle, or
    in the background.
  </p>

  <div class="actions">
    <AddCanister display="inline" />
  </div>
</section>

<style lang="scss">
  .actions {
    width: 100%;

    padding: 0.45rem 0;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  small {
    vertical-align: middle;
    font-size: var(--font-size-very-small);
  }
</style>
