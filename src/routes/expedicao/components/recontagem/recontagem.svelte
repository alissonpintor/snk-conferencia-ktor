<script lang="ts">
	import * as Card from '$components/display/card';
    import PainelRecontagem from './painel-conferencia/painel-recontagem.svelte';
</script>

<Card.Root class="h-full">
	<Card.Body>
		<Card.Content class="flex h-full flex-row gap-4">
            <!-- Painel de Conferencia -->
            <PainelRecontagem />
		</Card.Content>
	</Card.Body>
</Card.Root>
