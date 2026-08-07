<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	let { class: className, children, ...restProps }: HTMLAttributes<HTMLHeadElement> = $props();
</script>

<!-- head -->
<thead class={className} {...restProps}>
	{@render children?.()}
</thead>
