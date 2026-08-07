<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { checked, disabled, indeterminate, onchange, ...restProps }: HTMLInputAttributes = $props();
</script>

<input
	tabindex="-1"
	type="checkbox"
	bind:checked
	bind:indeterminate
	{onchange}
	class="checkbox checkbox-sm"
/>
