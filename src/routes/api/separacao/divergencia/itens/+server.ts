import { json } from "@sveltejs/kit";


export async function GET({ url, locals }) {
    const nroSeparacao = url.searchParams.get("nroSeparacao");
    const nroConferencia = url.searchParams.get("nroConferencia");

    if (!nroSeparacao || !nroConferencia) {
        return json({
            success: false,
            error: {
                code: 1,
                message: 'Parâmetros numero da separação e conferencia são obrigatórios'
            },
            data: []
        });
    }

    try {
        const SERVICE_NAME = 'serviceName=ExpedicaoMercadoriaSP.buscaProdutoDivergencia';
        const APPLICATION = 'application=ExpedicaoMercadoria'
        const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`
		const OUTPUT_TYPE = 'outputType=json';
        
        const response = await fetch(
            `${locals.sankhyaServer}/mgewms/service.sbr?${SERVICE_NAME}&${APPLICATION}&${MGE_SESSION}&${OUTPUT_TYPE}`,
            {
                method: "POST",
                headers: {
					Cookie: `JSESSIONID=${locals.sankhyaSessionId}`,
					'Content-Type': 'application/json'
				},
                body: JSON.stringify(
                    {
                        serviceName: SERVICE_NAME,
                        requestBody: {
                            parametros: {
                                nuConferencia: nroConferencia,
                                nuSeparacao: nroSeparacao
                            }
                        }
                    }
                )
            }
        )
        
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
            const produtosData = responseData.responseBody.produtosDivergencia.produto;
            const produtos = [];
            
            if (Array.isArray(produtosData)) {
                if (produtosData.length > 0) {
                    for (const item of produtosData) {
                        produtos.push({
                            codigo: item.CODPROD?.$,
                            descricao: item.DESCRPROD?.$,
                            codigoBarras: item.CODBARRA?.$,
                            unidade: item.UNVENDA?.$,
                            qtdade: item.QTDNEG?.$,
                            qtdConferida: item.QTDCONFERIDA?.$,
                            descricaoMotivo: item.DESCRERRO?.$
                        })
                    }
                }
            } else {
                produtos.push({
                    codigo: produtosData.CODPROD?.$,
                    descricao: produtosData.DESCRPROD?.$,
                    codigoBarras: produtosData.CODBARRA?.$,
                    unidade: produtosData.UNVENDA?.$,
                    qtdade: produtosData.QTDNEG?.$,
                    qtdConferida: produtosData.QTDCONFERIDA?.$,
                    descricaoMotivo: produtosData.DESCRERRO?.$
                });
            }
            
            return json({
                success: true,
                error: null,
                data: produtos
            });
        }
    } catch(error) {
        return json({
            success: false,
            error: {
                code: error.status,
                message: error.statusText
            },
            data: []
        });
    }
    
    return json({
        success: true,
        error: null,
        data: []
    });
}