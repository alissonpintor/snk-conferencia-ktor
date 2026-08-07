<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    
	let { children, class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={'card-actions ' + (className ? ` ${className}` : '')} {...restProps}>
	{@render children?.()}
</div>
