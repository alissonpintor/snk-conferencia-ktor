<script lang="ts">
	import type { HTMLHtmlAttributes } from "svelte/elements";
	let { children, class: className }: HTMLHtmlAttributes = $props();
</script>

<div class={className}>
	{@render children?.()}
</div>
