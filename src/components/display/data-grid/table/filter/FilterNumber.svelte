<script lang="ts">
	import type { Column } from '@tanstack/table-core';
	import { CircleX } from '@lucide/svelte';

	let { column }: { column: Column<any, any> } = $props();

	let filterValue = $state((column.getFilterValue() as [number | null, number | null]) ?? [null, null]);

	function handleChange() {
		const [min, max] = filterValue;
		if (min === null && max === null) {
			column.setFilterValue(undefined);
		} else {
			column.setFilterValue(filterValue);
		}
	}

	function clear() {
		filterValue = [null, null];
		column.setFilterValue(undefined);
	}
</script>

<div class="flex flex-col gap-2 p-3 min-w-48">
	<div class="flex items-center gap-2">
		<span class="text-xs font-semibold w-10 text-base-content/70">Min:</span>
		<input
			type="number"
			class="input input-bordered input-sm grow"
			bind:value={filterValue[0]}
			oninput={handleChange}
			placeholder="Min"
		/>
	</div>
	<div class="flex items-center gap-2">
		<span class="text-xs font-semibold w-10 text-base-content/70">Max:</span>
		<input
			type="number"
			class="input input-bordered input-sm grow"
			bind:value={filterValue[1]}
			oninput={handleChange}
			placeholder="Max"
		/>
	</div>
	{#if filterValue[0] !== null || filterValue[1] !== null}
		<button class="btn btn-ghost btn-xs text-error mt-1" onclick={clear}>
			<CircleX size="14" class="mr-1" /> Limpar
		</button>
	{/if}
</div>
