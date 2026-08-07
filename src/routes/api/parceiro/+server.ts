import { json } from '@sveltejs/kit';


type Parameter = {
	$: string;
	type: 'S' | 'N' | 'D' | 'B';
};


export async function POST({ request, locals }) {
	let { busca } = await request.json();
	let expression: number | string | undefined = undefined;
	let parameters: Parameter[] = [];

	if (parseInt(busca)) {
		expression = `this.CODPARC = ? and ATIVO = 'S'`;
		parameters = [
			{
				$: busca,
				type: 'N'
			}
		];
	} else {
		busca = busca.split(' ').join('%');
		expression =
			"UPPER(this.NOMEPARC) like '?%' or UPPER(this.RAZAOSOCIAL) like '?%' and ATIVO = 'S'";
		parameters.push(
			{
				$: busca.toUpperCase(),
				type: 'S'
			},
			{
				$: busca.toUpperCase(),
				type: 'S'
			}
		);
	}

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
							rootEntity: 'Parceiro',
							includePresentationFields: 'S',
							offsetPage: '0',
							criteria: {
								expression: {
									$: expression
								},
								parameter: parameters
							},
							entity: {
								fieldset: {
									list: 'CODPARC,NOMEPARC,RAZAOSOCIAL'
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
			const total = parseInt(responseBody.entities.total);
			if (total > 0) {
				if (total > 1) {
					return json(
						responseBody.entities.entity.map(
							(item: { f0: { $: string }; f1: { $: string }; f2: { $: string } }) => ({
								id: item.f0.$,
								title: item.f1.$,
								subtitle: item.f2.$
							})
						)
					);
				}
				return json([
					{
						id: responseBody.entities.entity.f0.$,
						title: responseBody.entities.entity.f1.$,
						subtitle: responseBody.entities.entity.f2.$
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
