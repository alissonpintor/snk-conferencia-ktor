<script lang="ts">
	import { alertState } from '$lib/states/notification.svelte';
	let alert = $state<HTMLDialogElement>();

	$effect(() => {
		if (alertState.showAlert) {
			alert?.showModal();
		}
	});
</script>

<!-- You can open the modal using ID.showModal() method -->
<!-- <button class="btn" onclick={() => alert?.showModal()}>open modal</button> -->
<dialog id="my_modal_3" class="modal" bind:this={alert}>
	<div class="modal-box">
		<form method="dialog">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
				onclick={() => alertState.clearAlert()}>✕</button
			>
		</form>
		<h3 class="text-lg font-bold">
			{alertState.title}
		</h3>
		<p class="py-4">{alertState.message}</p>

    {#if alertState.action || alertState.showCloseButton}
		<div class="modal-action">
			<form method="dialog">
				{#if alertState.action}
					{@const { text, action } = alertState.action}
					<button class="btn btn-primary" onclick={() => {action(); alertState.clearAlert(); alert?.close();}}>{text}</button>
				{/if}

				{#if alertState.showCloseButton}
					<button class="btn" onclick={() => {alertState.clearAlert(); alert?.close();}}>Fechar</button>
				{/if}
			</form>
		</div>
    {/if}
	</div>
</dialog>
