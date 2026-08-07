<script lang="ts">
    import { LoadingDots } from '$components/feedback/loading';
    import { Skeleton } from '$components/feedback/skeleton';
</script>

<div class="top-0 left-0 z-1 h-full w-full bg-base-100 p-4">
	<div class="relative flex flex-col gap-4">
		<LoadingDots class="text-primary" />
		<Skeleton class="h-6 w-full" />
		<Skeleton class="h-6 w-full opacity-70" />
		<Skeleton class="h-6 w-full opacity-50" />
	</div>
</div>
