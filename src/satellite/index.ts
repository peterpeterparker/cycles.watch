import {defineHook, type OnSetDoc} from "@junobuild/functions";

export const onSetDoc = defineHook<OnSetDoc>({
    collections: ["request"],
    run: () => {
        console.log('Hello World!!!');
    }
})