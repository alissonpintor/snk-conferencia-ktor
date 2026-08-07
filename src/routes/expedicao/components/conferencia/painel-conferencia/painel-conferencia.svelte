<script lang="ts">
	import Header from "./header/header.svelte";
	import PainelTarefa from "./painel-tarefa.svelte";
	import PainelItensConferencia from "./painel-itens-conferencia.svelte";
</script>

<div class="flex flex-1 flex-col gap-4">
	<!-- Cabeçalho de Conferencia -->
	<Header />

	<!-- Conteudo de Conferencia -->
	<div class="flex w-full flex-1 flex-col gap-4">
		<!-- Tarefa de Conferencia -->
		<PainelTarefa />
		<!-- Itens da Conferencia -->
		<PainelItensConferencia />
	</div>
</div>
