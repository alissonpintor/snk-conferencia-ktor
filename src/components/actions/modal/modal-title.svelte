<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'
    let { children, class: className }: HTMLAttributes<HTMLHeadElement> = $props()
</script>

<h3 class={`text-lg font-bold ${className ?? ""}`}>
    {@render children?.()}
</h3>