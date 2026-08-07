import { json } from '@sveltejs/kit';


type Filters = {
    nroConferencia: number,
	codBarra?: string
}

export async function GET({ request, locals }) {
    const {
        nroConferencia,
		codBarra
    }: Filters = await request.json();

    let expression = `NUCONFERENCIA = ${nroConferencia.toString()}`;

    if (codBarra) {
		expression += expression ? ' and ' : '';
		expression += `CODPROD = GET_CODPROD_WITH_CODBARR(${codBarra})`;
	}

	console.log(expression);

    try {
        const SERVICE_NAME = 'serviceName=CRUDServiceProvider.loadView';
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
                    serviceName: 'CRUDServiceProvider.loadView',
                    requestBody: {
                        query: {
                            viewName: 'APP_CODBARRAS_PRODUTOS',
                            where: {
                                $: expression
                            },
                            fields: {
                                field: {
                                    $: 'CODPROD,CODBARRA,MULTIPLO,TIPOOPERACAO'
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
                title: 'Erro ao tentar buscar o saldo do produto',
                message: statusMessage
            });

            return json({
                success: false,
                error: errors,
                data: null
            });
        }
        
        const records = responseData.responseBody.records;
        const hasData = Object.keys(records).length > 0;
        const saldos = [];

        if (hasData) {
            const data = Array.isArray(records.record) ? records.record : [records.record];
            for (const item of data) {
                saldos.push({
                    nroConferencia: item.NUCONFERENCIA.$,
                    codProduto: item.CODPROD.$,
                    descricaoProduto: item.DESCRPROD.$,
                    marca: item.MARCA.$,
                    qtdadeConferida: item.QTCONFERIDA.$,
                    qtdadeAvariada: item.QTDAVARIA.$,
                });
            }			
        }

        return json({ 
            success: true,
            error: null,
            data: saldos 
        });

    } catch (error) {
        return json({
            success: false,
            error: [{
                title: 'Erro ao tentar buscar o saldo do produto',
                message: `Erro Interno: ${error}.`,
                type: 'error'
            }],
            data: null
        });
    }
}
