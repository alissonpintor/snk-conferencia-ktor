import { json } from '@sveltejs/kit';


type Item = {
    codigo: number;
    motivo: number;
    controle?: string;
    qtdConferida?: number;
}

type Divergencia = {
    nroSeparacao: number;
    nroConferencia: number;
    cortar?: Item[]
    recontar?: Item[]
    retirar?: Item[]
}

export async function POST({request, locals}) {
    const SERVICE_NAME = 'ExpedicaoMercadoriaSP.confirmarTratativa';
    const APPLICATION = 'ExpedicaoMercadoria';
    const divergencia: Divergencia = await request.json();

    console.log(divergencia.cortar)

    const requestPayload = JSON.stringify({
        requestBody: {
            serviceName: SERVICE_NAME,
            parametros: {
                nuConferencia: divergencia.nroConferencia,
                nuSeparacao: divergencia.nroSeparacao,
                cortarDivergencia: {
                    itemCortar: divergencia.cortar?.map((item) => {
                        return {
                            CODPROD: item.codigo,
                            CODMDIV: item.motivo,
                            QTDCONFERIDA: item.qtdConferida,
                            CONTROLE: item.controle
                        }
                    })
                },
                recontar: {
                    itemRecontar: divergencia.recontar?.map((item) => {
                        return {
                            CODPROD: item.codigo,
                            CODMDIV: item.motivo,
                            QTDCONFERIDA: item.qtdConferida,
                            CONTROLE: item.controle
                        }
                    })
                },
                retirar: {
                    itemRetirar: divergencia.retirar?.map((item) => {
                        return {
                            CODPROD: item.codigo,
                            CODMDIV: item.motivo,
                            QTDCONFERIDA: item.qtdConferida,
                            CONTROLE: item.controle
                        }
                    })
                }
            }
        }
    })

    console.log(requestPayload);

    const response = await fetch(
        `${locals.sankhyaServer}/mgewms/service.sbr?serviceName=${SERVICE_NAME}&application=${APPLICATION}&outputType=json`,
        {
            method: 'POST',
            headers: {
                Cookie: `JSESSIONID=${locals.sankhyaSessionId}`,
                'Content-Type': 'application/json'
            },
            body: requestPayload
        }
    )
    const reponseData = await response.json();
    console.log(reponseData);

    return json({
        success: true,
        error: null,
        data: null
    })
}