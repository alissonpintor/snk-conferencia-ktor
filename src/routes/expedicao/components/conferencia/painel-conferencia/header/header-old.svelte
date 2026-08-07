<script lang="ts">
	import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { conferenciaState, LoadingStatus } from '$lib/states/conferencia.svelte';

	let isWaitingCheckout = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.NENHUM
	);
	let isLoadingCheckout = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.CARREGANDO_CHECKOUT
	);
	let isWaitingStartTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.AGUARDANDO_INICIAR_TAREFA
	);
	let isStartingTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.INICIANDO_TAREFA
	);
	let isPerformingTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.EXECUTANDO_TAREFA
	);
	let isFinishingTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.FINALIZANDO_TAREFA
	);
	let isCancelingTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.CANCELANDO_TAREFA
	);
	let isWaitingResgisterVolume = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.AGUARDANDO_REGISTRAR_VOLUME
	);
	let isRecordingVolume = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.REGISTRANDO_VOLUME
	);
	let isWaitingSendToDoca = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.AGUARDANDO_ENVIAR_PARA_DOCA
	);
	let isSentToDoca = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.ENVIANDO_PARA_DOCA
	);

	let checkout = $state<string | null>(null);
	let quantidadeVolume = $state<number | null>(null);
</script>

<div
	class="bg-base-100 rounded-box flex h-[84px] w-full flex-row items-center justify-between gap-2 p-2"
>
	{#if conferenciaState.conferenciaSelecionada}
		<div class="flex flex-col justify-center gap-2">
			<div class="flex flex-row gap-2">
				<span class="badge badge-soft badge-primary"
					>{conferenciaState.conferenciaSelecionada?.checkout}</span
				>
				<h1 class="text-xl font-bold">{conferenciaState.conferenciaSelecionada?.nomeParc}</h1>
			</div>
			<div class="flex flex-row gap-1">
				<span class="badge badge-soft badge-sm xl:badge-md">
					<b>OC:</b>{conferenciaState.conferenciaSelecionada?.ordemCarga}
				</span>
				<span class="badge badge-soft badge-sm xl:badge-md">
					<b>NU:</b>{conferenciaState.conferenciaSelecionada?.nroUnico}
				</span>
				<span class="badge badge-soft badge-sm xl:badge-md">
					<b>NRO:</b>{conferenciaState.conferenciaSelecionada?.nroNota}
				</span>
				<span class="badge badge-soft badge-sm xl:badge-md">
					<b>NRO.SEP:</b>{conferenciaState.conferenciaSelecionada?.nroSeparacao}
				</span>
				<span class="badge badge-soft badge-sm xl:badge-md">
					<b>SEP.:</b>{conferenciaState.conferenciaSelecionada?.separador}
				</span>
				<span class="badge badge-soft badge-sm xl:badge-md">
					<b>NRO.CONF:</b>{conferenciaState.conferenciaSelecionada?.nroConferencia}
				</span>
			</div>
		</div>
	{/if}
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
					onclick={() => {conferenciaState.cancelarTarefa();}}
					disabled={isFinishingTask || isCancelingTask}
				>
					{#if isCancelingTask}
						<LoadingSpinner />
					{:else}
						Cancelar
					{/if}
				</button>
			</div>
		{/if}

		{#if isWaitingResgisterVolume || isRecordingVolume}
			<div class="flex flex-row gap-1">
				<label class="input">
					<span class="label">Informe os Volumes:</span>
					<input type="text" class="input h-8 w-36" placeholder="Quantidade" bind:value={quantidadeVolume} />
					<button
						class="btn btn-primary h-8"
						disabled={isRecordingVolume}
						onclick={() => {
							if (quantidadeVolume) {
								const quantidadeRegistrada = quantidadeVolume;
								conferenciaState.registrarVolumes(quantidadeRegistrada);
								quantidadeVolume = null;
							};
						}}
					>
						{#if isRecordingVolume}
							<LoadingSpinner />
						{:else}
							Concluir
						{/if}
					</button>
				</label>
			</div>
		{/if}

		{#if isWaitingSendToDoca || isSentToDoca}
			<div class="flex flex-row gap-1">
				<button
					class="btn btn-primary h-8"
					disabled={isSentToDoca}
					onclick={() => {conferenciaState.enviarParaDoca();}}
				>
					{#if isSentToDoca}
						<LoadingSpinner />
					{:else}
						Enviar para Doca
					{/if}
				</button>
			</div>
		{/if}
	{:else}
		{#if isWaitingCheckout || isLoadingCheckout}
			<div class="flex flex-row gap-2">
				<label class="input">
					<span class="label font-bold">Informe o Checkout:</span>
					<input 
						type="text" 
						class="input h-8 w-32" 
						placeholder="Checkout"
						disabled={isLoadingCheckout}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								if (checkout) conferenciaState.buscarConferenciaPorCheckout(checkout);
							}
						}}
						bind:value={checkout}
					/>
				</label>
				<button
					class="btn btn-primary"
					disabled={isLoadingCheckout}
					onclick={() => {
						if (checkout) conferenciaState.buscarConferenciaPorCheckout(checkout);
					}}
				>
					{#if isLoadingCheckout}
						<LoadingSpinner />
					{:else}
						Buscar
					{/if}
				</button>
			</div>
		{/if}

		{#if isWaitingStartTask || isStartingTask}
			<div class="flex w-40 flex-col gap-1">
				<button
					class="btn btn-primary h-8"
					disabled={!conferenciaState.conferenciaSelecionada || isStartingTask}
					onclick={() => {conferenciaState.iniciarTarefa(); checkout = '';}}
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
					onclick={() => {conferenciaState.limparConferencia(); checkout = '';}}
				>
				Limpar Checkout
				</button>
			</div>
		{/if}
	{/if}
</div>
