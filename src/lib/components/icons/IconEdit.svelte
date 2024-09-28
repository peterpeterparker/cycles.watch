<!-- https://fonts.google.com/icons?selected=Material%20Symbols%20Rounded%3Aedit%3AFILL%400%3Bwght%40400%3BGRAD%400%3Bopsz%4024 -->
<script lang="ts">
	export let size: 'default' | 'small' = 'default';

	let applySize: number | string;
	$: applySize = size === 'default' ? 24 : '1rem';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 -960 960 960"
	height={applySize}
	width={applySize}
	fill="currentColor"
	><path
		d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829-660l-57 57ZM160-120q-17 0-28.5-11.5T120-160v-113q0-8 3-15.5t9-13.5l412-412 170 170-412 412q-6 6-13.5 9t-15.5 3H160Zm413-453-28-28 56 56-28-28Z"
	/></svg
>
