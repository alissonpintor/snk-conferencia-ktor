<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  data-slot="card"
  class={"card bg-base-200" + (className ? ` ${className}` : '')}
  {...restProps}
>
  {@render children?.()}
</div>
