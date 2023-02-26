<script lang="ts">
  import {authStore} from '$lib/stores/auth.store';
  import {browser} from '$app/environment';

  import '$lib/themes/font-faces.scss';
  import '$lib/themes/fonts.scss';
  import '$lib/themes/theme.scss';
  import '$lib/themes/body.scss';
  import '$lib/themes/variables.scss';
  import '$lib/themes/button.scss';
  import '$lib/themes/link.scss';
  import '$lib/themes/main.scss';
  import '$lib/themes/input.scss';
  import Worker from '$lib/components/core/Worker.svelte';
  import Add from '$lib/components/overlays/Add.svelte';
  import {onMount} from "svelte";
  import {initJuno} from "@junobuild/core";

  const syncAuthStore = async () => {
    if (!browser) {
      return;
    }

    try {
      await authStore.sync();
    } catch (err) {
      console.error(err);
    }
  };

  onMount(async () => {
    await initJuno({
      satelliteId: "ck4tp-3iaaa-aaaal-ab7da-cai",
    });
  })
</script>

<svelte:window on:storage={syncAuthStore} />

{#await syncAuthStore()}
  <!-- TODO spinner -->
{:then}
  <Worker>
    <slot />
  </Worker>

  <Add />
{/await}
