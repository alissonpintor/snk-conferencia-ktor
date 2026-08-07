<script lang="ts">
    import type { HTMLDialogAttributes } from 'svelte/elements';

    type ActionsProps = {
        modal: HTMLDialogAttributes| null
        closeButtonName?: string,
    }
    
    let { modal, closeButtonName="Fechar", children=null } = $props()
</script>

<div class="modal-action">
	<form method="dialog">
        {@render children?.()}
		<button onclick={() => {modal.close()}} class="btn">{closeButtonName}</button>
	</form>
</div>
