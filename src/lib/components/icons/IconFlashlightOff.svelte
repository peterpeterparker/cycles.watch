<!-- https://fonts.google.com/icons?selected=Material%20Symbols%20Rounded%3Aflashlight_off%3AFILL%400%3Bwght%40400%3BGRAD%400%3Bopsz%4024 -->
<script lang="ts">
	export let size: 'default' | 'small' = 'default';

	let applySize: number | string;
	$: applySize = size === 'default' ? 24 : '1rem';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 -960 960 960"
	width={applySize}
	height={applySize}
	fill="currentColor"
	><path
		d="M820-84q-11 11-28 11t-28-11L640-208v48q0 33-23.5 56.5T560-80H400q-33 0-56.5-23.5T320-160v-368L84-764q-11-11-11-28t11-28q11-11 28-11t28 11l680 680q11 11 11 28t-11 28ZM400-448v288h160v-128L400-448Zm240 14-80-80v-30l80-120v-16H394l-80-80h326v-40H274l-29-29q9-23 29-37t46-14h320q33 0 56.5 23.5T720-800v160l-80 120v86Zm-160 66Zm0-226Z"
	/></svg
>
