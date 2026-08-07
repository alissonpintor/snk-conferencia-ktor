<script lang="ts">
    import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { recontagemState, RecontagemStatus } from '$lib/states/recontagem.svelte';

    const waitingStart = $derived<boolean>(recontagemState.status === RecontagemStatus.NENHUM && !recontagemState.isLoading);
	const loadingTask = $derived<boolean>(recontagemState.status === RecontagemStatus.INICIANDO_TAREFA && recontagemState.isLoading);
</script>

{#if waitingStart || loadingTask}
    <div class="flex flex-row gap-2">
        <label class="input">
            <span class="label font-bold">Informe o Checkout:</span>
            <input
                type="text"
                class="input h-8 w-32"
                placeholder="Checkout"
                bind:value={recontagemState.checkout}
            />
        </label>
        <button
            class="btn btn-primary"
            onclick={recontagemState.iniciarRecontagem}
            disabled={recontagemState.isLoading}
        >
            {#if loadingTask}
                <LoadingSpinner /> Buscar
            {:else}
                Buscar
            {/if}
        </button>
    </div>
{/if}