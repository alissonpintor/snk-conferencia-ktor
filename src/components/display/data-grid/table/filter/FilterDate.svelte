<script lang="ts">
	import type { Column } from '@tanstack/table-core';
	import { CircleX } from '@lucide/svelte';

	let { column }: { column: Column<any, any> } = $props();

	// TanStack stores our custom [Date | null, Date | null]
	// But local state needs strings for input type="date"
	const currentFilter = column.getFilterValue() as [Date | null, Date | null] | undefined;
	
	function dateToString(d: Date | null): string {
		if (!d) return '';
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}


	let localStart = $state(currentFilter ? dateToString(currentFilter[0]) : '');
	let localEnd = $state(currentFilter ? dateToString(currentFilter[1]) : '');

	function handleChange() {
		const start = localStart ? new Date(localStart + 'T00:00:00') : null;
		const end = localEnd ? new Date(localEnd + 'T23:59:59') : null;
		
		if (!start && !end) {
			column.setFilterValue(undefined);
		} else {
			column.setFilterValue([start, end]);
		}
	}

	function clear() {
		localStart = '';
		localEnd = '';
		column.setFilterValue(undefined);
	}
</script>

<div class="flex flex-col gap-2 p-3 min-w-48">
	<div class="flex flex-col gap-1">
		<span class="text-xs font-semibold text-base-content/70">Início:</span>
		<input
			type="date"
			class="input input-bordered input-sm w-full"
			bind:value={localStart}
			onchange={handleChange}
		/>
	</div>
	<div class="flex flex-col gap-1">
		<span class="text-xs font-semibold text-base-content/70">Fim:</span>
		<input
			type="date"
			class="input input-bordered input-sm w-full"
			bind:value={localEnd}
			onchange={handleChange}
		/>
	</div>
	{#if localStart || localEnd}
		<button class="btn btn-ghost btn-xs text-error mt-1" onclick={clear}>
			<CircleX size="14" class="mr-1" /> Limpar
		</button>
	{/if}
</div>
