<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	let { class: className, children, ...restProps }: HTMLAttributes<HTMLHeadElement> = $props();
</script>

<!-- table foot -->
<tfoot class={className} {...restProps}>
    {@render children?.()}
</tfoot>