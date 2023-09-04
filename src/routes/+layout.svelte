<script lang="ts">
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
  import {onMount} from 'svelte';
  import Busy from '$lib/components/ui/Busy.svelte';
  import {initAnalytics, initJuno} from "$lib/services/init.services";

  onMount(
    async () =>
      await Promise.all([
        initJuno(),
        initAnalytics()
      ])
  );
</script>

<Worker>
  <slot />
</Worker>

<Add />
<Busy />
