<script lang="ts">
	import {
		type SortingState,
		type ColumnFiltersState,
		type RowSelectionState,
		type PaginationState,
		type VisibilityState,
		type ColumnOrderState,
		type ColumnSizingState,
		type OnChangeFn,
		getSortedRowModel,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel
	} from '@tanstack/table-core';
	import { onMount } from 'svelte';
	import { Pane } from 'paneforge';

	import { separacaoState } from '$lib/states/separacao.svelte';
	import { itensSeparacaoState } from '$lib/states/separacao.svelte';
	import { rowColorsState } from '$lib/states/row-colors.svelte';
	import { createSvelteTable } from '$components/display/data-table';
	import { columnsSeparacao as columns } from './columns';

	import Table from '$components/display/data-grid/table/table.svelte';
	import TableLoading from '$components/display/data-grid/table/table-loading.svelte';

	import Header from '$components/display/data-grid/header/header.svelte';
	import type {
		CounterProps,
		PaginationProps,
		SelectColumnsProps
	} from '$components/display/data-grid/header/types';

	import Modal from './modal.svelte';
	import ColorConfigModal from '$components/display/data-grid/header/color-config-modal.svelte';
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		separacaoState.resetState();
		itensSeparacaoState.resetState();
	});

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnOrder = $state<ColumnOrderState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnSizing = $state<ColumnSizingState>({});

	onMount(() => {
		const saved = localStorage.getItem('columnSizing-expedicao');
		if (saved) {
			columnSizing = JSON.parse(saved);
		}
		rowColorsState.load();
	});
	let visibility = $state<VisibilityState>({});
	let pagination = $state<PaginationState>({
		pageIndex: 0,
		pageSize: 50
	});

	let pageIndex = $derived(separacaoState.separacoes.length > 0 ? pagination.pageIndex + 1 : 0);

	const table = createSvelteTable({
		get data() {
			return separacaoState.separacoes;
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
			localStorage.setItem('columnSizing-expedicao', JSON.stringify(columnSizing));
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
	let showColorModal = $state(false);

	const counter = $derived<CounterProps>({
		count: separacaoState.separacoes.length,
		isLoading: separacaoState.isLoading
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
			const saved = localStorage.getItem('columnOrder-expedicao');
			if (saved) {
				const savedOrder = JSON.parse(saved);
				return savedOrder;
			}
			return null;
		},
		saveColumnOrder: (columns) => {
			const order = columns.map((col) => col.id);
			localStorage.setItem('columnOrder-expedicao', JSON.stringify(order));
		},
		onConfigureColors: () => {
			showColorModal = true;
		}
	});
</script>

<svelte:window bind:innerHeight />

<Modal />
<ColorConfigModal bind:open={showColorModal} onclose={() => showColorModal = false} />

<Pane
	class="bg-base-100 rounded-box flex-1 p-4"
	defaultSize={50}
	onResize={(size, prevSize) => {
		currentHeight = size;
	}}
>
	<Header title="Separação" {counter} pagination={headerPagination} {selectColumns} />
	{#if separacaoState.isLoading}
		<div class="overflow-auto" style="height: {panelHeigth}px">
			<TableLoading />
		</div>
	{:else}
		<div class="overflow-auto" style="height: {panelHeigth}px">
			<Table {table} onRowFocus={(row) => itensSeparacaoState.buscarItensSeparacao(row)} getRowStyle={(row) => rowColorsState.getRowStyle(row.situacao)} />
		</div>
	{/if}
</Pane>
