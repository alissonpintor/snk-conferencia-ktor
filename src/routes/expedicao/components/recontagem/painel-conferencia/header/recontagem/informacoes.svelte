<script lang="ts">
	import { recontagemState, RecontagemStatus } from '$lib/states/recontagem.svelte';

	const waitingStart = $derived<boolean>(recontagemState.status === RecontagemStatus.NENHUM);
    const loadingTask = $derived<boolean>(recontagemState.status === RecontagemStatus.INICIANDO_TAREFA);
    const showInfo = $derived(!waitingStart && !loadingTask);
</script>

{#if showInfo}
	<div class="flex flex-col justify-center gap-2">
		<div class="flex flex-row gap-2">
			<span class="badge badge-soft badge-primary">{recontagemState.checkout}</span>
			<h1 class="text-xl font-bold">{recontagemState.recontagem?.nomeParc}</h1>
		</div>
		<div class="flex flex-row gap-1">
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>OC:</b>{recontagemState.recontagem?.ordemCarga}
			</span>
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>NU:</b>{recontagemState.recontagem?.nroUnico}
			</span>
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>NRO:</b>{recontagemState.recontagem?.nroNota}
			</span>
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>SEP.:</b>{recontagemState.recontagem?.separador}
			</span>
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>NRO.CONF:</b>{recontagemState.recontagem?.nroConferencia}
			</span>
		</div>
	</div>
{/if}
