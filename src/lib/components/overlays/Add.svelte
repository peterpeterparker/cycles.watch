<script lang="ts">
	import Controller from '../canisters/Controller.svelte';
	import { fly } from 'svelte/transition';
	import Modal from '../ui/Modal.svelte';
	import CanisterType from '../canisters/CanisterType.svelte';
	import { authSignedInStore } from '../../stores/auth.store';
	import CanisterSignIn from '../canisters/CanisterSignIn.svelte';
	import NnsCanisterId from '../canisters/NnsCanisterId.svelte';
	import SnsCanisterId from '../canisters/SnsCanisterId.svelte';

	let open = false;

	let step: 'type' | 'auth' | 'controller' | 'canister_id' | 'canister_root_id' = 'type';

	const onClose = () => {
		open = false;
		step = 'type';
	};

	const onBack = () => {
		switch (step) {
			case 'canister_id':
				step = 'controller';
				break;
			default:
				step = 'type';
				break;
		}
	};

	let back = false;
	$: back = step !== 'type';
</script>

<svelte:window onopenAddCanister={() => (open = true)} />

{#if open}
	<Modal on:papyClose={onClose} on:papyBack={onBack} {back}>
		<h3>Add a canister</h3>

		{#if step === 'type'}
			<div in:fly={{ x: 200, duration: 200 }}>
				<CanisterType
					on:papyCancel={onClose}
					on:papyAddCanister={() => (step = $authSignedInStore ? 'controller' : 'auth')}
					on:papyAddSns={() => (step = 'canister_root_id')}
				/>
			</div>
		{:else if step === 'auth'}
			<div in:fly={{ x: 200, duration: 200 }}>
				<CanisterSignIn on:papyCanisterSignedIn={() => (step = 'controller')} />
			</div>
		{:else if step === 'controller'}
			<div in:fly={{ x: 200, duration: 200 }}>
				<Controller on:papyNext={() => (step = 'canister_id')} />
			</div>
		{:else if step === 'canister_root_id'}
			<div in:fly={{ x: 200, duration: 200 }}>
				<SnsCanisterId on:papyDone={onClose} />
			</div>
		{:else if step === 'canister_id'}
			<div in:fly={{ x: 200, duration: 200 }}>
				<NnsCanisterId on:papyDone={onClose} />
			</div>
		{/if}
	</Modal>
{/if}

<style lang="scss">
	@use '../../themes/mixins/overlay';

	.content {
		@include overlay.content;
	}

	button:first-of-type {
		margin-right: 0.45rem;
	}
</style>
