<script lang="ts">
    import { EllipsisVertical } from "@lucide/svelte";
    import { CornerDownRight } from "@lucide/svelte";
    import { LoadingSpinner } from "$components/feedback/loading"

    type ButtonAction = {
      text: string;
      action: () => void
    }

    interface Props {
        actions: ButtonAction[]
    }

    let { actions }: Props = $props()
    let isLoading = $state(false);
</script>

<div class="dropdown dropdown-start">
  {#if isLoading}
    <LoadingSpinner />
  {:else}
  <div tabindex="1" role="button" class="btn btn-sm btn-ghost m-1"><EllipsisVertical size=18 /></div>
  <ul class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    {#if actions }
      {#each actions as {action, text}}
        <li><button class="btn" onclick={() => {
          isLoading = true;
          setInterval(() => {
            action();
            isLoading = false;
          }, 2000)
        }}><CornerDownRight size=16 /> {text}</button></li>        
      {/each}    
    {/if}
  </ul>    
  {/if}
</div>