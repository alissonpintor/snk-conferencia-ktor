<script lang="ts">
	import type { PageProps } from './$types';
	import Notify from '../expedicao/components/notifications/notify.svelte';
	import * as Fieldset from '$components/input/fieldset';
	import { Input } from '$components/input/input-field';
	import { Button } from '$components/actions/button';
	import { notificationState } from '$lib/states/notification.svelte';
	import { enhance, applyAction } from '$app/forms';
	import { ServerSelect } from './';
	import bgimage from '$assets/images/login_bg.png';
	import { LoadingSpinner } from '$components/feedback/loading';

	let { form }: PageProps = $props();
	let isSubmiting = $state(false);

	function showErrorMessage(message: string) {
		notificationState.addNotification({
			title: 'Erro ao tentar realizar login',
			message: message,
			type: 'error'
		});
	}

	function showFailureMessages(errors: { title: string; message: string }[]) {
		if (errors && errors.length > 0) {
			for (const error of errors) {
				notificationState.addNotification({
					title: error.title,
					message: error.message,
					type: 'error'
				});
			}
		}
	}
</script>

<Notify />

<div class="bg-primary/15 absolute top-0 h-full w-full">
	<div
		class="items-center' m-auto mt-10 flex h-[500px] w-4xl flex-row rounded-xl bg-white p-6 drop-shadow-lg"
	>
		<div class="flex-1">
			<h1 class="text-primary mb-5 text-2xl">
				<span class="text-3xl font-bold">STK</span>.CONFERÊNCIA
			</h1>
			<img src={bgimage} alt="" />
		</div>
		<div class="from-primary/45 to-primary/15 w-[350px] rounded-xl bg-linear-180">
			<div class="m-4 rounded-xl bg-linear-0 from-white/50 to-transparent p-4">
				<form
					action="/login"
					method="post"
					use:enhance={() => {
						isSubmiting = true;
						return async ({ result }) => {
							if (result.type === 'error') {
								showErrorMessage(result.error);
								isSubmiting = false;
								return;
							}
							if (result.type === 'failure') {
								showFailureMessages(result.data?.errors as { title: string; message: string }[]);
								isSubmiting = false;
								return;
							}
							await applyAction(result);
							isSubmiting = false;
						};
					}}
				>
					<Fieldset.Root class="bg-white/40">
						<Fieldset.Legend>Login</Fieldset.Legend>
						<Fieldset.Label>Usuário</Fieldset.Label>
						<Input placeholder="Digite seu usuário" name="username" value={form?.username} />
						<Fieldset.Label>Senha</Fieldset.Label>
						<Input type="password" placeholder="Digite sua senha" name="password" />
						<Button class="btn-primary mt-4" disabled={isSubmiting}>
							{#if isSubmiting}
								Entrando...
								<LoadingSpinner />
							{:else}
								Entrar
							{/if}
						</Button>
					</Fieldset.Root>
					<ServerSelect />
				</form>
			</div>
		</div>
	</div>
</div>
