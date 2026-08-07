<script lang="ts">
	import { Sun, Moon } from '@lucide/svelte';
</script>

<div class="bg-base-100 rounded-box h-8 ml-8">
	<label class="flex cursor-pointer gap-2">
		<Sun size=22 />
		<input type="checkbox" value="forest" class="toggle theme-controller" />
		<Moon size=22 />
	</label>
</div>