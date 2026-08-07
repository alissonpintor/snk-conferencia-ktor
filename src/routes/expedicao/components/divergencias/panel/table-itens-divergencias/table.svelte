<script lang="ts">
	import {
		type SortingState,
		type ColumnFiltersState,
		getSortedRowModel,
		getCoreRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$components/display/data-table';
	import * as Table from '$components/display/table';
	import { itensDivergenciaState } from '$lib/states/divergencia.svelte';
	import { columnsItensDivergencia as columns } from './columns';

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	
	const table = createSvelteTable({
		get data() { 
			return itensDivergenciaState.itens
		},
		columns,
		enableRowSelection: true,
		enableMultiRowSelection: true,
		getRowId: (row) => String(row.codigo),
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
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
				itensDivergenciaState.rowSelection = updater(itensDivergenciaState.rowSelection);
			} else {
				itensDivergenciaState.rowSelection = updater;
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
				return itensDivergenciaState.rowSelection;
			}
		}
	});

	let innerWidth = $state(0);
	let widthCssProp = $derived('width: ' + innerWidth * 0.9 + 'px');
	const tableWidth = $derived.by(() => {
		let width = 0;
		table.getAllColumns().forEach( (column: any) => {
			if (column.getIsVisible()) {
				width += column.columnDef.size;
			}
		});
		return width;
	})
</script>

<svelte:window bind:innerWidth />

<Table.Root class="table-auto" style="width: {tableWidth}px">
	<Table.Header>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<Table.Row>
				{#each headerGroup.headers as header (header.id)}
					<Table.Head colspan={header.colSpan} style="width: {header.getSize()}px;">
						{#if !header.isPlaceholder}
							<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
						{/if}
					</Table.Head>
				{/each}
			</Table.Row>
		{/each}
	</Table.Header>
	<Table.Body>
		{#each table.getRowModel().rows.slice(0, 15) as row (row.id)}
			<Table.Row
				data-state={row.getIsSelected() && 'selected'}
				tabindex={0}
				class="hover:bg-base-300 focus:bg-base-300 hover:cursor-pointer focus:border-none {row.getIsSelected()
					? 'bg-base-300'
					: null}"
				onfocus={() => {
					console.log('row.original');
				}}
				ondblclick={row.getToggleSelectedHandler()}
			>
				{#each row.getVisibleCells() as cell (cell.id)}
					<Table.Cell>
						<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
					</Table.Cell>
				{/each}
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={columns.length}>No results.</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>