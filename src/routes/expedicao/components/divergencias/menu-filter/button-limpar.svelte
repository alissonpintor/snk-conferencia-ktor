<script lang="ts">
	import { Button } from '$components/actions/button';
	const {clearCallback}: {clearCallback: () => void} = $props();
</script>

<Button class="btn-warning" onclick={() => clearCallback()}>
	<div class="flex w-44 flex-row justify-between">
		<div>Limpar Filtros</div>
		<div class="text-gray-500">
			<kbd class="kbd kbd-xs">alt</kbd>+<kbd class="kbd kbd-xs">l</kbd>
		</div>
	</div>
</Button>
