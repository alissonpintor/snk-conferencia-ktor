<script lang="ts">
    import { Calendar } from '$components/input/calendar';
	import * as Input from '$components/input/input-field';
    import SearchEmpresa from './search-empresa.svelte';
    import SearchConferente from './search-conferente.svelte';
    import ButtonAplicar from './button-aplicar.svelte';
    import ButtonLimpar from './button-limpar.svelte';
    import { filterState, divergenciaState } from '$lib/states/divergencia.svelte';
    
</script>

<div class="bg-base-100 rounded-box flex w-72 flex-col gap-2">
	<div class="mx-auto mt-4 flex w-64 flex-col gap-2">
		<ButtonAplicar onclick={() => divergenciaState.buscarDivergencias(filterState.filtersToJson())} />
		<ButtonLimpar onclick={() => filterState.limparFiltros()} />
        
        <SearchEmpresa bind:empresa={filterState.filters.empresa} />
        <SearchConferente bind:conferente={filterState.filters.conferente} />

        <Calendar placeholder="Dt.Inicial" bind:value={filterState.filters.dataInicio} />
        <Calendar placeholder="Dt.Final" bind:value={filterState.filters.dataFim} />

        <Input.Field type="number" bind:value={filterState.filters.nroUnico} placeholder="Nro.Único" />
        <Input.Field type="number" bind:value={filterState.filters.nroSeparacao} placeholder="Nro.Separação" />
    </div>
</div>
