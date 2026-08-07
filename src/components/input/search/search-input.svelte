<script lang="ts">
    import { Input } from "$components/input/input-field";
    let { placeholder, value = $bindable(), isLoading = false, ...restProps } = $props();
</script>

<Input bind:value={value} {placeholder} {...restProps} />
{#if isLoading}
<span class="loading loading-spinner"></span>
{/if}
