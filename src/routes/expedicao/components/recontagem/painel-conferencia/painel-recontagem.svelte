<script lang="ts">
	import HeaderRecontagem from "./header/header.svelte";
	import PainelTarefa from "./painel-tarefa.svelte";
	import PainelItensConferencia from "./painel-itens-recontagem.svelte";
</script>

<div class="flex flex-1 flex-col gap-4">
	<!-- Cabeçalho de Conferencia -->
	<HeaderRecontagem />

	<!-- Conteudo de Conferencia -->
	<div class="flex w-full flex-1 flex-col gap-4">
		<!-- Tarefa de Conferencia -->
		<PainelTarefa />
		<!-- Itens da Conferencia -->
		<PainelItensConferencia />
		<!-- <PainelVolume /> -->
	</div>
</div>
