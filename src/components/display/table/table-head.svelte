<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements';
	let { class: className, children, ...restProps }: HTMLThAttributes = $props();
</script>

<!-- table head -->
<th class={className} {...restProps}>
    {@render children?.()}
</th>