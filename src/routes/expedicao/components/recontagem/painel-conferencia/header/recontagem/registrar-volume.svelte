<script lang="ts">
    import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { recontagemState, RecontagemStatus } from '$lib/states/recontagem.svelte';

    let quantidadeVolume = $state<number | null>(null);
    let isWaitingResgisterVolume = $derived<boolean>(
		recontagemState.status === RecontagemStatus.AGUARDANDO_REGISTRAR_VOLUME
	);
	let isRecordingVolume = $derived<boolean>(
		recontagemState.status === RecontagemStatus.REGISTRANDO_VOLUME
	);
</script>

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
                        recontagemState.registrarVolumes(quantidadeRegistrada);
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