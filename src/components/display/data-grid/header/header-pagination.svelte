<script lang="ts">
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
	import type { PaginationProps } from "./types";


	const { hasPreviousPage, hasNextPage, previousPage, nextPage, setPageSize, pageCount, pageIndex, pageSize }: PaginationProps = $props();
</script>

<div class="join mr-8">
	<button class="join-item btn h-8" onclick={() => previousPage()} disabled={!hasPreviousPage()}>
        <ChevronLeft size="16" />
    </button>
    <span class="join-item btn h-8">{pageIndex}/{pageCount()}</span>
	<button class="join-item btn h-8" onclick={() => nextPage()} disabled={!hasNextPage()}>
        <ChevronRight size="16" />
    </button>
	<select class="join-item select h-8" onchange={(e) => setPageSize(Number(e.currentTarget.value))}>
		<option selected={pageSize === 25}>25</option>
		<option selected={pageSize === 50}>50</option>
		<option selected={pageSize === 75}>75</option>
		<option selected={pageSize === 100}>100</option>
	</select>
</div>
