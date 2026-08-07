<script lang="ts" generics="Tdata">
	import { FlexRender } from '$components/display/data-table';
	import * as Table from '$components/display/table';
	import type { Table as TableTansstack } from '@tanstack/table-core';

	type Props = {
		table: TableTansstack<Tdata>;
		onRowFocus?: (data: Tdata) => void;
		getRowStyle?: (data: Tdata) => Record<string, string> | undefined;
	};

	let { table, onRowFocus, getRowStyle }: Props = $props();

	function computeRowStyle(data: Tdata): string {
		if (!getRowStyle) return '';
		const styles = getRowStyle(data);
		if (!styles) return '';
		return Object.entries(styles)
			.map(([k, v]) => {
				// Convert camelCase to kebab-case
				const kebab = k.replace(/([A-Z])/g, '-$1').toLowerCase();
				return `${kebab}: ${v}`;
			})
			.join('; ');
	}
	let selectedRow = $state<string | null>(null);
</script>

<Table.Root size="xs" style="width: {table.getTotalSize()}px; table-layout: fixed;">
	<Table.Header>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<Table.Row>
				{#each headerGroup.headers as header (header.id)}
					<Table.Head
						class="group relative select-none"
						colspan={header.colSpan}
						style="width: {header.getSize()}px;"
					>
						{#if !header.isPlaceholder}
							<div class="flex h-full items-center justify-between">
								<div class="w-full flex-1">
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								</div>

								{#if header.column.getCanResize()}
									<div
										onmousedown={header.getResizeHandler()}
										ontouchstart={header.getResizeHandler()}
										class="group-hover:bg-base-300 absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none opacity-0 transition-opacity select-none group-hover:opacity-100 {header.column.getIsResizing()
											? 'bg-primary opacity-100'
											: ''}"
										role="separator"
										aria-label="Resize column"
									></div>
								{/if}
							</div>
						{/if}
					</Table.Head>
				{/each}
			</Table.Row>
		{/each}
	</Table.Header>
	<Table.Body>
		{#each table.getRowModel().rows as row (row.id)}
			<Table.Row
				data-state={row.getIsSelected() && 'selected'}
				tabindex={0}
				class="hover:!bg-primary hover:!text-primary-content hover:cursor-pointer {selectedRow ===
				row.id
					? '!bg-primary !text-primary-content'
					: null}"
				style={computeRowStyle(row.original)}
				onclick={() => {
					onRowFocus ? onRowFocus(row.original) : null;
					selectedRow = row.id;
				}}
			>
				{#each row.getVisibleCells() as cell (cell.id)}
					<Table.Cell style="width: {cell.column.getSize()}px;">
						<div class:truncate={cell.column.columnDef.meta?.filterVariant === 'text'}>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</div>
					</Table.Cell>
				{/each}
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={table.getAllColumns().length}>
					<div class="text-start">Nenhum registro disponivel.</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
