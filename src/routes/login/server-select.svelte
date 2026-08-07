<script lang="ts">
	import { onMount } from 'svelte';

	let servidor = $state<string | null>(null);

	onMount(() => {
		const storedServidor = localStorage.getItem('servidor');
		if (storedServidor) {
			servidor = JSON.parse(storedServidor);
			document.cookie = `servidor=${storedServidor}; path=/`;
		}
	});

	$effect(() => {
		if (servidor) {
			localStorage.setItem('servidor', JSON.stringify(servidor));
			document.cookie = `servidor=${servidor}; path=/`;
		}
	});
</script>

<fieldset class="fieldset mt-4 w-full">
	<legend class="fieldset-legend">Servidor</legend>
	<select name="server" class="select" placeholder="Selecione um servidor" bind:value={servidor}>
		<option selected disabled>Selecione o Servidor</option>
		<option value="producao">Produção</option>
		<option value="teste">Teste</option>
	</select>
</fieldset>
