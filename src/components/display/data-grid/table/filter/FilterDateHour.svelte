<script lang="ts">
	import type { Column } from '@tanstack/table-core';
	import { CircleX } from '@lucide/svelte';

	let { column }: { column: Column<any, any> } = $props();

	// TanStack stores our custom [Date | null, Date | null]
	// But local state needs strings for input type="datetime-local"
	const currentFilter = column.getFilterValue() as [Date | null, Date | null] | undefined;

	function dateToDateTimeString(d: Date | null): string {
		if (!d) return '';
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		const hours = String(d.getHours()).padStart(2, '0');
		const minutes = String(d.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	let localStart = $state(currentFilter ? dateToDateTimeString(currentFilter[0]) : '');
	let localEnd = $state(currentFilter ? dateToDateTimeString(currentFilter[1]) : '');

	function handleChange() {
		// datetime-local input value is in format YYYY-MM-DDTHH:mm
		const start = localStart ? new Date(localStart) : null;
		let end = localEnd ? new Date(localEnd) : null;

		if (end) {
			// Set to end of the minute to be inclusive
			end.setSeconds(59, 999);
		}

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

<div class="flex min-w-48 flex-col gap-2 p-3">
	<div class="flex flex-col gap-1">
		<span class="text-base-content/70 text-xs font-semibold">Início:</span>
		<input
			type="datetime-local"
			class="input input-bordered input-sm w-full"
			bind:value={localStart}
			onchange={handleChange}
		/>
	</div>
	<div class="flex flex-col gap-1">
		<span class="text-base-content/70 text-xs font-semibold">Fim:</span>
		<input
			type="datetime-local"
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
