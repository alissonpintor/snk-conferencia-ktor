<script lang="ts">
	import BuscarTarefa from "./sections/buscar-tarefa.svelte";
	import IniciarTarefa from "./sections/iniciar-tarefa.svelte";
	import Informacoes from "./sections/informacoes.svelte";
	import ExecutarTarefa from "./sections/executar-tarefa.svelte";
	import RegistrarVolume from "./sections/registrar-volume.svelte";
	import EnviarDoca from "./sections/enviar-doca.svelte";
</script>

<div class="bg-base-100 rounded-box flex h-[84px] w-full flex-row items-center justify-between gap-2 p-2">
	<BuscarTarefa />
	<Informacoes />
	<!-- <IniciarTarefa /> -->
	<ExecutarTarefa />
	<RegistrarVolume />
	<EnviarDoca />
</div>
