<script lang="ts">
	import Image from '$components/display/image/image.svelte';
	import { recontagemState } from '$lib/states/recontagem.svelte';
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
</script>

<div class="bg-base-100 rounded-box flex flex-col gap-2 p-2 h-full">
	{#if recontagemState.itensRecontagem.length > 0}
		<div class="bg-base-100 rounded-box flex h-[500px] flex-col gap-2 overflow-y-auto p-2">
			{#each recontagemState.itensRecontagem as item}
				{@const image = `/api/produto/${item.codigoProduto}/image`}
				<div
					class="border-base-300 rounded-box flex flex-row gap-4 border p-2"
					id={item.codigoProduto.toString()}
				>
					<Image imageSrc={image} class="h-16 w-16 rounded" />
	
					<div class="flex flex-col justify-around gap-1">
						<div>
							<span class="badge badge-soft badge-primary w-14">{item.codigoProduto}</span>
							<span class="badge badge-soft badge-primary w-52">{item.marca}</span>
						</div>
	
						<h3 class="text-[14px]">{item.descricaoProduto}</h3>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
