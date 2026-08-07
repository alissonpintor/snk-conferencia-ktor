<script lang="ts" generics="TData, TValue">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { ArrowDownAZ, ArrowUpZA } from '@lucide/svelte';
	import type { Column, Table } from '@tanstack/table-core';
	import FilterPopover from './filter/FilterPopover.svelte';

	let {
		text,
		toogle,
		table,
		column,
		onclick
	}: {
		text: string;
		toogle?: any;
		table?: Table<any>;
		column?: Column<any, any>;
	} & HTMLButtonAttributes = $props();


	// const uniqueCategories = $derived(
	// 	Array.from(new Set(table.getCoreRowModel().rows.map((row) => row.original[column.id])))
	// );

</script>

<div class="flex flex-row items-center gap-1">
	{#if column}
		<FilterPopover {column} />
	{/if}


	<button
		class="flex cursor-pointer flex-row items-center gap-1 overflow-hidden"
		{onclick}
		class:text-primary={['asc', 'desc'].includes(toogle)}
		class:font-extrabold={['asc', 'desc'].includes(toogle)}
	>
		<span class="truncate">{text}</span>


		{#if toogle === 'asc'}
			<ArrowDownAZ size="18" />
		{/if}
		{#if toogle === 'desc'}
			<ArrowUpZA size="18" />
		{/if}
	</button>
</div>

<!-- <div class="group flex w-full flex-row items-center justify-between">
	<div>
		<span class="invisible group-hover:visible cursor-grab drag-handle">
			<GripVertical size=16 />
		</span>
	</div>
</div> -->
