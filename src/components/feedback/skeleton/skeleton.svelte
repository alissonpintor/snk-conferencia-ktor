<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    let { class: className = "", ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={"skeleton " + className} {...rest}></div>