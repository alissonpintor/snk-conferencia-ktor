<script lang="ts">
    import type { HTMLBaseAttributes } from "svelte/elements";
    import { InputLabel } from "$components/input/input-field";
    import { Search } from '@lucide/svelte';

    let { children }: HTMLBaseAttributes = $props();
</script>

<InputLabel>
    <Search />
    {@render children?.()}
</InputLabel>