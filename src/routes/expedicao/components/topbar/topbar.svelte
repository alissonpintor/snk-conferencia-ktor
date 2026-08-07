<script lang="ts">
    import BadgeUsername from "./badge-username.svelte";
    import BadgeServername from "./badge-servername.svelte";
    import BadgeVersion from "./badge-version.svelte";
    import ButtonLogout from "./button-logout.svelte";
    import { DarkSwitch } from '$components/display/switch-dark';
</script>

<div class="ml-auto flex flex-row gap-1 items-baseline">
	<BadgeUsername />		
	<BadgeServername />
    <BadgeVersion />
	
    <DarkSwitch />	
	<ButtonLogout />
</div>