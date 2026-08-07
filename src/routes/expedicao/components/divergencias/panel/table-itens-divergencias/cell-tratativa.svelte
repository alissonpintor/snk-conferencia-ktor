<script lang="ts">
	let { row, setValue } = $props();
</script>

<div class="flex flex-row w-32">
	<select class="select select-ghost" onchange={(e) => setValue(e.currentTarget.value)}>
		<option disabled selected>Selecionar</option>
		<option value=1 selected={row.original.tratativa === 1}>Cortar</option>
		<option value=2 selected={row.original.tratativa === 2}>Recontar</option>
	</select>
</div>
