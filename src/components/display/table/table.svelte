<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		size?: "xs" | "sm" | "md" | "lg"
	}

	let {
		size = "md",
		class: className,
		children,
		...restProps
	}: Props & HTMLAttributes<HTMLTableElement> = $props();

	const tableClass = `table table-${size} table-pin-rows ${(className || '')}`;
</script>

<table class={tableClass} {...restProps}>
	{@render children?.()}
</table>
