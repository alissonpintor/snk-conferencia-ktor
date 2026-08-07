<script lang="ts">
	import type { Column } from '@tanstack/table-core';
	import { CircleX } from '@lucide/svelte';

	let { column }: { column: Column<any, any> } = $props();

	const options = column.columnDef.meta?.filterOptions ?? [];
	let selectedValues = $state((column.getFilterValue() as any[]) ?? []);

	function toggleOption(value: any) {
		if (selectedValues.includes(value)) {
			selectedValues = selectedValues.filter((v: any) => v !== value);
		} else {
			selectedValues = [...selectedValues, value];
		}
		column.setFilterValue(selectedValues.length > 0 ? selectedValues : undefined);
	}

	function clear() {
		selectedValues = [];
		column.setFilterValue(undefined);
	}
</script>

<div class="flex flex-col p-2 min-w-48 max-h-64 overflow-y-auto">
	{#if options.length === 0}
		<span class="text-xs italic p-2 text-base-content/50">Nenhuma opção disponível</span>
	{:else}
		{#each options as option}
			<label class="label cursor-pointer justify-start gap-3 py-1.5 px-2 hover:bg-base-200 rounded-lg transition-colors">
				<input
					type="checkbox"
					class="checkbox checkbox-xs checkbox-primary"
					checked={selectedValues.includes(option.value)}
					onchange={() => toggleOption(option.value)}
				/>
				<span class="label-text text-xs">{option.label}</span>
			</label>
		{/each}
	{/if}
	
	{#if selectedValues.length > 0}
		<div class="divider my-1 opacity-50"></div>
		<button class="btn btn-ghost btn-xs text-error" onclick={clear}>
			<CircleX size="14" class="mr-1" /> Limpar Seleção
		</button>
	{/if}
</div>
