import { getRequestEvent, query } from '$app/server';
import * as z from 'zod';


type Parameter = {
    $: string;
    type: 'S' | 'N' | 'D' | 'B';
};

export const buscarProdutoPorCodigo = query(z.string(), async (codigo) => {
    const { locals } = getRequestEvent();
    //970249

    let expression: number | string | undefined = undefined;
    let parameters: Parameter[] = [];

    expression = `this.CODPROD = ? and ATIVO = 'S'`;
    parameters = [
        {
            $: codigo,
            type: 'N'
        }
    ];

    try {
        const SERVICE_NAME = 'serviceName=CRUDServiceProvider.loadRecords';
        const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`;
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
                            rootEntity: 'Produto',
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
                                    list: 'CODPROD,DESCRPROD,MARCA'
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

            return {
                success: false,
                error: errors,
                data: null
            }
        }

        if ('responseBody' in responseData) {
            const { responseBody } = responseData;
            const total = parseInt(responseBody.entities.total);
            const produto = []
            if (total > 0) {
                produto.push(
                    {
                        codigo: responseBody.entities.entity.f0.$,
                        descricao: responseBody.entities.entity.f1.$,
                        marca: responseBody.entities.entity.f2.$
                    }
                );

                return {
                    success: true,
                    error: null,
                    data: produto
                }
            }
        }
    } catch (error) {
        return {
            success: false,
            error: [
                {
                    title: 'Erro ao tentar buscar os itens',
                    message: (error as Error).message
                }
            ],
            data: null
        }
    }
});