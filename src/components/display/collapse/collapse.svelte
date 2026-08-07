<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    let {children, class: className, ...restProps}: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={"collapse collapse-arrow bg-base-100 border-base-300 border" + (className ?? "")} {...restProps}>
    <input type="checkbox" />
    {@render children?.()}
</div>