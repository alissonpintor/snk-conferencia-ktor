<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    let { class: className = "", ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={"flex w-52 flex-col gap-4 " + className} {...rest}>
  <div class="skeleton h-32 w-full"></div>
  <div class="skeleton h-4 w-28"></div>
  <div class="skeleton h-4 w-full"></div>
  <div class="skeleton h-4 w-full"></div>
</div>