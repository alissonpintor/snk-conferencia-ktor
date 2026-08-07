import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request, locals }: RequestEvent) => {

	const { nroTarefa, sequencia } = await request.json();

	console.log(nroTarefa, sequencia);

	if (!nroTarefa || !sequencia) {
		return json(
			{
				success: false,
				error: [
					{
						title: 'Erro ao cancelar recontagem',
						message: 'O nro da tarefa e a sequencia são obrigatórios.'
					}
				],
				data: null
			},
			{
				status: 400
			}
		);
	}

	try {
		const SERVICE_NAME = 'serviceName=MgeWmsSP.rejeitaTarefa';
		const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`;
		const OUTPUT_TYPE = 'outputType=json';

		const response = await fetch(
			`${locals.sankhyaServer}/mgewms/service.sbr?${SERVICE_NAME}&${MGE_SESSION}&${OUTPUT_TYPE}`,
			{
				method: 'POST',
				headers: {
					Cookie: `JSESSIONID=${locals.sankhyaSessionId}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					serviceName: 'MgeWmsSP.rejeitaTarefa',
					requestBody: {
						idusu: {
							$: btoa(locals.usuario!.id.toString())
						},
						TAREFA: {
							NUTAREFA: {
							    $: nroTarefa
						    },
						    SEQUENCIA: {
							    $: 1
						    }
						},
					}
				})
			}
		);

		const buffer = await response.arrayBuffer();
		const decoder = new TextDecoder('iso-8859-1');
		const jsonDecoded = decoder.decode(buffer);

		const responseData = JSON.parse(jsonDecoded);
		const { status } = responseData;
		const errors = [];

		console.log(responseData);

		if (Number(status) !== 1) {
			const { statusMessage } = responseData;
			errors.push({
				title: 'Erro ao cancelar recontagem',
				message: statusMessage
			});

			return json(
				{
					success: false,
					error: errors,
					data: null
				},
				{
					status: 400
				}
			);
		}

		return json({
			success: true,
			error: null,
			data: []
		});
	} catch (error) {
		if (error instanceof Error) {
			return json(
				{
					success: false,
					error: [{ title: 'Erro ao cancelar recontagem', message: error.message }],
					data: null
				},
				{
					status: 500
				}
			);
		}
	}

	return json({});
};
