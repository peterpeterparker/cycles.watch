<!-- https://fonts.google.com/icons?selected=Material%20Symbols%20Rounded%3Ahighlight%3AFILL%400%3Bwght%40400%3BGRAD%400%3Bopsz%4024 -->
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
		d="m198-667-29-29q-13-12-13.5-28t12.5-28q12-12 28.5-12.5T225-753l29 29q11 11 11.5 27.5T254-668q-11 11-27.5 11.5T198-667Zm282-93q-17 0-28.5-11.5T440-800v-40q0-17 11.5-28.5T480-880q17 0 28.5 11.5T520-840v40q0 17-11.5 28.5T480-760Zm228 93q-12-12-12-29t12-29l28-28q11-11 27.5-11t28.5 12q11 11 11 28t-11 28l-28 28q-12 12-28 12.5T708-667ZM440-80q-33 0-56.5-23.5T360-160v-120l-97-97q-11-11-17-25.5t-6-30.5v-127q0-17 11.5-28.5T280-600h400q17 0 28.5 11.5T720-560v127q0 16-6 30.5T697-377l-97 97v120q0 33-23.5 56.5T520-80h-80Zm0-80h80v-153l120-120v-87H320v87l120 120v153Zm40-180Z"
	/></svg
>
