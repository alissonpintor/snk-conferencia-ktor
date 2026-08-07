import { type DateValue, getLocalTimeZone } from "@internationalized/date";
import type { SeparacaoFilter, Separacao, Produto } from '$lib/types/separacao';
import { notificationState, alertState } from "$lib/states/notification.svelte";


export enum FilterEvents {
	CLEAR_STATE
}

class FilterState {
	filters = $state<SeparacaoFilter>({
		empresa: null,
		parceiro: null,
		dataInicio: undefined,
		dataFim: undefined,
		nroSeparacao: null,
		nroUnico: null,
		nroPedido: null,
		ordemCarga: null,
		produto: null,
		situacao: []
	});

	#observers: { event: FilterEvents, callback: () => void }[] = $state([]);
	subscribe(event: FilterEvents, callback: () => void) {
		this.#observers.push({
			event,
			callback
		});
	}

	#notify(evt: FilterEvents) {
		this.#observers.forEach(({ event, callback }) => {
			if (evt === event) {
				callback();
			}
		});
	}

	clearState() {
		this.filters.empresa = null;
		this.filters.parceiro = null;
		this.filters.dataInicio = undefined;
		this.filters.dataFim = undefined;
		this.filters.nroSeparacao = null;
		this.filters.nroUnico = null;
		this.filters.nroPedido = null;
		this.filters.ordemCarga = null;
		this.filters.produto = null;
		this.filters.situacao = [];

		this.#notify(FilterEvents.CLEAR_STATE);
	}

	toJson() {
		return {
			empresa: this.filters.empresa,
			parceiro: this.filters.parceiro,
			dataInicio: this.filters.dataInicio && this.filters.dataInicio.toDate(getLocalTimeZone()),
			dataFim: this.filters.dataFim && this.filters.dataFim.toDate(getLocalTimeZone()),
			nroSeparacao: this.filters.nroSeparacao,
			nroUnico: this.filters.nroUnico,
			nroPedido: this.filters.nroPedido,
			ordemCarga: this.filters.ordemCarga,
			produto: this.filters.produto,
			situacao: this.filters.situacao
		};
	}
}

class SeparacaoState {
	separacoes: Separacao[] = $state([]);
	isLoading = $state(false);

	resetState() {
		this.separacoes = [];
		this.isLoading = false;
	}

	async buscarSeparacoes(filtros: SeparacaoFilter) {
		this.isLoading = true;

		if (!filtros.dataInicio && !filtros.dataFim && !filtros.nroSeparacao && !filtros.nroUnico &&
			!filtros.nroPedido && !filtros.ordemCarga && !filtros.produto && !filtros.parceiro
		) {
			alertState.setAlert(
				"Nenhum filtro selecionado",
				"Informe pelo menos um filtro para buscar as separações."
			)
			this.isLoading = false;
			return;
		}

		const resp = await fetch('/api/separacao', {
			method: 'POST',
			body: JSON.stringify(filtros)
		});
		const data = await resp.json();

		if (data.success) {
			this.separacoes = data.data;
		} else {
			this.separacoes = [];
			const errors = data.error;
			for (const error of errors) {
				notificationState.addNotification(error);
			}
		}
		this.isLoading = false;
	}

	async gerarVolumes(nroSeparacao: number) {
		const response = await fetch(`/api/separacao/${nroSeparacao}/volumes/gerar`, {
			method: "POST"
		});
		const data = await response.json()
		if (data.content.status !== "1") {
			alert("Alterado com sucesso");
		}
	}
}

class ItensSeparacaoState {
	separacao: Separacao | null = $state(null);
	itens: Produto[] = $state([]);
	isLoading = $state(false);

	resetState() {
		this.separacao = null;
		this.itens = [];
		this.isLoading = false;
	}

	async buscarItensSeparacao(separacao: Separacao) {
		if (!separacao) return;

		if (this.separacao && this.separacao.nroSeparacao === separacao.nroSeparacao) {
			return;
		}

		this.separacao = separacao;
		this.isLoading = true;
		const { nroSeparacao } = separacao;
		const response = await fetch(
			`/api/separacao/${nroSeparacao}/itens`
		);
		const data = await response.json();

		if (data.success) {
			this.itens = data.data;
		} else {
			this.itens = [];
			this.separacao = null;

			const errors = data.error;
			for (const error of errors) {
				notificationState.addNotification(error);
			}
		}
		this.isLoading = false;
	}
}

export const filterState = new FilterState();
export const separacaoState = new SeparacaoState();
export const itensSeparacaoState = new ItensSeparacaoState();
