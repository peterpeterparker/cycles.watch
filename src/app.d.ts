/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

declare const VITE_APP_VERSION: string;

// eslint window checks for custom events
declare namespace svelteHTML {
	interface HTMLAttributes {
		'on:submit'?: (event: CustomEvent) => void;
		'on:openAddCanister'?: (event: CustomEvent) => void;
		'on:addCanister'?: (event: CustomEvent) => void;
	}
}

/* eslint-enable */
