<script lang="ts">
	import { QrCode, PackagePlus } from '@lucide/svelte';
	import { conferenciaState, LoadingStatus } from '$lib/states/conferencia.svelte';
	import { alertState } from '$lib/states/notification.svelte';
	import { Info } from '@lucide/svelte';
	import { tick } from 'svelte';

	let inputCodBarras = $state<HTMLInputElement | null>(null);
	let quantidade = $state<number>(1);
	let codBarra = $state('');
	let isRegistered = $state(false);
	let isInputDisabled = $derived(!conferenciaState.conferenciaIniciada);
	let showRegistered = $derived(conferenciaState.conferenciaIniciada && isRegistered);

	let isPerformingTask = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.EXECUTANDO_TAREFA
	);

	function resetSate() {
		inputCodBarras = null;
		quantidade = 1;
		codBarra = '';
		isRegistered = false;
	}

	$effect(() => {
		if (conferenciaState.loadingStatus !== LoadingStatus.EXECUTANDO_TAREFA) {
			resetSate();
		}

		if (isPerformingTask) {
			tick().then(() => {
				const input = document.getElementById('inputCodBarras') as HTMLInputElement;
				input.focus();
			})
		}
	})

	async function registrarConferencia() {
		isRegistered = false;
		const barras = codBarra.replace(/\s/g, '');
		const quantidadeRegistrada = quantidade;

		if (!quantidade) {
			alertState.setAlert('Erro ao tentar registrar o item', 'Informe a quantidade');
			return;
		}

		codBarra = '';
		quantidade = 1;
		inputCodBarras?.focus();
		const produtoInfo = await conferenciaState.buscarInformacaoProduto(barras, quantidadeRegistrada);

		if (!produtoInfo.success) {
			alertState.setAlert(produtoInfo.error[0].title, produtoInfo.error[0].message);
			return;
		}

		if (!produtoInfo.data.existeNaConferencia) {
			alertState.setAlert(
				'Erro ao tentar registrar o item',
				`O produto ${produtoInfo.data.descricaoProduto} não existe na conferência`
			);
			return;
		}

		const produtoRegister = await conferenciaState.registrarItemConferido(barras, quantidadeRegistrada);
		if (!produtoRegister.success) {
			alertState.setAlert(produtoRegister.error[0].title, produtoRegister.error[0].message);
		}
		isRegistered = true;
	}
</script>

<div class="bg-base-100 rounded-box flex w-full flex-row items-center gap-2 p-2">
	<label class="input max-w-52">
		<PackagePlus size="18" />
		<input
			type="number"
			class="input"
			placeholder="Quantidade"
			bind:value={quantidade}
			disabled={isInputDisabled || !isPerformingTask}
			onkeydown={
				(e) => {
					if (e.key === 'Enter') {
						if (!inputCodBarras) {
							inputCodBarras = document.getElementById("inputCodBarras") as HTMLInputElement;
						}
						inputCodBarras.focus();
					}
				}
			}
		/>
	</label>

	<label class="input max-w-52">
		<QrCode size="18" />
		<input
			type="text"
			class="input"
			placeholder="Produto"
			id="inputCodBarras"
			bind:this={inputCodBarras}
			bind:value={codBarra}
			disabled={isInputDisabled || !isPerformingTask}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					registrarConferencia();
				}
			}}
		/>
	</label>

	<div class="h-6">
		{#if showRegistered}
			<div class="badge badge-soft badge-success">
				<Info size="16" />
				Registrado
			</div>
		{/if}
	</div>
</div>
