import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

// z.config(z.locales.pt());


export const POST = async ({ request, locals }: RequestEvent) => {
    const { checkout } = await request.json();

    if (!checkout || !locals.usuario) {
        return json({
            success: false,
            error: {
                title: 'Erro ao buscar recontagem',
                message: 'O número número do checkout e o ID do usuário são obrigatórios.',
            },
            data: null
        }, {
            status: 400
        });
    }

    try {
        const SERVICE_NAME = 'serviceName=MgeWmsSP.buscaInfoRecontagem';
        const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`;
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
                    serviceName: 'MgeWmsSP.buscaInfoRecontagem',
                    requestBody: {
                        idusu: {
                            $: btoa(locals.usuario!.id.toString())
                        },
                        ENDERECO: {
                            $: checkout
                        },
                    }
                })
            }
        );

        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder('iso-8859-1');
        const jsonDecoded = decoder.decode(buffer);

        const responseData = JSON.parse(jsonDecoded);
        return json({
            success: true,
            error: null,
            data: responseData
        })
    } catch (e) {
        return json({
            success: false,
            error: (e as Error).message,
        }, {
            status: 500
        })
    }
};