<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    let { class: className = "", ...rest }: HTMLAttributes<HTMLSpanElement> = $props();
</script>

<span class={"loading loading-dots loading-md " + className} {...rest}></span>