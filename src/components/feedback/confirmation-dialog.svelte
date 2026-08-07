<script lang="ts">
	import Modal from '$components/actions/modal/modal.svelte';
	import { CircleAlert } from '@lucide/svelte';

	type Props = {
		showModal: boolean;
		title: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		onConfirm: () => void;
		onCancel?: () => void;
	};

	let {
		showModal = $bindable(),
		title,
		message,
		confirmText = 'Sim, Cancelar',
		cancelText = 'Não, Voltar',
		onConfirm,
		onCancel
	}: Props = $props();

	function handleConfirm() {
		onConfirm();
		showModal = false;
	}

	function handleCancel() {
		if (onCancel) onCancel();
		showModal = false;
	}
</script>

<Modal modalId="confirmation-dialog" bind:showModal>
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-3">
			<div class="bg-error/10 text-error flex h-12 w-12 items-center justify-center rounded-full">
				<CircleAlert size={24} />
			</div>
			<h3 class="text-error text-xl font-bold">{title}</h3>
		</div>

		<p class="text-base-content/70 text-sm">
			{message}
		</p>

		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-outline btn-sm" onclick={handleCancel}>
					{cancelText}
				</button>
				<button class="btn btn-error btn-sm" onclick={handleConfirm}>
					{confirmText}
				</button>
			</form>
		</div>
	</div>
</Modal>
