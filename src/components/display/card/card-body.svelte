<script lang="ts">
	let { children } = $props();
</script>

<div class="card-body p-4">
    {@render children?.()}
</div>