<script lang="ts">
	import { QrCode, PackagePlus } from '@lucide/svelte';
	import { recontagemState, RecontagemStatus } from '$lib/states/recontagem.svelte';
	import Image from '$components/display/image/image.svelte';
	import { alertState } from '$lib/states/notification.svelte';
	import { Info } from '@lucide/svelte';
	import { tick } from 'svelte';

	let inputCodBarras = $state<HTMLInputElement | null>(null);
	let quantidade = $state<number>(1);
	let codBarra = $state('');
	let isRegistered = $state(false);
	let isPerformingTask = $derived<boolean>(
		recontagemState.status === RecontagemStatus.EXECUTANDO_TAREFA
	);
	let showRegistered = $derived(isPerformingTask && isRegistered);

	function resetSate() {
		inputCodBarras = null;
		quantidade = 1;
		codBarra = '';
		isRegistered = false;
	}

	$effect(() => {
		if (recontagemState.status !== RecontagemStatus.EXECUTANDO_TAREFA) {
			resetSate();
		}

		if (isPerformingTask) {
			tick().then(() => {
				const input = document.getElementById('inputCodBarras') as HTMLInputElement;
				input.focus();
			});
		}
	});

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
		const produtoInfo = await recontagemState.buscarInformacoesItem(barras, quantidadeRegistrada);
		await recontagemState.enviarRecontagem(barras, quantidadeRegistrada);
		isRegistered = true;
	}
</script>

<div class="bg-base-100 rounded-box w-full p-2">

	<div class="flex flex-col gap-2 w-full">
		
		<div class="flex flex-row gap-2 items-center">
			<label class="input max-w-52">
				<PackagePlus size="18" />
				<input
					type="number"
					class="input"
					placeholder="Quantidade"
					bind:value={quantidade}
					disabled={!isPerformingTask}
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							if (!inputCodBarras) {
								inputCodBarras = document.getElementById('inputCodBarras') as HTMLInputElement;
							}
							inputCodBarras.focus();
						}
					}}
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
					disabled={!isPerformingTask}
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
	
		{#if recontagemState.itemAtual}
			<div class="bg-base-100 rounded-box">
				<div class="bg-base-100 rounded-box flex flex-col gap-2">
					<div
						class="border-base-300 rounded-box flex flex-row gap-4 border p-2"
						id={recontagemState.itemAtual.codigoProduto.toString()}
					>
						<Image
							imageSrc={`/api/produto/${recontagemState.itemAtual.codigoProduto}/image`}
							class="h-16 w-16 rounded"
						/>
	
						<div class="flex flex-col justify-around gap-1">
							<div>
								<span class="badge badge-soft badge-primary w-14"
									>{recontagemState.itemAtual.codigoProduto}</span
								>
								<span class="badge badge-soft badge-primary w-52"
									>{recontagemState.itemAtual.marca}</span
								>
							</div>
	
							<h3 class="text-[14px]">{recontagemState.itemAtual.descricaoProduto}</h3>
						</div>
					</div>
				</div>
			</div>
		{/if}

	</div>

</div>
