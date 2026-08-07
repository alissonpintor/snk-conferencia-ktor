import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const { nroConferencia, sequencias } = await request.json();
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

    const SERVICE_NAME = 'serviceName=MgeWmsSP.removeItensConferidosColetor';
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
                    serviceName: 'MgeWmsSP.removeItensConferidosColetor',
                    requestBody: {
                        idusu: {
                            $: btoa(locals.usuario!.id.toString())
                        },
                        CONFERENCIA: {
                            idusu: {
                                $: btoa(locals.usuario!.id.toString())
                            },
                            NUCONFERENCIA: {
                                $: nroConferencia
                            },
                            SEQUENCIAS: {
                                $: sequencias ? sequencias.join(',') : ''
                            },
                            REMOVERSERIES: {
                                $: 'N'
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
                title: ERROR_TITLE,
                message: statusMessage
            });

            return json({
                success: false,
                error: errors,
                data: null
            });
        }

        const records = responseData.responseBody.entity;
        console.log(records);

        return json({
            success: true,
            error: null,
            data: []
        });
    } catch (error) {
        console.log(error);
    }
}
