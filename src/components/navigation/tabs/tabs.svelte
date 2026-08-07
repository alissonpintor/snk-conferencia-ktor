<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'
    let { children, class: className, ...restPros}: HTMLAttributes<HTMLDivElement> = $props()
</script>

<div class={"tabs tabs-lift" + (className ? ` ${className}` : "")} {...restPros}>
    {@render children?.()}
</div>