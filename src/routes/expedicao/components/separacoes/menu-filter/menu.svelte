<script lang="ts">
    import { Calendar } from '$components/input/calendar';
	import { CalendarDate } from '@internationalized/date';
    import * as Accordion from "$components/display/accordion";
    import * as Input from '$components/input/input-field';
    import * as Sidemenu from './index';

    import { filterState, separacaoState } from '$lib/states/separacao.svelte'

	// const today = new Date()
	// filterState.filters.dataInicio = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
	//1738415
</script>

<div class="mx-auto mt-4 flex w-64 flex-col gap-2">
	<Sidemenu.BtnAplicar onclick={() => separacaoState.buscarSeparacoes(filterState.toJson())} />
	<Sidemenu.BtnLimpar />
</div>

<Accordion.Root checked={true} class="z-50 mx-4 w-64 overflow-visible">
	<Accordion.Title>Filtros</Accordion.Title>
	<Accordion.Content class="w-64 p-2">
		<div class="flex flex-col gap-2">
			<Sidemenu.SearchEmpresa />
			<Sidemenu.SearchParceiro />

			<Calendar placeholder="Dt.Inicial" bind:value={filterState.filters.dataInicio} />
			<Calendar placeholder="Dt.Final" bind:value={filterState.filters.dataFim} />

			<Input.Field
				bind:value={filterState.filters.nroSeparacao}
				type="number"
				placeholder="Nro.Separação"
			/>
			<Input.Field 
				type="number"
				bind:value={filterState.filters.nroUnico}
				placeholder="Nro.Único" 
				class="w-full" 
			/>
			<Input.Field 
				type="number" 
				bind:value={filterState.filters.ordemCarga} 
				placeholder="Ordem Carga" 
			/>
			<Sidemenu.SearchProduto />
		</div>
	</Accordion.Content>
</Accordion.Root>

<Accordion.Root checked={false} class="z-1 m-4 w-64">
	<Accordion.Title>Situações</Accordion.Title>
	<Accordion.Content class="w-64 p-2">
		<Sidemenu.Situacao />
	</Accordion.Content>
</Accordion.Root>
