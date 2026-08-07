import { json } from '@sveltejs/kit';

type Filters = {
	nroConferencia: number;
};

/*
{
  serviceName: 'MgeWmsSP.cancelaConferencia',
  requestBody: {
    idusu: {
      $: 'Nzc='
    },
    NUCONFERENCIA: {
      $: ''
    },
    MULTICONFERENTES: {
      $: 'N'
    }
  }
}
*/

export async function POST({ request, locals }) {
	const { nroConferencia }: Filters = await request.json();

    if (!nroConferencia || !locals.usuario) {
        return json({
            success: false,
            error: {
                title: 'Erro ao cancelar conferência',
                message: 'O número número da conferência e o ID do usuário são obrigatórios.',
            },
            data: null
        });
    }

	try {
		const SERVICE_NAME = 'serviceName=MgeWmsSP.cancelaConferencia';
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
					serviceName: 'MgeWmsSP.cancelaConferencia',
					requestBody: {
						idusu: {
							$: btoa(locals.usuario!.id.toString())
						},
						NUCONFERENCIA: {
							$: nroConferencia.toString()
						},
						MULTICONFERENTES: {
							$: 'N'
						}
					}
				})
			}
		);

		const buffer = await response.arrayBuffer();
		const decoder = new TextDecoder('windows-1252');
		const jsonDecoded = decoder.decode(buffer);

		const responseData = JSON.parse(jsonDecoded);
		const { status } = responseData;
		const errors = [];

		console.log(responseData);

		if (Number(status) !== 1) {
			const { statusMessage } = responseData;
			errors.push({
				title: 'Erro ao tentar cancelar a conferência',
				message: statusMessage
			});

			return json({
				success: false,
				error: errors,
				data: null
			});
		}

        return json({
            success: true,
            error: null,
            data: []
        });
	} catch (error) {
		return json({
			success: false,
			error: [
				{
					title: 'Erro ao tentar cancelar a conferência',
					message: `Erro Interno: ${error}.`,
					type: 'error'
				}
			],
			data: null
		});
	}
}
