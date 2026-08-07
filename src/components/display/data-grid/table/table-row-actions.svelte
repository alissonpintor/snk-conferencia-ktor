<script lang="ts">
	import { EllipsisVertical } from '@lucide/svelte';
	import { CornerDownRight } from '@lucide/svelte';
	import { LoadingSpinner } from '$components/feedback/loading';

	type ButtonAction = {
		text: string;
		action: () => Promise<void>;
	};

	interface Props {
		actions: ButtonAction[];
	}

	let { actions }: Props = $props();
	let isLoading = $state(false);
</script>

<div class="dropdown dropdown-start">
	<button class="btn btn-sm btn-ghost" disabled={isLoading}>
		{#if isLoading}
			<LoadingSpinner />
		{:else}
			<EllipsisVertical size="18" />
		{/if}
	</button>

	{#if !isLoading}
		<ul
			class="dropdown-content menu rounded-box bg-base-100 text-primary z-1 w-52 gap-2 p-2 shadow-sm"
		>
			{#if actions}
				{#each actions as { action, text }}
					<li>
						<button
							onclick={async () => {
								isLoading = true;
								await action();
								isLoading = false;
							}}
						>
							<CornerDownRight size="16" />
							{text}
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>
