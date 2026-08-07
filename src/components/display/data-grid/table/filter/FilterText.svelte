<script lang="ts">
	import { CircleX } from '@lucide/svelte';
	import type { Column } from '@tanstack/table-core';

	let { column }: { column: Column<any, any> } = $props();

	let filterValue = $state((column.getFilterValue() as string) ?? '');

	function handleChange() {
		column.setFilterValue(filterValue || undefined);
	}

	function clear() {
		filterValue = '';
		column.setFilterValue(undefined);
	}
</script>

<div class="flex flex-row items-center justify-start gap-1 p-2 w-56">
	<label class="input input-sm h-10 w-full flex items-center gap-2">
		<input
			type="text"
			class="grow"
			bind:value={filterValue}
			oninput={handleChange}
			placeholder="Pesquisar..."
		/>
		{#if filterValue}
			<button class="btn btn-ghost btn-xs text-error p-0 h-6 w-6 min-h-0" onclick={clear} aria-label="Limpar">
				<CircleX size="16" />
			</button>
		{/if}
	</label>
</div>
