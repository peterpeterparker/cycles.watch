declare module 'svelte/elements' {
	export interface HTMLAttributes<T> {
		onopenAddCanister?: (event: CustomEvent<any>) => void;
		onaddCanister?: (event: CustomEvent<any>) => void;
		onaddSnsCanister?: (event: CustomEvent<any>) => void;
		onrestartTimer?: (event: CustomEvent<any>) => void;
	}
}

export {};
