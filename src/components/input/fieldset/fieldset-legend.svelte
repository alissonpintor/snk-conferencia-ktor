<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    let { children, class: className }: HTMLAttributes<HTMLLegendElement> = $props();
</script>

<legend class={"fieldset-legend " + className}>
    {@render children?.()}
</legend>