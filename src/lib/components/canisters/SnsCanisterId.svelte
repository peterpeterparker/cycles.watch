<script lang="ts">
  import {addSnsCanister} from '../../services/watch.services';
  import CanisterId from './CanisterId.svelte';
</script>

<CanisterId add={addSnsCanister} placeholder="Root canister ID" on:papyDone>
  <p>
    Insert the <strong>root</strong> canister ID of the SNS project you wish to observe and hit "Add".
    Cycles.watch will discover and map all the canisters that need to be observed.
  </p>
</CanisterId>

<style lang="scss">
  @use '../../themes/mixins/canister';

  @include canister.paragraph;
</style>
