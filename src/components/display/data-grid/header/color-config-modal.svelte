<script lang="ts">
	import { RotateCcw } from '@lucide/svelte';
	import { rowColorsState, DEFAULT_COLORS, type StatusColorMap, type StatusColor } from '$lib/states/row-colors.svelte';

	type Props = {
		open: boolean;
		onclose: () => void;
	};

	let { open = $bindable(), onclose }: Props = $props();

	// Local copy of colors for editing (so we can cancel without saving)
	let localColors = $state<StatusColorMap>({});
	let localEnabled = $state<boolean>(true);

	// Sync local state when modal opens
	$effect(() => {
		if (open) {
			localColors = JSON.parse(JSON.stringify(rowColorsState.colors));
			localEnabled = rowColorsState.isEnabled;
		}
	});

	const statuses = Object.keys(DEFAULT_COLORS);

	function handleSave() {
		rowColorsState.setColors(localColors);
		rowColorsState.setEnabled(localEnabled);
		open = false;
		onclose();
	}

	function handleCancel() {
		open = false;
		onclose();
	}

	function handleResetToDefaults() {
		localColors = JSON.parse(JSON.stringify(DEFAULT_COLORS));
	}

	function updateStatusBg(status: string, value: string) {
		localColors = {
			...localColors,
			[status]: { ...localColors[status], backgroundColor: value }
		};
	}

	function updateStatusText(status: string, value: string) {
		localColors = {
			...localColors,
			[status]: { ...localColors[status], textColor: value }
		};
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
		}
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		role="dialog"
		aria-modal="true"
		aria-labelledby="color-config-title"
		tabindex="-1"
		onkeydown={handleKeydown}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0" onclick={handleCancel}></div>

		<div
			class="bg-base-100 border-base-200 relative z-10 w-full max-w-lg rounded-lg border p-6 shadow-xl max-h-[80vh] flex flex-col animate-fade-in"
		>
			<!-- Header -->
			<div class="mb-4">
				<h2 id="color-config-title" class="text-lg font-bold">Configurar Cores por Status</h2>
				<p class="text-base-content/60 text-sm">
					Defina as cores de fundo e de texto para cada status da tabela.
				</p>
			</div>

			<!-- Toggle -->
			<div class="mb-4 flex items-center gap-3">
				<label class="label cursor-pointer gap-2" for="color-toggle">
					<input
						id="color-toggle"
						type="checkbox"
						class="toggle toggle-primary toggle-sm"
						bind:checked={localEnabled}
						aria-label="Habilitar cores por status"
					/>
					<span class="label-text text-sm">Habilitar cores</span>
				</label>
			</div>

			<!-- Status List -->
			<div class="flex-1 overflow-y-auto">
				{#each statuses as status (status)}
					{@const color = localColors[status]}
					{#if color}
						<div class="border-base-200 flex items-center gap-3 border-b p-2">
							<!-- Label -->
							<span class="flex-1 text-sm font-medium">{status}</span>

							<!-- Background Color -->
							<div class="flex flex-col items-center">
								<span class="text-base-content/50 text-xs">Fundo</span>
								<input
									type="color"
									class="border-base-300 h-8 w-8 cursor-pointer rounded border"
									value={color.backgroundColor}
									oninput={(e) => updateStatusBg(status, e.currentTarget.value)}
									aria-label="Cor de fundo para {status}"
								/>
							</div>

							<!-- Text Color -->
							<div class="flex flex-col items-center">
								<span class="text-base-content/50 text-xs">Texto</span>
								<input
									type="color"
									class="border-base-300 h-8 w-8 cursor-pointer rounded border"
									value={color.textColor}
									oninput={(e) => updateStatusText(status, e.currentTarget.value)}
									aria-label="Cor do texto para {status}"
								/>
							</div>

							<!-- Preview -->
							<div
								class="rounded px-3 py-1 text-sm whitespace-nowrap"
								style="background-color: {color.backgroundColor}; color: {color.textColor};"
							>
								{status.length > 20 ? status.slice(0, 20) + '…' : status}
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<!-- Footer -->
			<div class="mt-4 flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={handleResetToDefaults}>
					<RotateCcw size={14} />
					Restaurar Padrão
				</button>
				<button class="btn btn-ghost btn-sm" onclick={handleCancel}>
					Cancelar
				</button>
				<button class="btn btn-primary btn-sm" onclick={handleSave}>
					Salvar
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.animate-fade-in {
		animation: fadeIn 200ms ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
