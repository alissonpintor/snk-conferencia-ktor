<script lang="ts">
	import { DatePicker } from 'bits-ui';
	import { Calendar, ChevronsLeft, ChevronsRight } from '@lucide/svelte';

	let { placeholder, value = $bindable() } = $props();

	const classDay =
		'rounded hover:bg-base-300 data-selected:text-primary-content! data-today:bg-neutral data-today:text-neutral-content data-selected:bg-primary! data-disabled:bg-base-200 data-disabled:rounded-none data-disabled:text-gray-400 data-unavailable:text-muted-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all';
</script>

<DatePicker.Root weekdayFormat="short" fixedWeeks={true} bind:value locale="pt-br">
	<div class="flex w-full flex-col gap-1.5">
		<DatePicker.Input class="input">
			{#snippet children({ segments })}
				<span class="w-18 font-normal text-gray-400">{placeholder ?? ''}</span>
				<div class="m-auto inline-flex w-32 items-center">
					{#each segments as { part, value }, i (part + i)}
						<div class="inline-block select-none">
							{#if part === 'literal'}
								<DatePicker.Segment {part} class="text-base-300 p-1">
									{value}
								</DatePicker.Segment>
							{:else}
								<DatePicker.Segment
									{part}
									class="hover:bg-muted focus:bg-muted focus:text-primary-content aria-[valuetext=Empty]:text-muted-foreground rounded px-1 py-1 focus-visible:ring-0! focus-visible:ring-offset-0!"
								>
									{['dd', 'mm', 'aaaa'].includes(value) ? '__' : value}
								</DatePicker.Segment>
							{/if}
						</div>
					{/each}
				</div>
				<DatePicker.Trigger
					class="hover:text-base-50 hover:bg-primary ml-auto inline-flex size-8 items-center justify-center rounded-[5px] transition-all active:bg-gray-400"
				>
					<Calendar size="16" />
				</DatePicker.Trigger>
			{/snippet}
		</DatePicker.Input>
		<DatePicker.Content sideOffset={6} class="z-1000">
			<DatePicker.Calendar class="shadow-popover bg-base-100 rounded-box border-base-300 p-[22px]">
				{#snippet children({ months, weekdays })}
					<DatePicker.Header class="flex items-center justify-between">
						<DatePicker.PrevButton
							class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
						>
							<ChevronsLeft size="12" />
						</DatePicker.PrevButton>
						<DatePicker.Heading class="text-[15px] font-medium" />
						<DatePicker.NextButton
							class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
						>
							<ChevronsRight size="12" />
						</DatePicker.NextButton>
					</DatePicker.Header>
					<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4">
						{#each months as month (month.value)}
							<DatePicker.Grid class="w-full border-collapse space-y-1 select-none">
								<DatePicker.GridHead>
									<DatePicker.GridRow class="mb-1 flex w-full justify-between">
										{#each weekdays as day (day)}
											<DatePicker.HeadCell
												class="text-muted-foreground w-10 rounded-md text-xs font-normal!"
											>
												<div>{day.slice(0, 3)}</div>
											</DatePicker.HeadCell>
										{/each}
									</DatePicker.GridRow>
								</DatePicker.GridHead>
								<DatePicker.GridBody>
									{#each month.weeks as weekDates (weekDates)}
										<DatePicker.GridRow class="flex w-full">
											{#each weekDates as date (date)}
												<DatePicker.Cell
													{date}
													month={month.value}
													class="relative size-10 p-0! text-center text-sm"
												>
													<DatePicker.Day class={classDay}>
														<div
															class="bg-neutral group-data-selected:bg-neutral absolute top-[5px] hidden size-1.5 rounded-full transition-all group-data-today:block"
														></div>
														{date.day}
													</DatePicker.Day>
												</DatePicker.Cell>
											{/each}
										</DatePicker.GridRow>
									{/each}
								</DatePicker.GridBody>
							</DatePicker.Grid>
						{/each}
					</div>
				{/snippet}
			</DatePicker.Calendar>
		</DatePicker.Content>
	</div>
</DatePicker.Root>
