import type {
    Divergencia,
    Produto,
    DivergenciaFilter
} from "$lib/types/divergencia"
import { getLocalTimeZone } from "@internationalized/date";
import type { RowSelectionState } from "@tanstack/table-core";


class FilterState {
    filters = $state<DivergenciaFilter>({
        empresa: null,
        conferente: null,
        dataInicio: undefined,
        dataFim: undefined,
        nroUnico: null,
        nroSeparacao: null
    })

    limparFiltros() {
        this.filters.empresa = null;
        this.filters.conferente = null;
        this.filters.dataInicio = undefined;
        this.filters.dataFim = undefined;
        this.filters.nroUnico = null;
        this.filters.nroSeparacao = null;
    };

    filtersToJson() {
        return {
            empresa: this.filters.empresa,
            conferente: this.filters.conferente,
            dataInicio: (this.filters.dataInicio && this.filters.dataInicio.toDate(getLocalTimeZone())),
            dataFim: (this.filters.dataFim && this.filters.dataFim.toDate(getLocalTimeZone())),
            nroUnico: this.filters.nroUnico,
            nroSeparacao: this.filters.nroSeparacao,
        };
    };
}

class DivergenciaState {
    divergencias: Divergencia[] = $state([]);
    isLoading = $state(false);

    async buscarDivergencias(filtros: DivergenciaFilter) {
        this.isLoading = true;
        const resp = await fetch('/api/separacao/divergencia', {
            method: 'POST',
            body: JSON.stringify(filtros)
        });
        const data = await resp.json();

        if (data.success) {
            this.divergencias = data.data;
        } else {
            this.divergencias = [];
        }
        this.isLoading = false;
    }
}

class ItensDivergenciaState {
    divergencia: Divergencia | null = $state(null);
    itens: Produto[] = $state([]);
    isLoading = $state(false);
    rowSelection = $state<RowSelectionState>({});
    isRowSelected = $derived(Object.keys(this.rowSelection).length > 0);
    isRowsTrated = $derived.by(() => {
        let state = this.itens.length > 0;
        if (state) {
            for (const item of this.itens) {
                if (!item.tratativa || !item.motivo) {
                    state = false;
                    break;
                }
            }
        }
        return state;
    })

    setCortar() {
        for (const key of Object.keys(this.rowSelection)) {
            const item = this.itens.find(i => Number(i.codigo) === Number(key));
            if (item) item.tratativa = 1;
        }
    }

    setRecontar() {
        for (const key of Object.keys(this.rowSelection)) {
            const item = this.itens.find(i => Number(i.codigo) === Number(key));
            if (item) item.tratativa = 2;
        }
    }

    setMotivo(motivo: number) {
        for (const key of Object.keys(this.rowSelection)) {
            const item = this.itens.find(i => Number(i.codigo) === Number(key));
            if (item) item.motivo = motivo;
        }
    }

    clearState() {
        this.divergencia = null;
        this.itens = [];
        this.rowSelection = {};
        this.isLoading = false;
    }

    async buscarItensDivergencia(divergencia: Divergencia) {
        if (!divergencia) return;

        if (this.divergencia && this.divergencia.nroSeparacao === divergencia.nroSeparacao) {
            return;
        }

        this.clearState();
        this.divergencia = divergencia;

        this.isLoading = true;
        const { nroSeparacao, nroConferencia } = divergencia;
        const response = await fetch(`/api/separacao/divergencia/itens?nroSeparacao=${nroSeparacao}&nroConferencia=${nroConferencia}`)
        const data = await response.json();

        if (data.success) {
            this.itens = data.data;
        } else {
            this.itens = [];
            this.divergencia = null;
        }
        this.isLoading = false;
    }

    // codigo: number;
    // motivo: number;
    // controle?: string;
    // qtdConferida?: number;

    // nroSeparacao: number;
    // nroConferencia: number;
    // cortar?: Item[]
    // recontar?: Item[]
    // retirar?: Item[]

    async salvarTratativa() {
        if (this.divergencia && this.isRowsTrated) {
            const cortes = [];
            const recontar = [];
            this.isLoading = true;

            for (const item of this.itens) {
                const newItem = {
                    codigo: item.codigo,
                    motivo: item.motivo,
                    controle: "",
                    qtdConferida: item.qtdConferida
                }
                if (Number(item.tratativa) === 1) cortes.push(newItem);
                if (Number(item.tratativa) === 2) recontar.push(newItem);
            }

            const payload = {
                nroSeparacao: this.divergencia.nroSeparacao,
                nroConferencia: this.divergencia.nroConferencia,
                cortar: cortes,
                recontar: recontar
            }

            const response = await fetch('/api/separacao/divergencia/tratar', {
                method: 'POST',
                body: JSON.stringify(payload)
            })
            const data = await response.json();

            this.clearState();
            return data;
        }
    }

}


export const filterState = new FilterState();
export const divergenciaState = new DivergenciaState();
export const itensDivergenciaState = new ItensDivergenciaState();