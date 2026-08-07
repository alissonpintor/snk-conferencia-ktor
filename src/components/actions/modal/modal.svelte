<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';

	type Props = {
		modalId: string;
		modal: HTMLDialogElement | null;
		showModal: boolean;
		closeButtonName?: string;
		closeAction?: 'button' | 'click-outside' | 'corner-button';
	};

	let {
		modalId,
		modal = $bindable(),
		showModal = $bindable(),
		closeButtonName = 'Fechar',
		closeAction = 'button',
		children,
		class: className,
		...restProps
	}: Props & HTMLDialogAttributes = $props();

	// let modal: HTMLDialogElement | null = $state(null);

	$effect(() => {
		if (showModal) {
			if (!modal?.open) modal?.showModal();
		} else {
			if (modal?.open) modal?.close();
		}
	});
</script>

<dialog
	id={modalId}
	bind:this={modal}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === modal) modal?.close();
	}}
	class={`modal${className ?? ''}`}
	{...restProps}
>
	<div class="modal-box">
		{@render children?.()}
	</div>
</dialog>
