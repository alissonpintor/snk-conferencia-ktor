<script lang="ts">
    import { Package } from '@lucide/svelte';
    import Badge from '$components/display/badge/badge.svelte';

    const appVersion = '1.0.0';
</script>

<Badge class="badge-soft badge-primary">
	<Package size="18" />
	<b>Versão:</b>
	{appVersion}
</Badge>
