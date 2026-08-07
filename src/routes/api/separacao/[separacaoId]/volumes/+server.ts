import { json } from '@sveltejs/kit';


export async function GET({ params, locals }) {
    try {
		const SERVICE_NAME = 'serviceName=crud.find';
		const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`
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
                    requestBody: {
                        serviceName: 'crud.find',
                        entity: {
                            fields: {
                                field: [
                                    {name: "IDREV"}
                                ]
                            },
                            literalCriteria: {
                                expression: {$: `NUSEPARACAO = ${params.separacaoId}`}
                            },
                            name: "RegistroEtiquetaVolume"
                        }
                    }
				})
			}
		);
		const responseData = await response.json();
		return json(responseData);
	} catch (error) {
		console.log(error);
		return json({count: 0})
	}
}