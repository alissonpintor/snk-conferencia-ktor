<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { getContext } from "svelte";
    
    let { type, placeholder, value = $bindable(), class: className, ...restProps }: HTMLInputAttributes = $props();
    let grow = getContext("grow");
</script>

<input 
    type={type ?? "text"}
    {placeholder} 
    bind:value={value}
    class={(grow ? "grow" : "input") + (className ? ` ${className}` : '')}
    {...restProps}
/>