<script lang="ts">
	import IconEdit from '$lib/components/icons/IconEdit.svelte';
	import Popover from '$lib/components/ui/Popover.svelte';
	import type { Canister, CanisterMeta } from '$lib/types/canister';
	import { addSnsCanister, addCanister } from '$lib/services/watch.services';

	export let canister: Canister;

	let meta: CanisterMeta;
	$: ({ meta } = canister);

	let visible: boolean | undefined;
	let canisterName: string | undefined = canister.meta?.name;

	let validConfirm = false;
	let saving = false;

	const handleSubmit = async ($event: SubmitEvent) => {
		$event.preventDefault();

		if (!validConfirm || canisterName === undefined || canisterName === '') {
			return;
		}

		saving = true;

		try {
			const add = canister.group?.type === 'sns' ? addSnsCanister : addCanister;
			await add({
				...meta,
				name: canisterName
			});
		} catch (err: unknown) {
			console.error(err);
		}
	};

	$: validConfirm = canisterName !== undefined && canisterName !== '';
</script>

<button
	onclick={($event) => {
		$event.stopPropagation();
		visible = true;
	}}
	aria-label="Edit"
	class="toolbar small"
>
	<IconEdit size="small" />
</button>

<Popover bind:visible center>
	<form class="container" onsubmit={handleSubmit}>
		<label for="canisterName">Canister name</label>

		<input
			id="canisterName"
			bind:value={canisterName}
			type="text"
			placeholder="A shortname for hint"
			maxlength={64}
			disabled={saving}
		/>

		<div class="toolbar">
			<button type="submit" disabled={saving || !validConfirm}> Save </button>
		</div>
	</form>
</Popover>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		padding: 1rem 1.75rem 0;
	}

	label {
		font-weight: bold;
		margin: 0;
	}

	.toolbar {
		display: flex;
		justify-content: center;
		margin: 0.45rem 0.15rem;
	}

	button {
		margin: 0;
	}
</style>
