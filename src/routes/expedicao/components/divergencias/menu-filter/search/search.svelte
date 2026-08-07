<script lang="ts">
    import type { HTMLBaseAttributes } from "svelte/elements";
    import { InputLabel } from "$components/input/input-field";
    import { Search } from '@lucide/svelte';
    import { SearchState } from './state.svelte';

    interface SearchProps {
        props: SearchState;
    }

    let { props, children }: SearchProps & HTMLBaseAttributes = $props();
</script>

<InputLabel>
    <Search />
    {@render children?.()}
</InputLabel>