<script lang="ts">
	import { FilterEvents, filterState } from "$lib/states/separacao.svelte";


	const SelectedState = {
		ALL: 2,
		SOME: 1,
		NONE: 0
	}

	type SituacaoCheckbox = {
		id: number;
		name: string;
		isChecked: boolean
	}

	type SituacoesType = {
		todas: boolean;
		situacoes: SituacaoCheckbox[];
		selectedState: () => number;
		selectAll: () => void;
		unselectAll: () => void;
		setSelecteds: () => void
	};

	const SituacoesState = $state<SituacoesType>({
		todas: true,
		situacoes: [
			{
				id: 0,
				name: "Aguardando Separação",
				isChecked: true
			},
			{
				id: 1,
				name: "Enviado para Separação",
				isChecked: true
			},
			{
				id: 2,
				name: "Em Processo de Separação",
				isChecked: true
			},
			{
				id: 3,
				name: "Aguardando Conferência",
				isChecked: true
			},
			{
				id: 4,
				name: "Em Processo de Conferência",
				isChecked: true
			},
			{
				id: 12,
				name: "Conferência com Divergência",
				isChecked: true
			},
			{
				id: 6,
				name: "Aguardando Recontagem",
				isChecked: true
			},			
			{
				id: 17,
				name: "Aguardando Conferência de Volumes",
				isChecked: true
			},			
			{
				id: 9,
				name: "Conferência Validada",
				isChecked: true
			},		
			{
				id: 16,
				name: "Concluido",
				isChecked: true
			},		
			{
				id: 100,
				name: "Cancelada",
				isChecked: true
			},		
			{
				id: 99,
				name: "Possui Retorno de Mercadoria",
				isChecked: true
			},		
		],
		
		selectedState: function() {
			const count = this.situacoes.reduce((acumulator, el) => el.isChecked ? acumulator + 1 : acumulator, 0);
			return count === this.situacoes.length ? SelectedState.ALL : count === 0 ? SelectedState.NONE : SelectedState.SOME;
		},

		selectAll: function() {
			this.situacoes.forEach(el => el.isChecked=true);
			this.setSelecteds();
		},

		unselectAll: function() {
			this.situacoes.forEach(el => el.isChecked=false);
			this.setSelecteds();
		},

		setSelecteds: function(){
			const selected: number[] = [];
			this.situacoes
				.filter((el) => el.isChecked)
				.forEach((el) => selected.push(el.id));
			filterState.filters.situacao = selected;
		}
	});

	filterState.subscribe(FilterEvents.CLEAR_STATE, () => SituacoesState.unselectAll())
</script>
<div class="flex flex-col gap-1">
	<label class="label">
		<input 
			type="checkbox" 
			class="checkbox"
			class:checkbox-primary={SituacoesState.todas}
			bind:checked={SituacoesState.todas}
			indeterminate={SelectedState.SOME === SituacoesState.selectedState()}
			onchange={() => SituacoesState.todas ? SituacoesState.selectAll() : SituacoesState.unselectAll()}
		/>
		Todas
	</label>
	{#each SituacoesState.situacoes as situacao}
		<label class="label">
			<input 
				type="checkbox" 
				class="checkbox"
				onchange={() => {SituacoesState.todas = SituacoesState.selectedState() === SelectedState.ALL, SituacoesState.setSelecteds()}}
				class:checkbox-primary={situacao.isChecked}
				bind:checked={situacao.isChecked}
			/>
			{situacao.name}
		</label>
	{/each}
</div>
