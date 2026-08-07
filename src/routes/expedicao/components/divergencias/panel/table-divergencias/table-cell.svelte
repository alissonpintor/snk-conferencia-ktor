<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
	import { ArrowDownUp, ArrowDown, ArrowUp, EllipsisVertical } from '@lucide/svelte';

	let { text, toogle, table, column, ...restProps }: { text: string, toogle?: any, table?: any, column?: any } & HTMLButtonAttributes = $props();
</script>


<div class="flex flex-row justify-between gap-0.5 {['asc', 'desc'].includes(toogle) ? 'text-secondary' : ''}">
  {text}

  <div class="flex flex-row gap-0.5">
    <button 
      class="btn btn-ghost btn-xs {['asc', 'desc'].includes(toogle) ? 'text-secondary bg-base-200' : ''}"
      onclick={() => {column}}
      {...restProps}
    >
      {#if toogle === 'asc'}
        <ArrowUp size=18 />
      {:else if toogle === 'desc'}
        <ArrowDown size=18 />
      {:else}
        <ArrowDownUp size=18 />
      {/if}
    </button>
  </div>
</div>
