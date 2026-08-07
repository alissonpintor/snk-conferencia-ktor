<script lang="ts">
	import { onMount } from 'svelte';
	import * as SearchField from './search';
	import { debounce } from '$lib/utils/debounce';

	let { empresa = $bindable() } = $props();
	const searchState = new SearchField.SearchState();

	onMount(() => {
		const storedEmpresa = localStorage.getItem('search-empresa');
		if (storedEmpresa) {
			searchState.selectedItem = JSON.parse(storedEmpresa);
		}
	});

	async function searchParceiro() {
		if (searchState.input.length < 1) {
			searchState.clearResults();
			return;
		}
		searchState.isLoading = true;
		const busca = JSON.stringify({ busca: searchState.input });
		const resp = await fetch('/api/empresa', {
			method: 'POST',
			credentials: 'include',
			body: busca
		});
		let data = await resp.json();
		searchState.searchResults = data;
		searchState.isLoading = false;
	}

	function setEmpresa() {
		empresa = searchState.selectedItem?.id;
	}

	$effect(() => {
		if (searchState.selectedItem) {
			localStorage.setItem('search-divergencia-empresa', JSON.stringify(searchState.selectedItem));
			// setEmpresa()
		} else {
			localStorage.removeItem('search-divergencia-empresa');
			// setEmpresa()
		}
	});
</script>

<SearchField.SelectedItem
	placeholder="Empresa"
	bind:item={searchState.selectedItem}
	clear={() => searchState.clearResults()}
/>

{#if !searchState.selectedItem}
	<SearchField.Root props={searchState}>
		<SearchField.Input
			placeholder="Empresa"
			bind:value={searchState.input}
			oninput={() => {
				debounce(searchParceiro, 300)();
			}}
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
