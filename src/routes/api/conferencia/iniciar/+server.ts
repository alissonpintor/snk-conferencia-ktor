import { json } from '@sveltejs/kit';


type Filters = {
    checkout: string,
}

export async function POST({ request, locals }) {
    const {
        checkout
    }: Filters = await request.json();

    if (!checkout && !locals.usuario) {
        return json({
            success: false,
            error: {
                title: 'Erro ao iniciar conferência',
                message: 'O número do ckeckout e o ID do usuário são obrigatórios.',
            },
            data: null
        });
    }

    try {
        const SERVICE_NAME = 'serviceName=MgeWmsSP.buscaConferenciaPorPedido';
        const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`
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
                    serviceName: 'MgeWmsSP.buscaConferenciaPorPedido',
                    requestBody: {
                        idusu: {
                            $: btoa(locals.usuario!.id.toString())
                        },
                        ENDERECO: {
                            $: checkout
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
                title: 'Erro ao iniciar conferência',
                message: statusMessage
            });

            return json({
                success: false,
                error: errors,
                data: null
            });
        }

        const records = responseData.responseBody.entity;
        const hasData = Object.keys(records).length > 0;

        console.log(records);
        /*
        name: 'TGWCON',
        linhas: {
            linha: {
            UTILIZACONTROLE: 'S',
            NUCONFERENCIA: '979160',
            TIPCONF: 'E',
            NUMNOTA: '316438',
            NUNOTA: '1739978',
            NUSEPARACAO: '902695',
            ORDEMCARGA: '13573',
            VOLCONTINUO: 'N',
            IMPETIQFECHVOL: 'S',
            CODEND: '68360',
            DESCREND: 'CHECKOUTS 02.904.258',
            ENDERECO: '02.904.258',
            CODENDDOCA: '72135',
            DESCRENDDOCA: 'DOCA EXPEDIÇÃO 110',
            CODUSU: '652',
            NOMEUSU: 'CARLOS.'
            }
        }
        }
        */

        const conferencias = [];
        if (hasData) {
            let data = records.linhas.linha;
            data = Array.isArray(data) ? data : [data];

            for (const item of data) {
                conferencias.push({
                    nroConferencia: item.NUCONFERENCIA,
                    tipoConferencia: item.TIPCONF,
                    sepAgrupada: item.SEPARACAO_AGRUPADA,
                    volumeContinuo: item.VOLCONTINUO,
                    impEtiquetaFechVol: item.IMPETIQFECHVOL,
                });
            }
        }

        return json({
            success: true,
            error: null,
            data: conferencias
        });

    } catch (error) {
        return json({
            success: false,
            error: [{
                title: 'Erro ao iniciar conferência',
                message: `Erro Interno: ${error}.`,
                type: 'error'
            }],
            data: null
        });
    }
}
