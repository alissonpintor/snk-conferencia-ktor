import type { Separacao } from "$lib/types/separacao";

class ModalState {
    separacao: Separacao | null = $state(null);
    modal = $state<HTMLDialogElement | null>(null);
    quantidadeAtual = $state(0);

    async buscarQuantidadeVolumes() {
        if (!this.separacao) return;
        const response = await fetch(
            `/api/separacao/${this.separacao.nroSeparacao}/volumes/quantidade`,
        )
        const responseData = await response.json();
        if (responseData.success) {
            this.quantidadeAtual = responseData.data.length;
        }
    }
    
    async showModal() {
        if (!this.modal || !this.separacao) return;
        await this.buscarQuantidadeVolumes()
        this.modal.showModal();
    }
    hideModal() {
        if (!this.modal) return;
        this.modal.close();
        if (this.separacao) this.separacao = null;
    }
}

export const modalState = new ModalState();