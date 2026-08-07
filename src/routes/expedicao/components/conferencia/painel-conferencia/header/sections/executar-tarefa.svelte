<script lang="ts">
	import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { conferenciaState, LoadingStatus } from '$lib/states/conferencia.svelte';
	import ConfirmationDialog from '$components/feedback/confirmation-dialog.svelte';

	let showConfirmCancel = $state(false);

	let isPerformingTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.EXECUTANDO_TAREFA
	);
	let isFinishingTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.FINALIZANDO_TAREFA
	);
	let isCancelingTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.CANCELANDO_TAREFA
	);
</script>

{#if conferenciaState.conferenciaIniciada}
	{#if isPerformingTask || isFinishingTask || isCancelingTask}
		<div class="flex w-40 flex-col gap-1">
			<button
				class="btn btn-primary h-8"
				onclick={() => conferenciaState.validarConferencia()}
				disabled={isFinishingTask || isCancelingTask}
			>
				{#if isFinishingTask}
					<LoadingSpinner />
				{:else}
					Finalizar
				{/if}
			</button>

			<button
				class="btn btn-error h-8"
				onclick={() => {
					showConfirmCancel = true;
				}}
				disabled={isFinishingTask || isCancelingTask}
			>
				{#if isCancelingTask}
					<LoadingSpinner />
				{:else}
					Cancelar
				{/if}
			</button>
		</div>

		<ConfirmationDialog
			bind:showModal={showConfirmCancel}
			title="Confirmar Cancelamento"
			message="Tem certeza que deseja cancelar esta tarefa? Todo o progresso não salvo será perdido."
			onConfirm={() => conferenciaState.cancelarTarefa()}
		/>
	{/if}
{/if}
