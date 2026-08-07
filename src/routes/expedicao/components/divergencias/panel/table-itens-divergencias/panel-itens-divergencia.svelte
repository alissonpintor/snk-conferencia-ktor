<script lang="ts" generics="TData, TValue">
	import type { HTMLAttributes } from 'svelte/elements';
	import Table from './table.svelte';
	import TableLoading from './table-loading.svelte';
	import { Badge } from '$components/display/badge';
	import { LoadingSpinner } from '$components/feedback/loading';
	import { Settings } from '@lucide/svelte';
	import { Pane } from 'paneforge';
	import { itensDivergenciaState } from '$lib/states/divergencia.svelte';
	import { alertState } from '$lib/states/notification.svelte';
	import SelectMotivos from './select-motivos.svelte';

	let {
		title = '',
	}: HTMLAttributes<HTMLTableElement> = $props();
	let innerHeight = $state(0);
	let currentHeight = $state(50);
	let panelHeigth = $derived(Math.round(innerHeight * 0.7 * (currentHeight / 100)));

	async function salvar() {
		const response = await itensDivergenciaState.salvarTratativa();
		if (response.success) {
			alertState.title = "Tratar Divergência";
			alertState.message = "Divergência tratada com sucesso!";
			alertState.showAlert = true;
		}
	}
</script>

<svelte:window bind:innerHeight />

<Pane
	class="bg-base-100 rounded-box flex-1 p-4"
	defaultSize={50}
	onResize={(size, prevSize) => {
		currentHeight = size;
	}}
>
	<div class="mb-2 flex flex-row items-center justify-between border-b-1 border-gray-300 pb-1">
		<div class="flex flex-row items-center justify-between gap-8">
			<h2 class="text-md mb-2 font-semibold text-gray-500 italic">
				{title}
			</h2>
			
			<div>
				<button 
					class="btn h-8 w-24"
					onclick={() => itensDivergenciaState.setRecontar()}
					disabled={!itensDivergenciaState.isRowSelected}
				> Recontar </button>
				
				<button 
					class="btn h-8 w-24"
					onclick={() => itensDivergenciaState.setCortar()}
					disabled={!itensDivergenciaState.isRowSelected}
				> Cortar </button>
			</div>

			<div>
				<SelectMotivos 
					setValue={(value: string) => itensDivergenciaState.setMotivo(Number(value))} 
					disabled={!itensDivergenciaState.isRowSelected} 
				/>
			</div>
			
			<button 
				class="btn btn-primary h-8 w-36" 
				disabled={!itensDivergenciaState.isRowsTrated || itensDivergenciaState.isLoading}
				onclick={salvar}
			>
				{#if itensDivergenciaState.isLoading}
					<LoadingSpinner/> Salvando...
				{:else}
					Salvar
				{/if} 			
			</button>
		</div>

		<div>
			<Badge class="badge-primary w-12">
				{#if itensDivergenciaState.isLoading}
					<LoadingSpinner class="m-1" />
				{:else}
					{itensDivergenciaState.itens && itensDivergenciaState.itens.length}
				{/if}
			</Badge>
			<button class="btn btn-ghost mx-0 px-1">
				<Settings />
			</button>
		</div>
	</div>
	<div class="overflow-auto" style="height: {panelHeigth}px">
		{#if itensDivergenciaState.isLoading}
			<TableLoading />
		{:else}
			<Table />
		{/if}
	</div>
</Pane>