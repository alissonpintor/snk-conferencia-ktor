<script lang="ts">
    import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { recontagemState, RecontagemStatus } from '$lib/states/recontagem.svelte';


    let isWaitingSendToDoca = $derived<boolean>(
		recontagemState.status === RecontagemStatus.AGUARDANDO_ENVIAR_PARA_DOCA
	);
	let isSentToDoca = $derived<boolean>(
		recontagemState.status === RecontagemStatus.ENVIANDO_PARA_DOCA
	);
</script>

{#if isWaitingSendToDoca || isSentToDoca}
	<div class="flex flex-row gap-1">
		<button
			class="btn btn-primary h-8"
			disabled={isSentToDoca}
			onclick={() => {
				recontagemState.enviarParaDoca();
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
