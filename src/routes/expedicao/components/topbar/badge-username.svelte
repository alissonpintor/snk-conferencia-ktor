<script lang="ts">
    import Badge from '$components/display/badge/badge.svelte';
	import type { Usuario } from '$lib/types/usuario';
	import { User } from '@lucide/svelte';
	import { getContext } from 'svelte';

    const user: Usuario = getContext('User');
</script>

<Badge class="badge-soft badge-primary">
	<User size="18" />
	<b>Usuário:</b> {user.name}
</Badge>
