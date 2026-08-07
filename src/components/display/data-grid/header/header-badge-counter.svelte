<script lang="ts">
    import { Badge } from '$components/display/badge';
    import { LoadingSpinner } from '$components/feedback/loading';
    import type { CounterProps } from './types';

    
    const { count, isLoading }: CounterProps = $props();    
</script>

<Badge class="badge-primary w-12">
	{#if isLoading}
		<LoadingSpinner class="m-1" />
	{:else}
		{count}
	{/if}
</Badge>