<script lang="ts">
	import { onMount } from 'svelte';
	import * as SearchField from '$components/input/search';
	import { debounce } from '$lib/utils/debounce';
	import { filterState, FilterEvents } from '$lib/states/separacao.svelte'

	const searchState = new SearchField.SearchState((value: string | null) => {
		filterState.filters.empresa = Number(value);
	});
	filterState.subscribe(FilterEvents.CLEAR_STATE, () => searchState.clearAll());
	
	onMount(() => {
		const storedEmpresa = localStorage.getItem('search-empresa');
		if (storedEmpresa) {
			searchState.selectedItem = JSON.parse(storedEmpresa);
		}
	});
	
	async function searchParceiro() {
		if (searchState.searchInput.length < 1) {
			searchState.clearResults();
			return;
		}
		searchState.isLoading = true;

		const busca = JSON.stringify({busca: searchState.searchInput});
		const resp = await fetch('/api/empresa', {
			method: 'POST',
			credentials: 'include',
			body: busca
		});
		let data = await resp.json();
        searchState.searchResults = data;
		searchState.isLoading = false;
	}

	$effect(() => {
		if (searchState.selectedItem) {
			localStorage.setItem('search-empresa', JSON.stringify(searchState.selectedItem));
		} else {
			localStorage.removeItem('search-empresa');
		}
	});

</script>

<SearchField.SelectedItem
	placeholder="Empresa"
	bind:item={searchState.selectedItem}
	clear={() => searchState.clearResults()}
/>

{#if !searchState.selectedItem}
	<SearchField.Root>
		<SearchField.Input
			placeholder="Empresa"
			bind:value={searchState.searchInput}
			oninput={() => debounce(searchParceiro)()}
			isLoading={searchState.isLoading}
			onkeydown={(ev: KeyboardEvent) => {
				if (ev.key === 'Escape') {
					searchState.clearResults();
				}
			}}
		/>
		{#if searchState.searchResults.length > 0}
			<SearchField.List data={searchState.searchResults} bind:selected={searchState.selectedItem} />
		{/if}
	</SearchField.Root>
{/if}
