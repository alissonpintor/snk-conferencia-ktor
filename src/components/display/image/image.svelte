<script lang="ts">
    import { Skeleton } from "$components/feedback/skeleton"
	const { imageSrc, class: className } = $props();

	const preload = async (src: string): Promise<any> => {
		const resp = await fetch(src);
		const blob = await resp.blob();

		return new Promise(function (resolve, reject) {
			let reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve(reader.result);
		});
	};
</script>

{#await preload(imageSrc)}
	<Skeleton class={className} />
{:then base64}
	<img src={base64} alt="Alright Buddy!" class={className} />
{/await}
