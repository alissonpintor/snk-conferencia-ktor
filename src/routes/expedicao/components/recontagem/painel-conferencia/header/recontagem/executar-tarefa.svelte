<script lang="ts">
	import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { recontagemState, RecontagemStatus } from '$lib/states/recontagem.svelte';

	const executingTask = $derived<boolean>(recontagemState.status === RecontagemStatus.EXECUTANDO_TAREFA);
	const cancelingTask = $derived<boolean>(recontagemState.status === RecontagemStatus.CANCELANDO_TAREFA);
</script>

{#if executingTask || cancelingTask}
	<div class="flex flex-row gap-2">
		<div class="flex w-40 flex-col gap-1">
			<button
				class="btn btn-error h-8"
				onclick={recontagemState.cancelarRecontagem}
				disabled={recontagemState.isLoading}
			>
				{#if recontagemState.isLoading && cancelingTask}
					<LoadingSpinner /> Cancelar
				{:else}
					Cancelar
				{/if}
			</button>
		</div>
	</div>
{/if}
