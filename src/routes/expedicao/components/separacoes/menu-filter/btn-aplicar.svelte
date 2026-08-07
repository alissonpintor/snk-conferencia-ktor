<script lang="ts">
    import { Button } from '$components/actions/button';

	let { onclick } = $props();
</script>

<Button
	class="btn-primary"
	{onclick}
	onkeydown={(ev: KeyboardEvent) => {
		console.log(ev.key);
	}}
>
	<div class="flex w-44 flex-row justify-between">
		<div>Aplicar</div>
		<div class="text-gray-500">
			<kbd class="kbd kbd-xs">alt</kbd>+<kbd class="kbd kbd-xs">a</kbd>
		</div>
	</div>
</Button>
