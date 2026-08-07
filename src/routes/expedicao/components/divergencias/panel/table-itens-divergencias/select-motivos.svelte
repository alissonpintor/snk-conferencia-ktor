<script lang="ts">
    import { onMount } from 'svelte';

    let idMotivo = $state();
    let motivos: {id: number, descricao: string}[] = $state([]);
	onMount(async () => {
		const resp = await fetch('/api/separacao/divergencia/motivo');
		motivos = await resp.json();		 
	});

	const { setValue, disabled } = $props();

    function onValueSelected() {
        if (idMotivo) setValue(idMotivo);
    }
</script>

<div class="flex flex-row gap-1 w-80">
    <label class="input">
        <span class="label">Motivo:</span>
        <select class="select h-8 cursor-pointer" bind:value={idMotivo} {disabled} onchange={onValueSelected}>
            <option disabled selected>Selecionar Motivo</option>
            {#each motivos as motivo}
                <option value={motivo.id}>{motivo.descricao}</option>     
            {/each}
        </select>
    </label>

    
    <!-- <button class="btn h-8 w-24" {disabled} onclick={() => {
        console.log(idMotivo);
        if (idMotivo) setValue(idMotivo);
    }}>Aplicar</button> -->
</div>