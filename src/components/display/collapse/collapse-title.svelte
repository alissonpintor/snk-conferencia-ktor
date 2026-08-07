<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    let {children, class: className, ...restProps}: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={"collapse-title font-semibold " + (className ?? "")} {...restProps}>
    {@render children?.()}
</div>