<script lang="ts">
	import Notify from './components/notifications/notify.svelte';
	import Alert from './components/notifications/alert.svelte';
	import * as Tabs from "$components/navigation/tabs";
	import Separacoes from './components/separacoes/separacoes.svelte';
	import Divergencias from './components/divergencias/divergencias.svelte';
	// import Sepnovo from './components/sepnovo/sepnovo.svelte';
	import Conferencia from './components/conferencia/conferencia.svelte';
	import Recontagem from './components/recontagem/recontagem.svelte';
	import { onMount, setContext, onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import Topbar from './components/topbar/topbar.svelte';

	let innerHeight = $state(0);
	let tabs = $state<Tabs.Root>();
	let storedServidor = $state<string | null>(null)
	
	let { data }: {data: PageData} = $props();
	setContext('User', data.usuario);
	
	onMount(() => {
		storedServidor = localStorage.getItem('servidor');
		storedServidor = storedServidor ? JSON.parse(storedServidor) : "";
	});

	onDestroy(() => {console.log('onDestroy')});
</script>

<svelte:window bind:innerHeight />

<Notify />
<Alert />

<Tabs.Root bind:this={tabs} class="m-2" style="height: {innerHeight*0.97}px">

	<Tabs.Trigger tabName="Conferência" name="my_tabs_2" class="checked:text-primary-content checked:[--tab-bg:var(--color-primary)]" checked />
	<Tabs.Content class="p-1">
		<Conferencia />
	</Tabs.Content>
	
	<Tabs.Trigger tabName="Recontagem" name="my_tabs_2" class="checked:text-primary-content checked:[--tab-bg:var(--color-primary)]" />
	<Tabs.Content class="p-1">
		<Recontagem />
	</Tabs.Content>
	
	<Tabs.Trigger tabName="Divergências" name="my_tabs_2" class="checked:text-primary-content checked:[--tab-bg:var(--color-primary)]" />
	<Tabs.Content class="p-1">
		<Divergencias />
	</Tabs.Content>

	<Tabs.Trigger tabName="Expedição de Mercadoria" name="my_tabs_2" class="checked:text-primary-content checked:[--tab-bg:var(--color-primary)]" />
	<Tabs.Content class="p-1">
		<Separacoes />
	</Tabs.Content>

	<Topbar />
</Tabs.Root>
