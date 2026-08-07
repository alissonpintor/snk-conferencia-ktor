<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    let { children, class: className }: HTMLAttributes<HTMLLabelElement> = $props();
</script>

<label  class={"label  " + className}>
    {@render children?.()}
</label >