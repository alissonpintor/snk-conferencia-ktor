import { alertState } from "./notification.svelte";
import type { Recontagem, ItemRecontagem } from "$lib/types/recontagem";
import { buscarProdutoPorCodigo } from "../../routes/api/produto/produto.remote";


const ERRO_DIVERGENCIA = 'Houve divergência no processo de recontagem. Favor, conferir e programar nova recontagem no MGE.';

export enum RecontagemStatus {
    NENHUM = 0,
    INICIANDO_TAREFA = 3,
    EXECUTANDO_TAREFA = 4,
    CANCELANDO_TAREFA = 5,
    FINALIZANDO_TAREFA = 6,
    AGUARDANDO_REGISTRAR_VOLUME = 7,
    REGISTRANDO_VOLUME = 8,
    AGUARDANDO_ENVIAR_PARA_DOCA = 9,
    ENVIANDO_PARA_DOCA = 10
}


class RecontagemState {
    checkout: string | null = $state(null);
    recontagem: Recontagem | null = $state(null);
    itemAtual: ItemRecontagem | null = $state(null);
    itensRecontagem: ItemRecontagem[] = $state([]);
    status: RecontagemStatus = $state(RecontagemStatus.NENHUM);
    isLoading = $state(false);
    possuiMaisItens = $state(false);

