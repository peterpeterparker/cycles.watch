<script lang="ts">
	import IconMenu from '$lib/components/icons/IconMenu.svelte';
	import Popover from '$lib/components/ui/Popover.svelte';
	import IconSignOut from '$lib/components/icons/IconSignOut.svelte';
	import IconSignIn from '$lib/components/icons/IconSignIn.svelte';
	import { authSignedInStore } from '$lib/stores/auth.store';
	import IconSettings from '$lib/components/icons/IconSettings.svelte';
	import { goto } from '$app/navigation';
	import { canistersStore } from '$lib/stores/canisters.store';
	import { signOut } from '@junobuild/core';
	import { clear } from 'idb-keyval';
	import IconPlus from '$lib/components/icons/IconPlus.svelte';
	import { emitAddCanister } from '$lib/utils/events.utils';
	import GitHub from '$lib/components/core/GitHub.svelte';
	import { signInWithII } from '$lib/services/auth.services';

	let visible: boolean | undefined;
	let button: HTMLButtonElement | undefined;

	const close = () => (visible = false);

	const onAction = async (callback: () => Promise<void>) => {
		close();

		await callback();
	};

	const logout = async () => {
		await clear();
		await signOut();

		window.location.reload();
	};

	// eslint-disable-next-line svelte/no-navigation-without-resolve
	const goToSettings = async () => await goto('/settings');
</script>

<button
	class="toolbar"
	on:click={() => (visible = true)}
	bind:this={button}
	title="Open to access more features"
>
	<IconMenu />
	<span class="visually-hidden">Menu</span>
</button>

<Popover bind:visible anchor={button} direction="rtl">
	{#if $authSignedInStore}
		<button
			type="button"
			role="menuitem"
			aria-haspopup="menu"
			on:click={emitAddCanister}
			class="menu"
		>
			<IconPlus />
			<span>Add a canister</span>
		</button>
	{/if}

	<button type="button" role="menuitem" aria-haspopup="menu" class="menu" on:click={goToSettings}>
		<IconSettings />
		<span>Settings</span>
	</button>

	<GitHub />

	{#if $authSignedInStore}
		<button
			type="button"
			role="menuitem"
			aria-haspopup="menu"
			on:click={async () => await onAction(logout)}
			class="menu"
		>
			<IconSignOut />
			<span>Sign out</span>
		</button>
	{:else if $canistersStore.initialized}
		<button type="button" role="menuitem" aria-haspopup="menu" on:click={signInWithII} class="menu">
			<IconSignIn />
			<span>Sign in</span>
		</button>
	{/if}
</Popover>
