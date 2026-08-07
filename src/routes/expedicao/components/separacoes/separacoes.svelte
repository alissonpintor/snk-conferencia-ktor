<script lang="ts">
    import * as Card from '$components/display/card';
    import Menu from './menu-filter/menu.svelte';
	import { SquareArrowLeft, SquareArrowRight } from '@lucide/svelte';
    import { PaneGroup, PaneResizer } from 'paneforge';
	import { FoldVertical } from '@lucide/svelte';
    import { Panel as PanelSeparacao } from './panel/table-separacoes'
    import { Panel as PanelSeparacaoItens } from './panel/table-separacoes-itens'

	let panelContainer = $state<HTMLDivElement | null>(null);

	let showMenu = $state<boolean>(true);
</script>

<Card.Root class="h-full">
	<Card.Body>
		<Card.Content class="flex h-full flex-row gap-4">

			<div class="flex flex-col gap-2">

				<button class="btn btn-soft btn-accent" onclick={() => showMenu = !showMenu}>
					{#if showMenu}
						<SquareArrowLeft /> Esconder Menu
					{:else}
						<SquareArrowRight />
					{/if}
				</button>
			
				<div class="bg-base-100 rounded-box flex flex-col gap-2 w-72 h-full" hidden={!showMenu}>
					<Menu />
				</div>

			</div>

			<div class="w-full flex-1 overflow-hidden" bind:this={panelContainer}>
				<PaneGroup direction="vertical">
					<PanelSeparacao />
					<PaneResizer class="h-4">
						<div class="flex w-full flex-col">
							<div class="divider h-0 p-0 my-2 relative">
								<FoldVertical class="text-primary bg-primary/10 rounded-box h-6 w-8 p-0 m-0 absolute left-1/2" />
							</div>
						</div>
					</PaneResizer>
					<PanelSeparacaoItens />
				</PaneGroup>
			</div>
		</Card.Content>
	</Card.Body>
</Card.Root>
