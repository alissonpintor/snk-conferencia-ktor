<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    let { class: className = "", ...rest }: HTMLAttributes<HTMLSpanElement> = $props();
</script>

<span class={"loading loading-spinner loading-md " + className} {...rest}></span>