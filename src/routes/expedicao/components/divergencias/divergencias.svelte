<script lang="ts">
	import * as Card from '$components/display/card';
	import Menu from './menu-filter/menu.svelte';
	import { PaneGroup, PaneResizer } from 'paneforge';
	import { FoldVertical } from '@lucide/svelte';
	import Panel from './panel/table-divergencias/panel.svelte';
	import PanelItensDivergencia from './panel/table-itens-divergencias/panel-itens-divergencia.svelte';

	let panelContainer = $state<HTMLDivElement | null>(null);
	let panelHeigth = $derived(panelContainer ? panelContainer.clientHeight : null);
</script>

<Card.Root class="h-full">
	<Card.Body>
		<Card.Content class="flex h-full flex-row gap-4">
			<div class="bg-base-100 rounded-box flex w-72 flex-col gap-2">
				<Menu />
			</div>

			<div class="w-full flex-1 overflow-hidden" bind:this={panelContainer}>
				<PaneGroup direction="vertical">
					<Panel />
					<PaneResizer class="h-4">
						<div class="flex w-full flex-col">
							<div class="divider h-0 p-0 my-2 relative">
								<FoldVertical class="text-primary bg-primary/10 rounded-box h-6 w-8 p-0 m-0 absolute left-1/2" />
							</div>
						</div>
					</PaneResizer>
					<PanelItensDivergencia title="Itens da Divergência" />
				</PaneGroup>
			</div>
		</Card.Content>
	</Card.Body>
</Card.Root>

<!-- <Card.Root class="h-full">
	<Card.Body>
		<Card.Content class="flex h-full flex-row gap-4">
			<Menu />
			
			<PaneGroup direction="vertical" class="flex w-full flex-1 flex-col overflow-hidden">
				<Panel 
					title="Divergências"
				/>
				<PaneResizer>
					<div class="flex w-full flex-col">
						<div class="divider">
							<FoldVertical class="text-primary bg-primary/10 rounded-box h-8 w-18 p-2" />
						</div>
					</div>
				</PaneResizer>
				<PanelItensDivergencia 
					title={"Itens Divergências"}
				/>
			</PaneGroup>
		</Card.Content>
	</Card.Body>
</Card.Root> -->