    private getData = async (url: string, body: object) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const { error } = await response.json();
                return {
                    success: false,
                    data: null,
                    error: {
                        title: error[0].title,
                        message: error[0].message
                    }
                }
            }

            const { success, data } = await response.json();
            return { success, data, error: null };
        } catch (error) {
            return {
                success: false,
                data: null,
                error: {
                    title: 'Erro ao buscar a recontagem',
                    message: (error as Error).message
                }
            }
        }
    }

    iniciarRecontagem = async () => {
        if (!this.checkout) {
            alertState.setAlert(
                'Erro ao buscar a recontagem',
                'O checkout não foi informado'
            );
            return;
        }

        this.status = RecontagemStatus.INICIANDO_TAREFA;
        this.isLoading = true;
        const { data, error } = await this.getData('/api/recontagem/iniciar', {
            checkout: this.checkout
        });

        if (error) {
            alertState.setAlert(
                error.title,
                error.message
            );
            this.status = RecontagemStatus.NENHUM;
            this.isLoading = false;
            return;
        }

        this.recontagem = data as Recontagem;
        await this.buscarSeparacao();
        await this.proximoItem();
        this.status = RecontagemStatus.EXECUTANDO_TAREFA;
        this.isLoading = false;
    }

    buscarSeparacao = async () => {
        if (!this.recontagem) return;
        const { success, data, error } = await this.getData('/api/separacao', {
            nroConferencia: this.recontagem.nroConferencia,
        });

        if (error) {
            alertState.setAlert(
                error.title,
                error.message
            );
            return;
        }

        if (success && data) {
            const separacao = data[0];
            this.recontagem.nroSeparacao = separacao.nroSeparacao;
            this.recontagem.nomeParc = separacao.nomeParc;
        }
    }

    proximoItem = async () => {
        if (!this.recontagem) return;
        const { data, error } = await this.getData('/api/recontagem/proxima-recontagem', {
            nroConferencia: this.recontagem.nroConferencia,
            nroTarefa: this.recontagem.nroTarefa,
            codigoEndreco: this.recontagem.codigoEndereco
        });

        if (error) {
            alertState.setAlert(
                error.title,
                error.message
            );
            return;
        }

        if (this.itemAtual) this.itensRecontagem.push(this.itemAtual);

        if (data) {
            this.itemAtual = data as ItemRecontagem;
            const infoProduto = await buscarProdutoPorCodigo(this.itemAtual.codigoProduto.toString());
            if (infoProduto?.success && infoProduto.data && infoProduto.data?.length > 0) {
                this.itemAtual.marca = infoProduto.data[0].marca;
            }
            this.possuiMaisItens = true;
            return;
        }

        this.itemAtual = null;
        this.possuiMaisItens = false;
    }

    buscarInformacoesItem = async (codBarras: string, quantidade: number) => {
        if (!this.itemAtual || !this.recontagem) return;

        const { data, error } = await this.getData('/api/recontagem/info-produto', {
            nroConferencia: this.recontagem.nroConferencia,
            codigoBarras: codBarras,
            quantidade: quantidade
        });

        if (error) {
            alertState.setAlert(
                error.title,
                error.message
            );
            return;
        }

        return data;
    }

    enviarRecontagem = async (codBarras: string, quantidade: number) => {
        if (!this.itemAtual || !this.recontagem) return;
        this.isLoading = true;

        // 970249

        const { data, error } = await this.getData('/api/recontagem/enviar-recontagem', {
            nroConferencia: this.recontagem.nroConferencia,
            codigoBarras: codBarras,
            quantidade: quantidade,
            nroTarefa: this.recontagem.nroTarefa,
            sequencia: this.itemAtual.sequencia
        });

        if (error) {
            alertState.setAlert(
                error.title,
                error.message
            );
            if (error.message === ERRO_DIVERGENCIA) {
                this.status = RecontagemStatus.NENHUM;
                this.clearState();
            }
            this.isLoading = false;
            return;
        }

        await this.proximoItem();
        if (!this.possuiMaisItens) {
            this.status = RecontagemStatus.AGUARDANDO_REGISTRAR_VOLUME;
        }
        this.isLoading = false;
    }

    registrarVolumes = async (quantidade: number) => {
        if (!this.recontagem) return;
        this.isLoading = true;
        this.status = RecontagemStatus.REGISTRANDO_VOLUME;
        const { error } = await this.getData('/api/conferencia/volumes', {
            nroConferencia: this.recontagem.nroConferencia,
            quantidade: quantidade
        });

        if (error) {
            alertState.setAlert(
                error.title,
                error.message
            );
            this.isLoading = false;
            this.status = RecontagemStatus.AGUARDANDO_REGISTRAR_VOLUME;
            return;
        }

        await this.imprimirEtiquetas(quantidade);
        this.isLoading = false;
        this.status = RecontagemStatus.AGUARDANDO_ENVIAR_PARA_DOCA;
    }

    async imprimirEtiquetas(quantidade?: number) {
        const response = await fetch('/api/conferencia/volumes/imprimir', {
            method: 'POST',
            body: JSON.stringify({
                nroUnico: this.recontagem?.nroUnico,
                nroSeparacao: this.recontagem?.nroSeparacao,
                quantidade
            })
        });

        if (!response.ok) {
            try {
                const errData = await response.json();
                if (errData && errData.error && errData.error.length > 0) {
                    alertState.setAlert(errData.error[0].title || 'Erro ao tentar imprimir os volumes', errData.error[0].message);
                    return;
                }
            } catch (e) {
                // not JSON
            }
            alertState.setAlert('Erro ao tentar imprimir os volumes', 'Ocorreu um erro ao gerar as etiquetas.');
            return;
        }

        const htmlText = await response.text();
        const blob = new Blob([htmlText], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);
    }

    enviarParaDoca = async () => {
        if (!this.recontagem) return;
        this.isLoading = true;
        this.status = RecontagemStatus.ENVIANDO_PARA_DOCA;

        const { error } = await this.getData('/api/conferencia/doca', {
            nroConferencia: this.recontagem.nroConferencia,
            nroNota: this.recontagem.nroNota,
            ordemCarga: this.recontagem.ordemCarga
        });

        if (error) {
            alertState.setAlert(
                error.title,
                error.message
            );
        }

        this.isLoading = false;
        this.status = RecontagemStatus.NENHUM;
        this.clearState();
    }

    cancelarRecontagem = async () => {
        // if (this.itensRecontagem.length === 0) return;
        // const itemAtual = this.itensRecontagem.filter(item => !item.conferido)[0];
        const itemAtual = this.itemAtual;

        this.isLoading = true;
        this.status = RecontagemStatus.CANCELANDO_TAREFA;

        if (itemAtual) {
            const { data, error } = await this.getData('/api/recontagem/cancelar', {
                nroTarefa: itemAtual.nroTarefa,
                sequencia: itemAtual.sequencia
            });

            if (error) {
                alertState.setAlert(
                    error.title,
                    error.message
                );
                this.isLoading = false;
                return;
            }

            console.log(data);

            this.clearState();
            console.log('cancelarRecontagemConcluido');
            this.status = RecontagemStatus.NENHUM;

        }

        this.isLoading = false;
    }

    finalizarRecontagem = async () => {
    }

    clearState() {
        this.checkout = null;
        this.recontagem = null;
        this.itemAtual = null;
        this.itensRecontagem = [];
    }
}

export const recontagemState = new RecontagemState();