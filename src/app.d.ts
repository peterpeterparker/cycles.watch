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

/* eslint-disable */

declare namespace svelteHTML {
	interface HTMLAttributes {
		onopenAddCanister?: (event: CustomEvent<any>) => void;
		onaddCanister?: (event: CustomEvent<any>) => void;
		onaddSnsCanister?: (event: CustomEvent<any>) => void;
		onrestartTimer?: (event: CustomEvent<any>) => void;
	}
}

/* eslint-enable */
