<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	let { class: className, children, ...restProps }: HTMLTdAttributes = $props();
</script>

<!-- table how -->
<td class={className} {...restProps} style="padding-block: 0px; {restProps.style || ''}">
	{@render children?.()}
</td>
