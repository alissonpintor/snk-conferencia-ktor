import { json } from '@sveltejs/kit';


export async function POST({ request, locals }) {
	const { busca } = await request.json();
	
	try {
		const SERVICE_NAME = 'serviceName=CRUDServiceProvider.loadRecords';
		const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`
		const OUTPUT_TYPE = 'outputType=json';

		const response = await fetch(
			`${locals.sankhyaServer}/mge/service.sbr?${SERVICE_NAME}&${MGE_SESSION}&${OUTPUT_TYPE}`,
			{
				method: 'POST',
				headers: {
					Cookie: `JSESSIONID=${locals.sankhyaSessionId}`
				},
				body: JSON.stringify({
					serviceName: 'CRUDServiceProvider.loadRecords',
					requestBody: {
						dataSet: {
							rootEntity: 'Empresa',
							includePresentationFields: 'S',
							offsetPage: '0',
							criteria: {
								expression: {
									$: "UPPER(this.NOMEFANTASIA) like '?%'"
								},
								parameter: [
									{
										$: busca.toUpperCase(),
										type: 'S'
									}
								]
							},
							entity: {
								fieldset: {
									list: 'CODEMP,RAZAOSOCIAL,NOMEFANTASIA,CGC,INSCESTAD'
								}
							}
						}
					}
				})
			}
		);

		// O Sankhya usa um encode legado e precisa fazer a conversão
		const buffer = await response.arrayBuffer();
		const decoder = new TextDecoder('windows-1252'); 
		const jsonDecoded = decoder.decode(buffer);

		const responseData = JSON.parse(jsonDecoded);
		const { status } = responseData;
		const errors = [];

		if (Number(status) !== 1) {
			const { statusMessage } = responseData;
			errors.push({
				title: 'Erro ao tentar buscar os itens',
				message: statusMessage
			});

			return json([]);
		}

		if ('responseBody' in responseData) {
			const { responseBody } = responseData;
			if (parseInt(responseBody.entities.total) > 0) {
				return json([
					{
						id: responseBody.entities.entity.f0.$,
						title: responseBody.entities.entity.f2.$,
						subtitle: responseBody.entities.entity.f1.$
					}
				]);
			}
		}
	} catch (error) {
		console.log(error);
		return json([]);
	}
	return json([]);
}
