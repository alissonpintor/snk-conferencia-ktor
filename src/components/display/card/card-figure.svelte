<script lang="ts">
	let { src, alt, ...restProps } = $props();
</script>

<figure>
	<img {src} {alt} {...restProps} />
</figure>
