<script lang="ts">
	import IconMenu from '$lib/components/icons/IconMenu.svelte';
	import Popover from '$lib/components/ui/Popover.svelte';
	import IconSignOut from '$lib/components/icons/IconSignOut.svelte';
	import { authSignedInStore } from '$lib/stores/auth.store';
	import IconSettings from '$lib/components/icons/IconSettings.svelte';
	import IconPlus from '$lib/components/icons/IconPlus.svelte';
	import { emit, emitAddCanister } from '$lib/utils/events.utils';
	import GitHub from '$lib/components/core/GitHub.svelte';
	import IconInternetComputer from '$lib/components/icons/IconInternetComputer.svelte';
	import IconPasskey from '$lib/components/icons/IconPasskey.svelte';
	import PasskeyGuard from '$lib/components/passkeys/PasskeyGuard.svelte';
	import { signInWithII } from '$lib/services/auth.services';
	import { goto } from '$app/navigation';
	import { clear } from '$lib/services/idb.services';
	import { signOut } from '@junobuild/core';

	let visible: boolean | undefined;
	let button: HTMLButtonElement | undefined;

	const close = () => (visible = false);

	const onAction = async (callback: () => Promise<void>) => {
		close();

		await callback();
	};

	const loginWithPasskey = async () => emit({ message: 'continueWithPasskey' });

	const logout = async () => {
		await clear();
		await signOut();
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

<Popover bind:visible anchor={button}>
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

	<hr />

	<GitHub />

	<hr />

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
	{:else}
		<PasskeyGuard>
			<button
				type="button"
				role="menuitem"
				aria-haspopup="menu"
				on:click={async () => await onAction(loginWithPasskey)}
				class="menu"
			>
				<IconPasskey />
				<span>Continue with Passkey</span>
			</button>
		</PasskeyGuard>

		<button
			type="button"
			role="menuitem"
			aria-haspopup="menu"
			on:click={async () => await onAction(signInWithII)}
			class="menu"
		>
			<IconInternetComputer />
			<span>Continue with II</span>
		</button>
	{/if}
</Popover>

<style lang="scss">
	hr {
		border: 0;
		height: 1px;
		width: 100%;
		background: black;
		margin: 0.45rem auto;
	}
</style>
