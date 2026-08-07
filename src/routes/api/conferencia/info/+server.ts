import { json } from '@sveltejs/kit';


type Filters = {
    nroConferencia: string,
    codBarra: string,
    quantidade: string,
}

export async function POST({ request, locals }) {
    const {
        nroConferencia,
        codBarra,
        quantidade
    }: Filters = await request.json();

    if (!locals.usuario) {
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
        const SERVICE_NAME = 'serviceName=MgeWmsSP.buscaInfoProduto';
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
                    serviceName: 'MgeWmsSP.buscaInfoProduto',
                    requestBody: {
                        idusu: { $: btoa(locals.usuario!.id.toString()) },
                        NUCONFERENCIA: { $: nroConferencia },
                        VALIDARQTD: { $: 'S' },
                        CODBARRAS: { $: codBarra },
                        QUANTIDADE: { $: quantidade }
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
                title: 'Erro ao iniciar conferência',
                message: statusMessage
            });

            return json({
                success: false,
                error: errors,
                data: null
            });
        }

        const records = responseData.responseBody.entity.linhas.linha;
        const data = {
            codProduto: records.CODPROD,
            codBarras: records.CODBARRAS,
            descricaoProduto: records.DESCRPROD,
            existeNaConferencia: records.PRODUTOOUTROPEDIDO === "N" ? true : false,
        }

        /*
        {
            name: 'TGFPRO',
            linhas: {
                linha: {
                CODPROD: '31339',
                CODBARRAS: '7897801300674',
                DESCRPROD: 'ADES. PLAST 17G(48)',
                UTILIZALOTE: 'N',
                SHELFLIFE: '0',
                DTSERVIDOR: '20250825',
                PRODUTOOUTROPEDIDO: 'N',
                DIVERGENCIA: '0',
                QTDECANCELADA: '0',
                CODVOLQTDCANCELADA: 'UN',
                NUCONFERENCIA: '0',
                CONFENTRADA: 'N',
                TEMITENSACONFERIR: 'N',
                USASERIESEPWMS: 'false',
                USASERIEMEDWMS: 'false',
                USAVOLUMECONTINUO: 'false',
                QUANTIDADE: '48.0000'
                }
            }
        }
        */

        console.log(data);

        return json({
            success: true,
            error: null,
            data: data
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
