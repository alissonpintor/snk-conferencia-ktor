import { alertState } from '$lib/states/notification.svelte';
import type { Conferencia, ItemConferencia } from '$lib/types/conferencia';

export enum LoadingStatus {
	NENHUM = 0,
	CARREGANDO_CHECKOUT = 1,
	AGUARDANDO_INICIAR_TAREFA = 2,
	INICIANDO_TAREFA = 3,
	EXECUTANDO_TAREFA = 4,
	CANCELANDO_TAREFA = 5,
	FINALIZANDO_TAREFA = 6,
	AGUARDANDO_REGISTRAR_VOLUME = 7,
	REGISTRANDO_VOLUME = 8,
	AGUARDANDO_ENVIAR_PARA_DOCA = 9,
	ENVIANDO_PARA_DOCA = 10
}

class ConferenciaState {
	conferenciaSelecionada = $state<Conferencia | null>(null);
	itensConferencia = $state<ItemConferencia[]>([]);
	itemConferido = $state<ItemConferencia | null>(null);
	conferenciaIniciada = $state(false);
	loadingStatus: LoadingStatus = $state(LoadingStatus.NENHUM);
	sendItensNotChecked = $state(false);
	sendItensDivergents = $state(false);

	async buscarConferenciaPorCheckout(checkout: string) {
		this.loadingStatus = LoadingStatus.CARREGANDO_CHECKOUT;

		const response = await fetch('/api/conferencia/', {
			method: 'POST',
			body: JSON.stringify({
				checkout: checkout
			})
		});

		const dataResponse = await response.json();

		if (dataResponse.success) {
			if (Array.isArray(dataResponse.data) && dataResponse.data.length > 0) {
				this.loadingStatus = LoadingStatus.AGUARDANDO_INICIAR_TAREFA;
				this.conferenciaSelecionada = dataResponse.data[0];
			} else {
				alertState.setAlert(
					'Checkout não possui conferência',
					'O checkout informado não possui nenhuma conferência'
				);
				this.loadingStatus = LoadingStatus.NENHUM;
			}
		} else {
			alertState.setAlert('Erro ao buscar checkout', dataResponse.error[0].message);
			this.loadingStatus = LoadingStatus.NENHUM;
		}
	}

	async buscarConferencia(nroConferencia: number) {
		const resp = await fetch('/api/conferencia/', {
			method: 'POST',
			body: JSON.stringify({
				nroConferencia: nroConferencia
			})
		});
		const data = await resp.json();
		return data;
	}

	async startTask(checkout: string) {
		if (!checkout) {
			alertState.setAlert('Checkout não foi informado', 'Informe um checkout para buscar a tarefa');
		}

		this.loadingStatus = LoadingStatus.CARREGANDO_CHECKOUT;
		const resp = await fetch(`/api/conferencia/iniciar`, {
			method: 'POST',
			body: JSON.stringify({
				checkout: checkout
			})
		});
		const { data, error } = await resp.json();
		
		if (error) {
			alertState.setAlert(error[0].title, error[0].message);
			this.loadingStatus = LoadingStatus.NENHUM;
			return;
		}
		
		const nroConferencia = data[0].nroConferencia;
		const dataResponse = await this.buscarConferencia(nroConferencia);
		this.conferenciaSelecionada = dataResponse.data[0];
		await this.buscarItens();
		this.conferenciaIniciada = true;
		this.loadingStatus = LoadingStatus.EXECUTANDO_TAREFA;
	}

	async iniciarTarefa() {
		if (this.conferenciaSelecionada) {
			this.loadingStatus = LoadingStatus.INICIANDO_TAREFA;
			const resp = await fetch(`/api/conferencia/iniciar`, {
				method: 'POST',
				body: JSON.stringify({
					checkout: this.conferenciaSelecionada.checkout
				})
			});
			const { success, data, error } = await resp.json();
			if (success) {
				this.conferenciaSelecionada.nroConferencia = data[0].nroConferencia;
				await this.buscarItens();
				this.conferenciaIniciada = true;
			} else {
				alertState.setAlert(error[0].title, error[0].message);
			}
			this.loadingStatus = LoadingStatus.EXECUTANDO_TAREFA;
		}
	}

