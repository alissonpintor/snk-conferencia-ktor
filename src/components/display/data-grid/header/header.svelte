<script lang="ts">
    import HeaderTitle from "./header-title.svelte";
    import HeaderBadgeCounter from "./header-badge-counter.svelte";
    import HeaderSelectColumns from "./header-select-columns.svelte";
    import HeaderPagination from "./header-pagination.svelte";
	import type { PanelProps } from "./types";

    const { title, counter, pagination, selectColumns }: PanelProps = $props(); 
</script>

<div class="mb-2 flex flex-row items-center justify-between border-b-1 border-gray-300 pb-1">
	<!-- Titulo -->
    <HeaderTitle {title} />

	<div class="flex flex-row items-center justify-between gap-1">
        
        <!-- Paginação -->
		<HeaderPagination
			nextPage={pagination.nextPage}
			previousPage={pagination.previousPage}
			hasNextPage={pagination.hasNextPage}
			hasPreviousPage={pagination.hasPreviousPage}
			setPageSize={pagination.setPageSize}
			pageCount={pagination.pageCount}
			pageIndex={pagination.pageIndex}
			pageSize={pagination.pageSize}
		/>

        <!-- Contador de itens -->
		<HeaderBadgeCounter
			count={counter.count}
			isLoading={counter.isLoading}
		/>

        <!-- Seleção de colunas -->
		<HeaderSelectColumns
			isAllColumnsVisible={selectColumns.isAllColumnsVisible}
			toggleAllColumnsVisibility={selectColumns.toggleAllColumnsVisibility}
			setColumnOrder={selectColumns.setColumnOrder}
			getAllColumns={selectColumns.getAllColumns}
			getSavedColumnOrder={selectColumns.getSavedColumnOrder}
			saveColumnOrder={selectColumns.saveColumnOrder}
			onConfigureColors={selectColumns.onConfigureColors}
		/>
	</div>
</div>
