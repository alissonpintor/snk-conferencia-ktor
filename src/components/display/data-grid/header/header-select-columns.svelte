<script lang="ts">
    import { Settings, GripVertical, RotateCcw, Palette } from '@lucide/svelte';
	import type { SelectColumnsProps } from './types';

    const { isAllColumnsVisible, toggleAllColumnsVisibility, setColumnOrder, getAllColumns, getSavedColumnOrder, saveColumnOrder, onConfigureColors }: SelectColumnsProps = $props();
	const id = crypto.randomUUID();

	// Estado das colunas
	let columns = $state(getAllColumns());
	
	let draggedIndex: number | null = $state(null);
	let dropTargetIndex: number | null = $state(null);
	
	// Carregar posições salvas do localStorage
	$effect(() => {
		if (!getSavedColumnOrder) return;
		const savedColumnsOrder = getSavedColumnOrder();
		if (savedColumnsOrder) {
			columns = columns.sort((a, b) => {
				const posA = savedColumnsOrder.indexOf(a.id);
				const posB = savedColumnsOrder.indexOf(b.id);
				return posA - posB;
			});
			setColumnOrder(columns.map(col => col.id));
		}
	});

	function handleDragStart(index: number) {
		draggedIndex = index;
	}

	function handleDragOver(index: number) {
		if (draggedIndex === null || draggedIndex === index) return;
		dropTargetIndex = index;
	}

	function handleDragEnd() {
		if (!setColumnOrder) return
		if (draggedIndex === null || dropTargetIndex === null) {
			draggedIndex = null;
			dropTargetIndex = null;
			return;
		}

		// Reordenar o array
		const newColumns = [...columns];
		const [removed] = newColumns.splice(draggedIndex, 1);
		newColumns.splice(dropTargetIndex, 0, removed);
		
		columns = newColumns;
		setColumnOrder(newColumns.map(col => col.id));
		
		// Salvar no localStorage
		if (saveColumnOrder) saveColumnOrder(newColumns);
		
		draggedIndex = null;
		dropTargetIndex = null;
	}

	function resetOrder() {
		columns = getAllColumns();
		localStorage.removeItem('columnOrder');
	}
</script>

<button class="btn btn-ghost mx-0 px-1" popovertarget="popover-{id}" style="anchor-name:--anchor-{id}">
	<Settings />
</button>
<ul
	class="dropdown dropdown-end menu rounded-box bg-base-100 w-auto shadow-sm max-h-96 overflow-y-auto"
	popover
	id="popover-{id}"
	style="position-anchor:--anchor-{id}"
>
	<li class="border-b border-gray-200 py-2 font-bold">
		<label>
			<input
				checked={isAllColumnsVisible()}
				onchange={(e) => toggleAllColumnsVisibility(e)}
				type="checkbox"
				class="checkbox"
			/>{' '}
			Marcar Todos
			<RotateCcw class="cursor-grab" onclick={resetOrder} />
		</label>
	</li>
	{#each columns as column, index (column.id)}
		{#if column.getCanHide()}
			<li 
				class="column-item border-b border-base-200 hover:border-0 hover:bg-primary hover:text-primary-content py-0.5 flex flex-row justify-between items-center"
				class:dragging={draggedIndex === index}
        		class:drop-target={dropTargetIndex === index}
				draggable={setColumnOrder ? "true" : "false"}
				ondragstart={() => handleDragStart(index)}
				ondragover={(e) => {
					e.preventDefault();
					handleDragOver(index);
				}}
				ondragend={handleDragEnd}
				ondragleave={() => {
					if (dropTargetIndex === index) dropTargetIndex = null;
				}}
			>
				<label>
					<input
						checked={column.getIsVisible()}
						onchange={column.getToggleVisibilityHandler()}
						type="checkbox"
						class="checkbox"
					/>{' '}
					{column.id}
				</label>
				<span class="cursor-grab drag-handle">
					<GripVertical size=16 />
				</span>
			</li>
		{/if}
	{/each}
	{#if onConfigureColors}
		<li class="border-t border-gray-200 pt-2 mt-2">
			<button class="flex items-center gap-2 w-full text-left hover:bg-primary hover:text-primary-content px-2 py-1 rounded" onclick={() => { onConfigureColors(); document.getElementById(`popover-${id}`)?.hidePopover(); }}>
				<Palette size={16} />
				Configurar Cores
			</button>
		</li>
	{/if}
</ul>

<style>
  .column-item:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }

  .column-item.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  .column-item.drop-target {
	margin: 0 5px;
	border: 1px;
    border-color: #3b82f6;
    border-style: dashed;
    background: #eff6ff;
	transform: scale(1.05);
  }

  .column-item:active .drag-handle {
    cursor: grabbing;
  }
</style>