<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Button from '../ui/Button.svelte';
  import IconCube from '../icons/IconCube.svelte';
  import IconHub from '../icons/IconHub.svelte';

  const dispatch = createEventDispatcher();
</script>

<p>
  Cycles.watch can either tracks canister smart contracts or Service Nervous System (SNS) projects.
  What type to add?
</p>

<div class="type">
  <Button
    icon={IconCube}
    display="inline"
    text="Canister smart contract"
    on:click={() => dispatch('papyAddCanister')} />

  <Button
    icon={IconHub}
    display="inline"
    text="Service Nervous System (SNS)"
    on:click={() => dispatch('papyAddSns')} />
</div>

<style lang="scss">
  p:first-of-type {
    margin-top: 1.25rem;
  }

  .type {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: calc(2 * var(--padding));
  }
</style>
