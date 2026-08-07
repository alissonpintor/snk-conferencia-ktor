<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements'
    import { Icon, X } from "@lucide/svelte"
    let { tabName, name, Icone, class: className, ...restProps}:{tabName: string, Icone?: Icon} & HTMLInputAttributes = $props()
</script>

{#if Icone}
<label class={"tab font-bold" + (className ? ` ${className}`: "")}>
    <input 
        type="radio" 
        {name}        
        {...restProps}
    >
    {tabName}
    <button class="btn btn-ghost btn-xs">
        <X size=18/>
    </button>
</label>
{:else}
    <input 
        type="radio" 
        {name}
        class={"tab font-bold" + (className ? ` ${className}`: "")}
        aria-label={tabName} 
        {...restProps}
    >
{/if}

