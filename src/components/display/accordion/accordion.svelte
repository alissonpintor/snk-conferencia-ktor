<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    let { checked=false, children, class: className, ...restProps}:{checked: boolean} & HTMLAttributes<HTMLDivElement> = $props()
</script>

<div class={"collapse collapse-arrow border border-base-300 rounded-box" + (className ? ` ${className}` : "")}>
    <input type="radio" name="accordion" {checked} />
    {@render children?.()}
</div>