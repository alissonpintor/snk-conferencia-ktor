<script lang="ts">
    import { modalState } from "$lib/states/notification.svelte";
    
    let modal = $state<HTMLDialogElement>();

    $effect(() => {
        if (modalState.showAlert) {
            modal?.showModal();
        }
    })
</script>

<!-- You can open the modal using ID.showModal() method -->
<!-- <button class="btn" onclick={() => alert?.showModal()}>open modal</button> -->
<dialog id="my_modal_3" class="modal" bind:this={modal}>
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={() => modalState.clearAlert()}>✕</button>
    </form>
    
    {#if modalState.title}
    <h3 class="text-lg font-bold">
        {modalState.title}
    </h3>
    {/if}
    
    <p class="py-4">{modalState.message}</p>
  </div>
</dialog>