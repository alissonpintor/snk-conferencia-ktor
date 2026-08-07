<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as Card from '$components/display/card';
    import PainelConferencia from './painel-conferencia/painel-conferencia.svelte';
    import { conferenciaState } from '$lib/states/conferencia.svelte';

    
    onMount(async () => {
        const resp = await conferenciaState.buscarTarefasPendentes();
    })

    onDestroy(() => {
        conferenciaState.limparConferencia();
    })
</script>

<Card.Root class="h-full">
	<Card.Body>
		<Card.Content class="flex h-full flex-row gap-4">
            <!-- Painel de Conferencia -->
            <PainelConferencia />
		</Card.Content>
	</Card.Body>
</Card.Root>
