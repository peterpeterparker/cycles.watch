<!-- source: https://fonts.google.com/icons?selected=Material%20Icons%20Outlined%3Amove_up%3A -->
<script lang="ts">
	interface Props {
		size?: 'default' | 'small';
	}

	let { size = 'default' }: Props = $props();

	let applySize = $derived(size === 'default' ? 24 : '1rem');
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	height={applySize}
	width={applySize}
	fill="currentColor"
	viewBox="0 0 24 24"
	><path d="M0 0h24v24H0V0z" fill="none" /><path
		d="M5 4h14v2H5zm0 10h4v6h6v-6h4l-7-7-7 7zm8-2v6h-2v-6H9.83L12 9.83 14.17 12H13z"
	/></svg
>
