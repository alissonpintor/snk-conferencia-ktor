import { json } from '@sveltejs/kit';

/*
{
  serviceName: 'MgeWmsSP.registraEtiquetasVolume',
  requestBody: {
    ETIQUETAS: {
      NUCONFERENCIA: {
        $ : ''
      },
      QTDEVOLUMES: {
        $: 0
      },
      IGNORARGERADAS: {
        $: 'S'
      },
      SANKHYAW: {
        $: 'N'
      }
    }
  }
}
*/
export async function POST({ request, locals }) {
    const { 
        nroConferencia, 
        nroNota,
        ordemCarga
    } = await request.json();

    if (!locals.usuario || !nroConferencia) {
        return json({
            success: false,
            error: {
                title: 'Erro ao tentar enviar para a doca',
                message: 'O ID do usuário é obrigatório.'
            },
            data: null
        });
    }

    const SERVICE_NAME = 'serviceName=MgeWmsSP.enviaConferenciaPedidosParaDoca';
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
                    serviceName: 'MgeWmsSP.enviaConferenciaPedidosParaDoca',
                    requestBody: {
                        idusu: {
							$: btoa(locals.usuario!.id.toString())
						},
                        conferencia: {
                            NUCONFERENCIA: {
                                $: nroConferencia
                            },
                            NUMNOTA: {
                                $: nroNota
                            },
                            ORDEMCARGA: {
                                $: ordemCarga
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
                title: 'Erro ao tentar enviar para a doca',
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
