<script lang="ts">
	import { setContext } from "svelte";
    import type { HTMLLabelAttributes } from "svelte/elements";
    let { children, class: className, ...restProps }: HTMLLabelAttributes = $props();
    setContext("grow", true);
</script>

<label class={"input " + (className ?? "")} {...restProps}>
	{@render children?.()}
</label>