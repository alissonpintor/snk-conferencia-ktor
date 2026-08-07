<script lang="ts">
	import LoadingSpinner from '$components/feedback/loading/loading-spinner.svelte';
	import { conferenciaState, LoadingStatus } from '$lib/states/conferencia.svelte';

	let isWaitingCheckout = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.NENHUM
	);
	let isLoadingCheckout = $derived<boolean>(
		conferenciaState.loadingStatus === LoadingStatus.CARREGANDO_CHECKOUT
	);

	let checkout = $state<string | null>(null);
</script>

{#if !conferenciaState.conferenciaIniciada && (isWaitingCheckout || isLoadingCheckout)}
	<div class="flex flex-row gap-2">
		<label class="input">
			<span class="label font-bold">Informe o Checkout:</span>
			<input
				type="text"
				class="input h-8 w-32"
				placeholder="Checkout"
				disabled={isLoadingCheckout}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						if (checkout) conferenciaState.startTask(checkout);
						checkout = null;
					}
				}}
				bind:value={checkout}
			/>
		</label>
		<button
			class="btn btn-primary"
			disabled={isLoadingCheckout}
			onclick={() => {
				if (checkout) conferenciaState.startTask(checkout);
				checkout = null;
			}}
		>
			{#if isLoadingCheckout}
				<LoadingSpinner />
			{:else}
				Buscar
			{/if}
		</button>
	</div>
{/if}