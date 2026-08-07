<script lang="ts">
	import { goto } from "$app/navigation";
	import { LoadingSpinner } from "$components/feedback/loading";
    import { LogOut } from '@lucide/svelte';
    import { recontagemState, RecontagemStatus } from "$lib/states/recontagem.svelte";

    let isLoading = $state(false);

    async function logoff() {
        isLoading = true;
		const response = await fetch('/logoff');
		const responseData = await response.json()
		
		if (responseData.success) {
            recontagemState.clearState();
            recontagemState.status = RecontagemStatus.NENHUM;
			goto('/');
		} else {
            isLoading = false;
        }
	}
</script>

<button class="btn btn-ghost btn-error h-8 ml-4" onclick={logoff} disabled={isLoading}>
    {#if isLoading}
    <LoadingSpinner />
    {:else}
	<LogOut size="18" />
	Sair
    {/if}
</button>
