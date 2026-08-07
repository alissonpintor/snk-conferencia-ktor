<script lang="ts">
	import {
		type SortingState,
		type ColumnFiltersState,
		type RowSelectionState,
		type PaginationState,
		type VisibilityState,
		type ColumnOrderState,
		type ColumnSizingState,
		getSortedRowModel,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel
	} from '@tanstack/table-core';
	import { onMount } from 'svelte';
	import { Pane } from 'paneforge';

	import { itensSeparacaoState } from '$lib/states/separacao.svelte';
	import { createSvelteTable } from '$components/display/data-table';
	import { columnsSeparacaoItens as columns } from './columns';

	import Table from '$components/display/data-grid/table/table.svelte';
	import TableLoading from '$components/display/data-grid/table/table-loading.svelte';

	import Header from '$components/display/data-grid/header/header.svelte';
	import type {
		CounterProps,
		PaginationProps,
		SelectColumnsProps
	} from '$components/display/data-grid/header/types';

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnOrder = $state<ColumnOrderState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnSizing = $state<ColumnSizingState>({});

	onMount(() => {
		const saved = localStorage.getItem('columnSizing-expedicao-itens');
		if (saved) {
			columnSizing = JSON.parse(saved);
		}
	});

	let visibility = $state<VisibilityState>({});
	let pagination = $state<PaginationState>({
		pageIndex: 0,
		pageSize: 50
	});

	let pageIndex = $derived(itensSeparacaoState.itens.length > 0 ? pagination.pageIndex + 1 : 0);

	const tableItens = createSvelteTable({
		get data() {
			return itensSeparacaoState.itens;
		},
		columns,
		enableRowSelection: true,
		enableMultiRowSelection: true,
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnSizingChange: (updater) => {
			if (typeof updater === 'function') {
				columnSizing = updater(columnSizing);
			} else {
				columnSizing = updater;
			}
			localStorage.setItem('columnSizing-expedicao-itens', JSON.stringify(columnSizing));
		},
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
			},
			get columnSizing() {
				return columnSizing;
			}
		}
	});

	let innerHeight = $state(0);
	let currentHeight = $state(50);
	let panelHeigth = $derived(Math.round(innerHeight * 0.7 * (currentHeight / 100)));

	const counter = $derived<CounterProps>({
		count: itensSeparacaoState.itens.length,
		isLoading: itensSeparacaoState.isLoading
	});

	const headerPagination = $derived<PaginationProps>({
		hasPreviousPage: tableItens.getCanPreviousPage,
		hasNextPage: tableItens.getCanNextPage,
		previousPage: tableItens.previousPage,
		nextPage: tableItens.nextPage,
		setPageSize: tableItens.setPageSize,
		pageCount: tableItens.getPageCount,
		pageIndex: pageIndex,
		pageSize: pagination.pageSize
	});

	const selectColumnsItens = $derived<SelectColumnsProps>({
		isAllColumnsVisible: tableItens.getIsAllColumnsVisible,
		toggleAllColumnsVisibility: tableItens.getToggleAllColumnsVisibilityHandler(),
		setColumnOrder: tableItens.setColumnOrder,
		getAllColumns: tableItens.getAllLeafColumns,
		getSavedColumnOrder: () => {
			const saved = localStorage.getItem('columnOrder-expedicao-itens');
			if (saved) {
				const savedOrder = JSON.parse(saved);
				return savedOrder;
			}
			return null;
		},
		saveColumnOrder: (columns) => {
			const order = columns.map((col) => col.id);
			localStorage.setItem('columnOrder-expedicao-itens', JSON.stringify(order));
		}
	});
</script>

<svelte:window bind:innerHeight />

<Pane
	class="bg-base-100 rounded-box flex-1 p-4"
	defaultSize={50}
	onResize={(size, prevSize) => {
		currentHeight = size;
	}}
>
	<Header
		title="Itens da Separação"
		{counter}
		pagination={headerPagination}
		selectColumns={selectColumnsItens}
	/>

	{#if itensSeparacaoState.isLoading}
		<div class="overflow-auto" style="height: {panelHeigth}px">
			<TableLoading />
		</div>
	{:else}
		<div class="overflow-auto" style="height: {panelHeigth}px">
			<Table table={tableItens} />
		</div>
	{/if}
</Pane>
