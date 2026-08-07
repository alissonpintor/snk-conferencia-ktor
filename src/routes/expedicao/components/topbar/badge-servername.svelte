<script lang="ts">
	import { onMount } from 'svelte';
    import { Server } from '@lucide/svelte';
    import Badge from '$components/display/badge/badge.svelte';

    let storedServidor = $state<string | null>(null);	
	onMount(() => {
		storedServidor = localStorage.getItem('servidor');
		storedServidor = storedServidor ? JSON.parse(storedServidor) : "";
	});
</script>

<Badge class="badge-soft badge-primary">
	<Server size="18" />
	<b>Servidor:</b>
	{storedServidor}
</Badge>
