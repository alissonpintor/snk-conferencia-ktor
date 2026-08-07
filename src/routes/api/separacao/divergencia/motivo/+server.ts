import { json } from '@sveltejs/kit';


export async function GET({ locals }) {
    // MotivoDivergencia
    const SERVICE_NAME = 'serviceName=CRUDServiceProvider.loadRecords';
    const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`
    const ENTITY = 'MotivoDivergencia';
    const OUTPUT_TYPE = 'outputType=json';

    try {
        const response = await fetch(
            `${locals.sankhyaServer}/mge/service.sbr?${SERVICE_NAME}&${MGE_SESSION}&${OUTPUT_TYPE}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `JSESSIONID=${locals.sankhyaSessionId}`
                },
                body: JSON.stringify(
                    {
                        serviceName: SERVICE_NAME,
                        requestBody: {
                            dataSet: {
							rootEntity: ENTITY,
							includePresentationFields: 'S',
							offsetPage: '0',
							useDefaultRowsLimit: false,
							standAlone: false,
							criteria: {
								expression: {
									$: "this.ATIVO = 'S' and this.TIPOCONF = 'S'"
								}
							},
							entity: {
								fieldset: {
									list: 'CODMDIV,DESCRICAO'
								}
							}
						}
                        }
                    }
                )
            }
        )

        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder('windows-1252');
        const jsonDecoded = decoder.decode(buffer);

        const dataResponse = JSON.parse(jsonDecoded);

        // const dataResponse = await response.json();
        
        if ('responseBody' in dataResponse) {
            const { responseBody } = dataResponse;
            const entities = responseBody.entities.entity;
            if (Array.isArray(entities) && entities.length > 0) {
                const motivos: {id: number, descricao: string}[] = [];
                for (const motivo of entities) {
                    motivos.push({
                        id: motivo.f0.$,
                        descricao: motivo.f1.$
                    })
                }
                return json(motivos);
            }
            return json([{
                id: entities.f0.$,
                descricao: entities.f1.$
            }])
        }
    } catch (error) {
        console.log(error)
    }

    return json({})
}