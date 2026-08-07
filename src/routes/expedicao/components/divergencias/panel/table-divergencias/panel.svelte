<script lang="ts" generics="TData, TValue">
	import {
		type SortingState,
		type ColumnFiltersState,
		type RowSelectionState,
		type PaginationState,
		type VisibilityState,
		type ColumnOrderState,
		type OnChangeFn,
		getSortedRowModel,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel
	} from '@tanstack/table-core';
	import { Pane } from "paneforge";
    
	import { divergenciaState } from '$lib/states/divergencia.svelte';
	import { itensDivergenciaState } from '$lib/states/divergencia.svelte';
	import { createSvelteTable } from '$components/display/data-table';
	import { columnsDivergencia as columns } from './columns';

	import Table from '$components/display/data-grid/table/table.svelte';
	import TableLoading from '$components/display/data-grid/table/table-loading.svelte';

	import Header from "$components/display/data-grid/header/header.svelte";
	import type { CounterProps, PaginationProps, SelectColumnsProps } from '$components/display/data-grid/header/types';

	
	// import Table from './table.svelte'
	// import TableLoading from './table-loading.svelte';
	// import { Badge } from '$components/display/badge';
	// import { LoadingSpinner } from '$components/feedback/loading';

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnOrder = $state<ColumnOrderState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let visibility = $state<VisibilityState>({});
	let pagination = $state<PaginationState>({
		pageIndex: 0,
		pageSize: 50
	});

	let pageIndex = $derived(divergenciaState.divergencias.length > 0 ? pagination.pageIndex + 1 : 0);

	const setColumnOrder: OnChangeFn<ColumnOrderState> = (updater) => {
		if (updater instanceof Function) {
			console.log('function');
			columnOrder = updater(columnOrder);
		} else {
			console.log('array');
			columnOrder = updater;
		}
		// options.update((old) => ({
		// 	...old,
		// 	state: {
		// 		...old.state,
		// 		columnOrder
		// 	}
		// }));
	};

	const table = createSvelteTable({
		get data() {
			return divergenciaState.divergencias;
		},
		columns,
		enableRowSelection: true,
		enableMultiRowSelection: true,
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnOrderChange: (updater) => {
			if (typeof updater === 'function') {
				columnOrder = updater(columnOrder);
			} else {
				columnOrder = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				console.log(updater);
				rowSelection = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				visibility = updater(visibility);
			} else {
				visibility = updater;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		state: {
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get rowSelection() {
				return rowSelection;
			},
			get pagination() {
				return pagination;
			},
			get columnVisibility() {
				return visibility;
			},
			get columnOrder() {
				return columnOrder;
			}
		}
	});

	// type Props = {
	// 	title: string;
	// }

	// let {
	// 	title,
	// }: Props = $props();
	
	let innerHeight = $state(0);
	let currentHeight = $state(50);
	let panelHeigth = $derived(Math.round(innerHeight * 0.7 * (currentHeight / 100)));

	const counter = $derived<CounterProps>({
		count: divergenciaState.divergencias.length,
		isLoading: divergenciaState.isLoading
	});

	const headerPagination = $derived<PaginationProps>({
		hasPreviousPage: table.getCanPreviousPage,
		hasNextPage: table.getCanNextPage,
		previousPage: table.previousPage,
		nextPage: table.nextPage,
		setPageSize: table.setPageSize,
		pageCount: table.getPageCount,
		pageIndex: pageIndex,
		pageSize: pagination.pageSize
	});

	const selectColumns = $derived<SelectColumnsProps>({
		isAllColumnsVisible: table.getIsAllColumnsVisible,
		toggleAllColumnsVisibility: table.getToggleAllColumnsVisibilityHandler(),
		setColumnOrder: table.setColumnOrder,
		getAllColumns: table.getAllLeafColumns,
		getSavedColumnOrder: () => {
			const saved = localStorage.getItem('columnOrder-divergencia');
			if (saved) {
				const savedOrder = JSON.parse(saved);
				return savedOrder;
			}
			return null;
		},
		saveColumnOrder: (columns) => {
			const order = columns.map(col => col.id);
			localStorage.setItem('columnOrder-divergencia', JSON.stringify(order));
		}
	})
</script>

<svelte:window bind:innerHeight/>

<Pane
	class="bg-base-100 rounded-box flex-1 p-4"
	defaultSize={50}
	onResize={(size, prevSize) => {
		currentHeight = size;
	}}
>
	<Header 
		title="Divergências"
		{counter} 
		pagination={headerPagination}
		selectColumns={selectColumns}
	/>
	{#if divergenciaState.isLoading}
		<div class="overflow-auto" style="height: {panelHeigth}px">
			<TableLoading />
		</div>
	{:else}
		<div class="overflow-auto" style="height: {panelHeigth}px">
			<Table 
				table={table}
				onRowFocus={
					(row) => itensDivergenciaState.buscarItensDivergencia(row)
				}
			/>
		</div>
	{/if}
</Pane>

<!-- <Pane class="bg-base-100 rounded-box flex-1 p-4" defaultSize={50} onResize={(size, prevSize) => {
	currentHeight = size;
}}>
	<div class="border-b-1 mb-2 border-gray-300 pb-1 flex flex-row items-center justify-between">
		<h2 class="text-md mb-2 font-semibold italic text-gray-500">
			{title}
		</h2>
		<Badge class="badge-primary w-12">
			{#if divergenciaState.isLoading}
				<LoadingSpinner class="m-1" />
			{:else}
				{(divergenciaState.divergencias && divergenciaState.divergencias.length)}
			{/if}
		</Badge>
	</div>
	<div class="overflow-auto" style="height: {panelHeigth}px">
		{#if divergenciaState.isLoading}
			<TableLoading />
		{:else}
			<Table />
		{/if}
	</div>
</Pane> -->
