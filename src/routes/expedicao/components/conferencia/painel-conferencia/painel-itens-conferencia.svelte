<script lang="ts">
	import Image from '$components/display/image/image.svelte';
	import { conferenciaState } from '$lib/states/conferencia.svelte';
	import { ArrowDown, ArrowUp } from '@lucide/svelte';

	function rolarParaItemAtivo(id: string) {
		const elemento = document.getElementById(id);
		if (elemento) {
			elemento.scrollIntoView({
				behavior: 'smooth', // Adiciona uma animação de rolagem suave
				block: 'center' // Rola até o topo do elemento
			});
		}
	}

    $effect(() => {
        if (conferenciaState.itemConferido) {
            rolarParaItemAtivo(conferenciaState.itemConferido.codProduto.toString());
        }
    })
</script>

<div class="bg-base-100 rounded-box flex flex-col gap-2 p-2 h-full">
	{#if conferenciaState.itensConferencia.length > 0}
		<div class="flex flex-row gap-4">
			<h3> <b>Total de Itens:</b> {conferenciaState.itensConferencia.length}</h3>
			<h3> <b>Conferidos:</b> {conferenciaState.itensConferencia.filter(item => item.qtdadeConferida > 0).length}</h3>
		</div>

		<div class="bg-base-100 rounded-box flex h-[500px] flex-col gap-2 overflow-y-auto p-2">
			{#each conferenciaState.itensConferencia as item}
				{@const image = `/api/produto/${item.codProduto}/image`}
				<div
					class="border-base-300 rounded-box flex flex-row gap-4 border p-2"
					class:border-blue-300={item.codProduto === conferenciaState.itemConferido?.codProduto}
					class:bg-blue-100={item.codProduto === conferenciaState.itemConferido?.codProduto}
					id={item.codProduto.toString()}
				>
					<Image imageSrc={image} class="h-16 w-16 rounded" />
	
					<div class="flex flex-col justify-around gap-1">
						<div class="flex flex-row gap-4">
							{#if item.possuiDivergencia}
								<span class="badge badge-soft badge-error">
									{#if Number(item.qtdadeConferida) > Number(item.quantidade)}
										<ArrowUp size="16" /> Quantidade conferida é maior
									{/if}
	
									{#if Number(item.qtdadeConferida) < Number(item.quantidade)}
										<ArrowDown size="16" /> Quantidade conferida é menor
									{/if}
								</span>
							{/if}
						</div>
						<div>
							<span class="badge badge-soft badge-primary w-14">{item.codProduto}</span>
							<span class="badge badge-soft badge-primary w-52">{item.marca}</span>
							<span class="badge badge-soft badge-primary w-14">{item.unidade}</span>
							
							<span
								class="badge badge-soft badge-primary w-46"
								class:badge-primary={item.qtdadeConferida > 0}
								class:badge-error={item.qtdadeConferida === 0}
							>
								<b>Conferido:</b>
								{item.qtdadeConferida ? item.qtdadeConferida : 0}
							</span>
	
							{#if Array.isArray(item.sequencias) && item.sequencias.length > 0}
								<button class="btn btn-sm" onclick={() => conferenciaState.recontarItem(item)}>
									Recontar
								</button>
							{/if}
						</div>
	
						<h3 class="text-[14px]">{item.descricaoProduto}</h3>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
