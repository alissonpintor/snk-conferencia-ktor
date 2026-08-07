<script lang="ts">
	import { CirclePlus } from '@lucide/svelte';
	import { Badge } from '$components/display/badge';
	let { data = [], selected = $bindable() } = $props();
</script>

{#if data.length > 0}
	<div
		class="bg-base-100 border-base-300 absolute top-[40px] left-4 z-20 max-h-96 min-h-[40px] w-96 overflow-y-scroll rounded border"
	>
		<ul class="list">
			<li class="p-4 pb-2 text-xs tracking-wide opacity-60">Resultados da busca...</li>
			{#each data as item}
				<li class="list-row flex w-96 flex-row justify-between">
					<div>
						<div><Badge class="bg-base-300 italic badge-sm min-w-12">{item.id}</Badge></div>
						<div class="w-72 truncate"><span >{item.title}</span></div>
						<div class="truncate text-xs font-semibold opacity-60 w-44">
							{item.subtitle}
						</div>
					</div>
					<div>
						<button class="btn btn-square btn-ghost" onclick={() => {
							// console.log('Selected item:', item);
							(selected = item);
							}
						}>
							<CirclePlus />
						</button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
{/if}
