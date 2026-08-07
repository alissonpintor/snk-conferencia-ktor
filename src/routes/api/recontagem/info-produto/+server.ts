import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const { nroConferencia, codigoBarras, quantidade } = await request.json();

	if (!nroConferencia || !codigoBarras || !quantidade) {
		return json(
			{
				success: false,
				error: [
					{
						title: 'Erro ao buscar informaçoes do produto',
						message: 'O nro da coferencia, codigo de barras e quantidade são obrigatórios.'
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
		const SERVICE_NAME = 'serviceName=MgeWmsSP.buscaInfoProduto';
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
					serviceName: 'MgeWmsSP.buscaInfoProduto',
					requestBody: {
						idusu: {
							$: btoa(locals.usuario!.id.toString())
						},
						NUCONFERENCIA: {
							$: nroConferencia
						},
						CODBARRAS: {
							$: codigoBarras
						},
						QUANTIDADE: {
							$: quantidade
						},
						PRIMEIRARECONTAGEM: {
							$: false
						}
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
				title: 'Erro ao buscar informaçoes do produto',
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
		
		const data = responseData.responseBody.entity.linhas.linha;
		return json({
			success: true,
			error: null,
			data: data
		});
	} catch (error) {
		const err = error as Error;
		return json(
			{
				success: false,
				error: [{ title: 'Erro ao buscar informaçoes do produto', message: err.message }],
				data: null
			},
			{
				status: 500
			}
		);
	}
};
