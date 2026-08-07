<script lang="ts">
	import { CircleX } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	let { placeholder, item = $bindable(), clear } = $props();
</script>

{#if item}
	<div class="bg-base-100 border-base-300 flex h-16 flex-row justify-between rounded-field border p-2" in:fade={{ duration: 100 }}>
		<div class="flex flex-col">
			<h2 class="mb-1 font-semibold opacity-60">{placeholder}</h2>
			<h2 class="w-48 truncate font-bold">
				{item.id} - {item.title}
			</h2>
		</div>
		<button class="btn btn-square btn-ghost" onclick={() => {item = null; clear();}}>
			<CircleX />
		</button>
	</div>
{/if}