	async cancelarTarefa() {
		if (this.conferenciaSelecionada) {
			this.loadingStatus = LoadingStatus.CANCELANDO_TAREFA;
			const resp = await fetch(`/api/conferencia/cancelar`, {
				method: 'POST',
				body: JSON.stringify({
					nroConferencia: this.conferenciaSelecionada.nroConferencia
				})
			});
			const { success, data, error } = await resp.json();
			console.log(success, data, error);
			if (success) {
				this.limparConferencia();
			} else {
				alertState.setAlert(error[0].title, error[0].message);
			}
			this.loadingStatus = LoadingStatus.NENHUM;
		}
	}

	async validarConferencia() {
		if (this.conferenciaSelecionada) {
			this.loadingStatus = LoadingStatus.FINALIZANDO_TAREFA;

			const possuirProdutosNaoConferidos = this.itensConferencia.some((item) => {
				return !item.qtdadeConferida || item.qtdadeConferida === 0;
			});

			if (!this.sendItensNotChecked && possuirProdutosNaoConferidos) {
				alertState.setAlert(
					'Produtos não conferidos',
					'Existem produtos na conferência que ainda não foram conferidos. Deseja enviar mesmo assim?',
					{
						text: 'Confirmar',
						action: () => {
							this.sendItensNotChecked = true;
						}
					},
					true
				);
				this.loadingStatus = LoadingStatus.EXECUTANDO_TAREFA;
				return;
			}

			let possuiDivergencia = false;
			for (const item of this.itensConferencia) {
				if (item.qtdadeConferida < item.quantidade || item.qtdadeConferida > item.quantidade) {
					item.possuiDivergencia = true;
					possuiDivergencia = true;
				}
			}
			if (!this.sendItensDivergents && possuiDivergencia) {
				alertState.setAlert(
					'Produtos divergentes',
					'Existem produtos na conferência que estão com a quantidade conferida diferente da quantidade do pedido. Deseja enviar mesmo assim?',
					{
						text: 'Confirmar',
						action: () => {
							this.sendItensDivergents = true;
						}
					},
					true
				);
				this.loadingStatus = LoadingStatus.EXECUTANDO_TAREFA;
				return;
			}

			// this.loadingStatus = LoadingStatus.EXECUTANDO_TAREFA;
			await this.finalizarConferencia();
		}
	}

