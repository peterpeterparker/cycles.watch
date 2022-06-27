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
declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        onsubmit?: (event: any) => any;
        onopenAddCanister?: (event: any) => any;
        onaddCanister?: (event: any) => any;
    }
}

/* eslint-enable */
