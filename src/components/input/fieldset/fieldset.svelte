<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    let { children }: HTMLAttributes<HTMLFieldSetElement> = $props();
</script>

<fieldset class="fieldset bg-base-100 border-base-300 rounded border p-4">
    {@render children?.()}
</fieldset>