	async finalizarConferencia() {
		if (this.conferenciaSelecionada) {
			const response = await fetch('/api/conferencia/finalizar', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nroConferencia: this.conferenciaSelecionada.nroConferencia
				})
			});
			const { success, error } = await response.json();
			if (success) {
				await this.removerItensConferencia();
				this.loadingStatus = LoadingStatus.AGUARDANDO_REGISTRAR_VOLUME;
			} else {
				alertState.setAlert(error[0].title, error[0].message);
				this.limparConferencia();
				this.loadingStatus = LoadingStatus.NENHUM;
			}
		}
	}

	async recontarItem(item: ItemConferencia) {
		if (item && Array.isArray(item.sequencias) && item.sequencias.length > 0) {
			const response = await fetch('/api/conferencia/remover-itens', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nroConferencia: this.conferenciaSelecionada?.nroConferencia,
					sequencias: item.sequencias
				})
			});
			const { success, error } = await response.json();

			if (success) {
				this.itensConferencia.forEach((produto) => {
					if (produto.codProduto === item.codProduto) {
						produto.qtdadeConferida = 0;
						produto.sequencias = [];
						produto.qtdadeAvariada = 0;
						produto.possuiDivergencia = false;
						this.itemConferido = produto;
					}
				});
			} else {
				alertState.setAlert('Erro ao recontar item', error[0].message);
			}
		}
	}

	async removerItensConferencia(item: ItemConferencia | null = null) {
		const response = await fetch('/api/conferencia/remover-itens', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nroConferencia: this.conferenciaSelecionada?.nroConferencia,
				sequencias: item ? item.sequencias : null
			})
		});
		const { error } = await response.json();

		if (error) {
			alertState.setAlert('Erro ao limpar os itens da conferência', error[0].message);
		}
	}

	async registrarVolumes(quantidade: number) {
		if (this.conferenciaSelecionada) {
			this.loadingStatus = LoadingStatus.REGISTRANDO_VOLUME;
			const response = await fetch('/api/conferencia/volumes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nroConferencia: this.conferenciaSelecionada.nroConferencia,
					quantidade
				})
			});

			const { success, error } = await response.json();

			if (success) {
				// await this.enviarParaDoca();
				await this.imprimirEtiquetas(quantidade);
				this.loadingStatus = LoadingStatus.AGUARDANDO_ENVIAR_PARA_DOCA;
			} else {
				alertState.setAlert(error[0].title, error[0].message);
				this.loadingStatus = LoadingStatus.NENHUM;
			}
		}
	}

	async imprimirEtiquetas(quantidade?: number) {
		const response = await fetch('/api/conferencia/volumes/imprimir', {
			method: 'POST',
			body: JSON.stringify({
				nroUnico: this.conferenciaSelecionada?.nroUnico,
				nroSeparacao: this.conferenciaSelecionada?.nroSeparacao,
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

	async enviarParaDoca() {
		this.loadingStatus = LoadingStatus.ENVIANDO_PARA_DOCA;
		const response = await fetch('/api/conferencia/doca', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nroConferencia: this.conferenciaSelecionada?.nroConferencia,
				nroNota: this.conferenciaSelecionada?.nroNota,
				ordemCarga: this.conferenciaSelecionada?.ordemCarga
			})
		});

		const { success, error } = await response.json();

		if (success) {
			this.limparConferencia();
			this.loadingStatus = LoadingStatus.NENHUM;
		} else {
			alertState.setAlert(error[0].title, error[0].message);
			this.loadingStatus = LoadingStatus.AGUARDANDO_ENVIAR_PARA_DOCA;
		}
	}

	async buscarTarefasPendentes() {
		const resp = await fetch(`/api/conferencia/pendentes`);
		const respData = await resp.json();

		if (!respData.success) {
			alertState.setAlert(respData.error[0].title, respData.error[0].message);
		}

		if (respData.data && respData.data.length > 0) {
			this.conferenciaSelecionada = respData.data[0];
			await this.iniciarTarefa();
			alertState.setAlert(
				'Existem conferências em aberto',
				`A conferencia nro ${respData.data[0].nroConferencia} esta pendente.`
			);
		}
	}

	async buscarItens() {
		const resp = await fetch('/api/conferencia/itens', {
			method: 'POST',
			body: JSON.stringify({
				nroConferencia: this.conferenciaSelecionada?.nroConferencia
			})
		});
		const { success, data, error } = await resp.json();
		if (success) {
			this.itensConferencia = data;
			await this.atualizarSaldoProduto();
		} else {
			console.log(error);
		}
	}

	async buscarInformacaoProduto(codBarra: string, quantidade: number) {
		const response = await fetch('/api/conferencia/info', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nroConferencia: this.conferenciaSelecionada?.nroConferencia,
				codBarra,
				quantidade
			})
		});

		const { success, data, error } = await response.json();
		return {
			success,
			data,
			error
		};
	}

	async registrarItemConferido(codBarra: string, quantidade: number) {
		console.log(codBarra);
		const response = await fetch('/api/conferencia/registrar', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nroConferencia: this.conferenciaSelecionada?.nroConferencia,
				codBarra,
				quantidade
			})
		});

		const { success, error } = await response.json();

		if (success) {
			this.atualizarSaldoProduto(codBarra);
		}

		return {
			success,
			error
		};
	}

	async atualizarSaldoProduto(codBarra: string | null = null, codProduto: number | null = null) {
		const response = await fetch('/api/conferencia/itens/saldo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nroConferencia: conferenciaState.conferenciaSelecionada?.nroConferencia,
				codBarra,
				codProduto
			})
		});

		const { success, data, error } = await response.json();

		if (success) {
			data.forEach((item: ItemConferencia) => {
				this.itensConferencia.forEach((produto) => {
					if (produto.codProduto === item.codProduto) {
						produto.qtdadeConferida = item.qtdadeConferida;
						produto.sequencias = item.sequencias;
						produto.qtdadeAvariada = item.qtdadeAvariada;
						produto.possuiDivergencia = item.possuiDivergencia;

						if (codBarra || codProduto) this.itemConferido = produto;
					}
				});
			});
		} else {
			console.log(error);
		}
	}

	limparConferencia() {
		if (this.conferenciaSelecionada) {
			this.conferenciaSelecionada.nroConferencia = null;
		}
		this.conferenciaSelecionada = null;
		this.itensConferencia = [];
		this.conferenciaIniciada = false;
		this.itemConferido = null;
		this.loadingStatus = LoadingStatus.NENHUM;
		this.sendItensDivergents = false;
		this.sendItensNotChecked = false;
	}
}

export const conferenciaState = new ConferenciaState();
