<script lang="ts">
  import {authStore} from '../lib/stores/auth.store';
  import {browser} from '$app/env';

  import '$lib/themes/font-faces.scss';
  import '$lib/themes/fonts.scss';
  import '$lib/themes/theme.scss';
  import '$lib/themes/body.scss';
  import '$lib/themes/variables.scss';
  import '$lib/themes/button.scss';
  import '$lib/themes/link.scss';
  import '$lib/themes/main.scss';
  import '$lib/themes/input.scss';

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
</script>

<svelte:window on:storage={syncAuthStore} />

{#await syncAuthStore()}
  <!-- TODO spinner -->
{:then}
  <slot />
{/await}
