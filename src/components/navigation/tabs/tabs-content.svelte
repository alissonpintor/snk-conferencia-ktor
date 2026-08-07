<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'
    let { children, class: className, ...restPros}: HTMLAttributes<HTMLDivElement> = $props()
</script>

<div class={"tab-content border-base-300 h-full" + (className ? ` ${className}` : "")} {...restPros}>
    {@render children?.()}
</div>