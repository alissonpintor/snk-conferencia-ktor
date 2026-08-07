import { json } from '@sveltejs/kit';


export async function GET({ url, locals }) {
	try {
		const query = url.searchParams.get('q');
		const SERVICE_NAME = 'serviceName=CRUDServiceProvider.loadRecords';
		const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`;
		const OUTPUT_TYPE = 'outputType=json';

		const response = await fetch(
			`${locals.sankhyaServer}/mge/service.sbr?${SERVICE_NAME}&${MGE_SESSION}&${OUTPUT_TYPE}`,
			{
				method: 'POST',
				headers: {
					Cookie: `JSESSIONID=${locals.sankhyaSessionId}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					serviceName: 'CRUDServiceProvider.loadRecords',
					requestBody: {
						dataSet: {
							rootEntity: 'Usuario',
							includePresentationFields: 'S',
							offsetPage: '0',
							criteria: {
								expression: {
									$: "UPPER(this.NOMEUSU) like '?%' and EXISTS (SELECT 1 FROM TGWUSU WHERE CODUSU = this.CODUSU AND CODTAREFA IN (12,7,13,8,1))"
								},
								parameter: [
									{
										$: query?.toUpperCase(),
										type: 'S'
									}
								]
							},
							entity: {
								fieldset: {
									list: 'CODUSU,NOMEUSU,NOMEUSUCPLT'
								}
							}
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
			const { statusMessage } = responseData;
			errors.push({
				title: 'Erro ao tentar buscar os itens',
				message: statusMessage
			});

			return json({
				success: false,
				error: errors,
				data: null
			});
		}

		if ('responseBody' in responseData) {
			const { responseBody } = responseData;
			if (parseInt(responseBody.entities.total) > 0) {
				if (Array.isArray(responseBody.entities.entity)) {
					const conferentes = [];
					for (const item of responseBody.entities.entity) {
						conferentes.push({
							id: item.f0.$,
							title: item.f1.$,
							subtitle: item.f2.$
						});
					}
					return json(conferentes);
				}
				return json([
					{
						id: responseBody.entities.entity.f0.$,
						title: responseBody.entities.entity.f1.$,
						subtitle: responseBody.entities.entity.f1.$
					}
				]);
			}
		}
	} catch (error) {
		console.log(error);
		return json({});
	}
	return json({});
}
