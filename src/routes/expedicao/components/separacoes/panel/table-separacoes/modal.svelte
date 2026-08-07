<script lang="ts">
  import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
  import { alertState } from '$lib/states/notification.svelte';
  import { modalState } from "./modal-state.svelte";

  let isLoading = $state(false);
  let quantidade = $state(null);

  async function gerarVolume() {
    isLoading = true;

    if (!modalState.separacao || !quantidade) {
      isLoading = false;
      return;
    }

    const response = await fetch(
      `/api/separacao/${modalState.separacao.nroSeparacao}/volumes/gerar`,
      {
        method: "POST",
        body: JSON.stringify({
          nroConferencia: modalState.separacao.nroConferencia,
          quantidadeAtual: modalState.quantidadeAtual,
          quantidade: quantidade
        })
      }
    );
    const responseData = await response.json();

    if (responseData.success) {
      alertState.setAlert(
        "Registrar Volumes",
        "Volumes Registrados com sucesso"
      )
    } else {
      alertState.setAlert(
        "Erro ao registrar Volumes",
        responseData.error[0].message
      )
    }

    modalState.hideModal();
    quantidade = 0;
    isLoading = false;
  }
</script>

<dialog id="my_modal_3" class="modal" bind:this={modalState.modal}>
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={() => modalState.hideModal()}>✕</button>
    </form>

    <div class="flex flex-col gap-4">

      <h3 class="text-lg font-bold">
          Gerar Volume
      </h3>
  
      <div class="flex flex-col gap-1">
        <h5 class="text-md font-bold">{modalState.separacao?.nomeParc}</h5>
        <div class="flex flex-row gap-1">
          <span class="badge badge-soft badge-primary">{modalState.separacao?.nroSeparacao}</span>
          <span class="badge badge-soft">{modalState.quantidadeAtual}</span>
        </div>
      </div>

      
      <div class="flex flex-row gap-1">
          <label class="input">
            <span class="label font-bold">Informe a quantidade:</span>
            <input 
              type="text" 
              class="input h-8 w-36" 
              placeholder="Quantidade..."
              bind:value={quantidade}
            />
            <button
              class="btn btn-primary h-8"
              disabled={isLoading}
              onclick={() => gerarVolume()}
            >
              {#if isLoading}
                <LoadingSpinner />
              {:else}
                Salvar
              {/if}
            </button>
          </label>
        </div>
    </div>
    
  </div>
</dialog>