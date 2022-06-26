<script lang="ts">
  import IconBack from '$lib/components/icons/IconBack.svelte';
  import {back} from '$lib/utils/nav.utils';
</script>

<nav>
  <button class="toolbar" on:click={async () => await back()} title="Back">
    <IconBack slot="icon" />
    <span class="visually-hidden">Back</span>
  </button>
</nav>
