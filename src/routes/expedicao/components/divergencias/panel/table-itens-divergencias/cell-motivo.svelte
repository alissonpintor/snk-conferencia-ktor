<script lang="ts">
    import { onMount } from 'svelte';

    let motivos: {id: number, descricao: string}[] = $state([]);
	onMount(async () => {
		const resp = await fetch('/api/separacao/divergencia/motivo');
		motivos = await resp.json();		 
	});

	const { row, setValue } = $props();
</script>

<div class="flex flex-row">
	<select class="select select-ghost" onchange={(e) => setValue(e.currentTarget.value)}>
		<option disabled selected>Selecionar</option>
        {#each motivos as motivo}
		    <option value={motivo.id} selected={Number(row.original.motivo) === Number(motivo.id)}>{motivo.descricao}</option>            
        {/each}
	</select>
</div>