<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Button from '../ui/Button.svelte';

  const dispatch = createEventDispatcher();
</script>

<p>
  Cycles.watch can either tracks canister smart contracts or Service Nervous System (SNS) projects.
  What type to add?
</p>

<div class="actions">
  <Button
    display="inline"
    text="Canister smart contract"
    on:click={() => dispatch('papyAddCanister')} />

  <Button
    display="inline"
    text="Service Nervous System (SNS)"
    on:click={() => dispatch('papyAddSns')} />
</div>

<style lang="scss">
  @use '../../themes/mixins/canister';

  @include canister.overlay;

  .actions {
    flex-direction: column;
    padding: 0.45rem 0 0;

    :global(button) {
      width: 100%;
      height: 54px;
    }

    :global(div.inline) {
      width: 100%;
      margin: 0;

      @media (min-width: 768px) {
        width: 320px;
      }
    }
  }
</style>
