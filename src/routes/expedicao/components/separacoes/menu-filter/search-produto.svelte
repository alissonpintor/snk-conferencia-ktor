<script lang="ts">
	import * as SearchField from '$components/input/search';
	import { debounce } from '$lib/utils/debounce';
	import { filterState, FilterEvents } from '$lib/states/separacao.svelte';

	const searchState = new SearchField.SearchState((value: string | null) => {
		filterState.filters.produto = Number(value);
	});
	filterState.subscribe(FilterEvents.CLEAR_STATE, () => searchState.clearAll());

	async function searchProduto() {
		if (searchState.searchInput.length < 1) {
			searchState.clearResults();
			return;
		}
		searchState.isLoading = true;
		const busca = JSON.stringify({ busca: searchState.searchInput });
		const resp = await fetch('/api/produto', {
			method: 'POST',
			credentials: 'include',
			body: busca
		});
		let data = await resp.json();
		searchState.searchResults = data;
		searchState.isLoading = false;
	}
</script>

<SearchField.SelectedItem
	placeholder="Produto"
	bind:item={searchState.selectedItem}
	clear={() => searchState.clearResults()}
/>

{#if !searchState.selectedItem}
	<SearchField.Root>
		<SearchField.Input
			placeholder="Produto"
			bind:value={searchState.searchInput}
			oninput={() => debounce(searchProduto)()}
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
