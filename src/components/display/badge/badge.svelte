<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    let { children, class: className, ...restProps }: HTMLAttributes<HTMLSpanElement> = $props()
</script>

<span class={"badge " + (className ?? "")} {...restProps}>
    {@render children?.() }
</span>