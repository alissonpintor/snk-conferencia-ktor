<script lang="ts">
	import IniciarTarefa from './recontagem/iniciar-tarefa.svelte';
	import Informacoes from './recontagem/informacoes.svelte';
	import ExecutarTarefa from './recontagem/executar-tarefa.svelte';
	import RegistrarVolume from './recontagem/registrar-volume.svelte';
	import EnviarDoca from './recontagem/enviar-doca.svelte';
</script>

<div
	class="bg-base-100 rounded-box flex h-[84px] w-full flex-row items-center justify-between gap-2 p-2"
>
	<IniciarTarefa />
	<Informacoes />
	<ExecutarTarefa />
	<RegistrarVolume />
	<EnviarDoca />
</div>
