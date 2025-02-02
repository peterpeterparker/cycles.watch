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
	import { onMount } from 'svelte';
	import Busy from '$lib/components/ui/Busy.svelte';
	import { initSatellite } from '@junobuild/core';
	import { CONTAINER, SATELLITE_ID } from '$lib/constants/constants';
	import Toasts from '$lib/components/ui/Toasts.svelte';

	onMount(async () => {
		await initSatellite({
			satelliteId: SATELLITE_ID,
			container: CONTAINER
		});
	});
</script>

<Worker>
	<slot />
</Worker>

<Add />
<Busy />
<Toasts />
