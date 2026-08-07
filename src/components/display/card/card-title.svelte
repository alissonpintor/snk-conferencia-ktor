<script lang="ts">
	let { children } = $props();
</script>

<div class="card-title">
    {@render children?.()}
</div>