<script lang="ts">
	import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { conferenciaState, LoadingStatus } from '$lib/states/conferencia.svelte';

	let isWaitingResgisterVolume = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.AGUARDANDO_REGISTRAR_VOLUME
	);
	let isRecordingVolume = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.REGISTRANDO_VOLUME
	);

	let quantidadeVolume = $state<number | null>(null);
</script>

{#if conferenciaState.conferenciaIniciada}
	{#if isWaitingResgisterVolume || isRecordingVolume}
		<div class="flex flex-row gap-1">
			<label class="input">
				<span class="label">Informe os Volumes:</span>
				<input
					type="text"
					class="input h-8 w-36"
					placeholder="Quantidade"
					bind:value={quantidadeVolume}
				/>
				<button
					class="btn btn-primary h-8"
					disabled={isRecordingVolume}
					onclick={() => {
						if (quantidadeVolume) {
							const quantidadeRegistrada = quantidadeVolume;
							conferenciaState.registrarVolumes(quantidadeRegistrada);
							quantidadeVolume = null;
						}
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
{/if}
