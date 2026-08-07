<script lang="ts">
	import type { Column } from '@tanstack/table-core';
	import { Funnel, FunnelPlus } from '@lucide/svelte';
	import FilterText from './FilterText.svelte';
	import FilterNumber from './FilterNumber.svelte';
	import FilterDate from './FilterDate.svelte';
	import FilterDateHour from './FilterDateHour.svelte';
	import FilterSelect from './FilterSelect.svelte';

	let { column }: { column: Column<any, any> } = $props();

	const variant = column.columnDef.meta?.filterVariant ?? 'text';
	const isFiltered = $derived(column.getIsFiltered());

	const FilterComponent = $derived.by(() => {
		switch (variant) {
			case 'number':
				return FilterNumber;
			case 'date':
				return FilterDate;
			case 'date-hour':
				return FilterDateHour;
			case 'select':
				return FilterSelect;
			default:
				return FilterText;
		}
	});
</script>

<div class="dropdown dropdown-start m-0 flex h-fit items-center p-0 focus-within:z-50 hover:z-50">
	<button
		class="hover:bg-base-200 cursor-pointer rounded-xs p-1 transition-all {isFiltered
			? 'bg-primary/10'
			: ''}"
		class:text-primary={isFiltered}
		class:rounded-md={isFiltered}
		class:font-bold={isFiltered}
		aria-label="Filtrar coluna"
	>
		{#if isFiltered}
			<FunnelPlus size="16" />
		{:else}
			<Funnel size="16" class="opacity-40 hover:opacity-100" />
		{/if}
	</button>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		tabindex="0"
		class="dropdown-content menu bg-base-100 rounded-box border-base-200 top-0 z-[100] w-auto overflow-visible border p-0 shadow-xl"
	>
		<FilterComponent {column} />
	</div>
</div>
