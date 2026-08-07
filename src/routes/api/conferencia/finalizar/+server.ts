import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	const { nroConferencia } = await request.json();
	const ERROR_TITLE = 'Erro ao tentar finalizar a conferência';


	if (!locals.usuario || !nroConferencia) {
		return json({
			success: false,
			error: {
				title: ERROR_TITLE,
				message: 'O ID do usuário é obrigatório.'
			},
			data: null
		});
	}

	const SERVICE_NAME = 'serviceName=MgeWmsSP.produtosConferidos';
	const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`;
	const OUTPUT_TYPE = 'outputType=json';

	try {
		const response = await fetch(
			`${locals.sankhyaServer}/mgewms/service.sbr?${SERVICE_NAME}&${MGE_SESSION}&${OUTPUT_TYPE}`,
			{
				method: 'POST',
				headers: {
					Cookie: `JSESSIONID=${locals.sankhyaSessionId}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					serviceName: 'MgeWmsSP.produtosConferidos',
					requestBody: {
						idusu: {
							$: btoa(locals.usuario!.id.toString())
						},
						tipoConferencia: {
							$: 'SAIDA'
						},
						nuConferencia: {
							$: nroConferencia
						},
						contarVazio: {
							$: 'N'
						},
						finalizarConferenciaParcial: {
							$: 'N'
						},
						forcarParcialComoDivergente: {
							$: 'N'
						},
						UTILIZAEXPLOTE: {
							$: 'N'
						},
						MULTICONFERENTES: {
							$: 'N'
						},
						PREFERENCIANOTIFDIVFINAL: {
							$: 'S'
						},
						CONFERENCIA_PEDIDO: {
							$: 'S'
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
		
		if (Number(status) !== 1) {
			console.log(responseData);
			const { statusMessage } = responseData;
			errors.push({
				title: ERROR_TITLE,
				message: statusMessage
			});

			return json({
				success: false,
				error: errors,
				data: null
			});
		}

		/*
		{
			serviceName: 'MgeWmsSP.produtosConferidos',
			status: '1',
			pendingPrinting: 'false',
			transactionId: 'D08510CD66FB49EA1455750E030FDBC3',
			statusMessage: 'Houve divergência no processo de conferência.',
			responseBody: { entity: { name: 'TGWCON', linhas: [Object] } }
		}
		*/

		const records = responseData.responseBody.entity.linhas.linha;
		console.log(records);
		
		if (records.DIVERGENCIA === 'true') {
			const { statusMessage } = responseData;
			errors.push({
				title: ERROR_TITLE,
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
			error: [],
			data: []
		});
	} catch (error) {
		return json({
			success: false,
			error: error.message,
			data: null
		});
	}
}
