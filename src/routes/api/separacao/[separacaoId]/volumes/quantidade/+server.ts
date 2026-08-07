import { json } from "@sveltejs/kit";


export async function GET({ params, locals }) {
    if (!locals.usuario) {
        return json({
            success: false,
            error: {
                title: 'Erro ao tentar gerar volumes',
                message: 'O ID do usuário é obrigatório.'
            },
            data: null
        });
    }

    try {
        const SERVICE_NAME = 'serviceName=crud.find';
        const APPLICATION = 'application=ExpedicaoMercadoria'
        const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`
        const OUTPUT_TYPE = 'outputType=json';

        const response = await fetch(
            `${locals.sankhyaServer}/mge/service.sbr?${SERVICE_NAME}&${APPLICATION}&${MGE_SESSION}&${OUTPUT_TYPE}`,
            {
                method: 'POST',
                headers: {
                    Cookie: `JSESSIONID=${locals.sankhyaSessionId}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    serviceName: 'crud.find',
                    requestBody: {
                        entity: {
                            name: "RegistroEtiquetaVolume",
                            fields: {
                                field: [
                                    {name: "IDREV"}
                                ]
                            },
                            literalCriteria: {
                                expression: {
                                    $: `NUSEPARACAO = ${params.separacaoId}`
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
        console.log(responseData);

        if (Number(status) !== 1) {
            const { statusMessage } = responseData;
            errors.push({
                title: 'Erro ao tentar buscar quantidade de volumes.',
                message: statusMessage
            });

            return json({
                success: false,
                error: errors,
                data: null
            });
        }

        let records = responseData.responseBody.entidades.entidade;
        records = Array.isArray(records) ? records : [records];

        return json({
            success: true,
            error: [],
            data: records
        });
    } catch (error) {
        return json({
            success: false,
            error: [
                {
                    title: 'Erro ao tentar gerar os volumes.',
                    message: error.message
                }
            ],
            data: []
        });
    }
} 