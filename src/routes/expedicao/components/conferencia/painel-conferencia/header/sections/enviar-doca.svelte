<script lang="ts">
	import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { conferenciaState, LoadingStatus } from '$lib/states/conferencia.svelte';

	let isWaitingSendToDoca = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.AGUARDANDO_ENVIAR_PARA_DOCA
	);
	let isSentToDoca = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.ENVIANDO_PARA_DOCA
	);
</script>

{#if conferenciaState.conferenciaIniciada}
	{#if isWaitingSendToDoca || isSentToDoca}
		<div class="flex flex-row gap-1">
			<button
				class="btn btn-primary h-8"
				disabled={isSentToDoca}
				onclick={async () => {
					await conferenciaState.enviarParaDoca();
				}}
			>
				{#if isSentToDoca}
					<LoadingSpinner />
				{:else}
					Enviar para Doca
				{/if}
			</button>
		</div>
	{/if}
{/if}
