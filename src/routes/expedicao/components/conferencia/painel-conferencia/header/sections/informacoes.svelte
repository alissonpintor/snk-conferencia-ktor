<script lang="ts">
	import { conferenciaState } from '$lib/states/conferencia.svelte';
</script>

{#if conferenciaState.conferenciaSelecionada}
	<div class="flex flex-col justify-center gap-2">
		<div class="flex flex-row gap-2">
			<span class="badge badge-soft badge-primary"
				>{conferenciaState.conferenciaSelecionada?.checkout}</span
			>
			<h1 class="text-xl font-bold">{conferenciaState.conferenciaSelecionada?.nomeParc}</h1>
		</div>
		<div class="flex flex-row gap-1">
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>OC:</b>{conferenciaState.conferenciaSelecionada?.ordemCarga}
			</span>
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>NU:</b>{conferenciaState.conferenciaSelecionada?.nroUnico}
			</span>
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>NRO:</b>{conferenciaState.conferenciaSelecionada?.nroNota}
			</span>
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>NRO.SEP:</b>{conferenciaState.conferenciaSelecionada?.nroSeparacao}
			</span>
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>SEP.:</b>{conferenciaState.conferenciaSelecionada?.separador}
			</span>
			<span class="badge badge-soft badge-sm xl:badge-md">
				<b>NRO.CONF:</b>{conferenciaState.conferenciaSelecionada?.nroConferencia}
			</span>
		</div>
	</div>
{/if}
