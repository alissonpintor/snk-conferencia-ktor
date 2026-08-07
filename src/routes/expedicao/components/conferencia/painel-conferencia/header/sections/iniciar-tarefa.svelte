<script lang="ts">
	import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { conferenciaState, LoadingStatus } from '$lib/states/conferencia.svelte';

	let isWaitingStartTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.AGUARDANDO_INICIAR_TAREFA
	);
	let isStartingTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.INICIANDO_TAREFA
	);

	let checkout = $state<string | null>(null);
</script>

{#if !conferenciaState.conferenciaIniciada && (isWaitingStartTask || isStartingTask)}
	<div class="flex w-40 flex-col gap-1">
		<button
			class="btn btn-primary h-8"
			disabled={!conferenciaState.conferenciaSelecionada || isStartingTask}
			onclick={() => {
				conferenciaState.iniciarTarefa();
				checkout = '';
			}}
		>
			{#if isStartingTask}
				<LoadingSpinner />
			{:else}
				Inicia Conferencia
			{/if}
		</button>

		<button
			class="btn btn-error h-8"
			disabled={!conferenciaState.conferenciaSelecionada || isStartingTask}
			onclick={() => {
				conferenciaState.limparConferencia();
				checkout = '';
			}}
		>
			Limpar Checkout
		</button>
	</div>
{/if}
