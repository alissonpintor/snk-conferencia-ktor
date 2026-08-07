<script lang="ts">
    import { Info, XIcon } from "@lucide/svelte";
	import { fade } from "svelte/transition";
    import { notificationState } from "$lib/states/notification.svelte";
</script>

<div class="z-50 fixed left-1/2 -translate-x-1/2 p-2 flex flex-col gap-1 w-1/2 max-h-screen overflow-y-auto">
    {#if notificationState.notifications}
        {#each notificationState.notifications as notification (notification)}
            <div
                role="alert"
                class="alert alert-vertical sm:alert-horizontal"
                class:alert-info={notification.type === 'info'}
                class:alert-success={notification.type === 'success'}
                class:alert-warning={notification.type === 'warning'}
                class:alert-error={notification.type === 'error'}
                in:fade out:fade>
            <Info />
            <div class="w-full">
                <div class="flex flex-row justify-between w-full">
                    <h3 class="font-bold mb-1">{notification.title}</h3>
                    <XIcon size=22 />
                </div>
                <div class="text-md">
                    {notification.message}
                </div>
            </div>
            </div>
        {/each}
    {/if}
</div>