<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";
    let { children, class: className, ...restProps }: HTMLButtonAttributes = $props();
</script>

<button 
    class={"btn " + (className || "")}
    {...restProps}
>
    {@render children?.()}
</button>