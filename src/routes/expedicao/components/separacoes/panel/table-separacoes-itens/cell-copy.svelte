<script>
    import { Copy, SquareCheckBig } from "@lucide/svelte";
	import { fade } from "svelte/transition";

    const { value } = $props()
    let isCopied = $state(false);
    let hovered = $state(false);

    function copyValue() {
        isCopied = true;
        navigator.clipboard.writeText(value).then(() => {
            isCopied = true;
            setInterval(() => {
                isCopied = false;
            }, 1000);
        });
    }
</script>

<button 
    class="badge badge-soft cursor-pointer relative pr-5" 
    class:badge-success={isCopied} 
    onclick={() => copyValue()}
    onmouseenter={() => hovered = true} 
    onmouseleave={() => hovered = false}
>
    {value}
    {#if isCopied}
        <div in:fade class="absolute top-0.5 right-0">
            <SquareCheckBig size=16 class="transition-opacity duration-300"/>
        </div>
    {:else}
        <div in:fade class="absolute top-0.5 right-0" class:hidden={!hovered}>
            <Copy size=16 class="transition-opacity duration-300" />
        </div>
    {/if}
</button>