<script lang="ts">
	import { onMount } from 'svelte';
	import * as SearchField from './search';
	import { debounce } from '$lib/utils/debounce';

	const LOCAL_STORAGE_NAME = 'search-divergencia-conferente'
	let { conferente=$bindable() } = $props();
	const searchState = new SearchField.SearchState();

	onMount(() => {
		const storageProp = localStorage.getItem(LOCAL_STORAGE_NAME);
		if (storageProp) {
			searchState.selectedItem = JSON.parse(storageProp);
		}
	});
	
	async function search() {
		if (searchState.input.length < 1) {
			searchState.clearResults();
			return;
		}
		searchState.isLoading = true;
		const busca = searchState.input;
		const resp = await fetch(`/api/usuarios?q=${busca}`, {
			method: 'GET',
		});
		let data = await resp.json();
        searchState.searchResults = data;
		searchState.isLoading = false;
	}

	function setConferente() {
		conferente = searchState.selectedItem?.id;
	}

	$effect(() => {
		if (searchState.selectedItem) {
			localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(searchState.selectedItem));
			// setConferente();
		} else {
			localStorage.removeItem(LOCAL_STORAGE_NAME);
			// setConferente();
		}
	});

</script>

<SearchField.SelectedItem
	placeholder="Conferente"
	bind:item={searchState.selectedItem}
	clear={() => searchState.clearResults()}
/>

{#if !searchState.selectedItem}
	<SearchField.Root props={searchState}>
		<SearchField.Input
			placeholder="Conferente"
			bind:value={searchState.input}
			oninput={() => {
				debounce(search, 300)();
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
