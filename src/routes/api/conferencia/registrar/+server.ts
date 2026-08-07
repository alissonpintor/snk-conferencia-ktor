import { json } from "@sveltejs/kit";


type ItemConferido = {
	nroConferencia: number;
	codBarra: string;
	quantidade: number;
	qtdadeAvariada?: number;
	nroVolume?: number;
	codCaixa?: string;
	qtdadePecas?: number;
	controle?: string;
	series?: string;
	dataValidade?: Date;
	modoEdicao?: 'S' | 'N';
	volumeContinuo?: 'S' | 'N';
};

export async function POST({ locals, request }) {
	const {
		nroConferencia,
		codBarra,
		quantidade,
		qtdadeAvariada = 0,
		nroVolume,
		codCaixa,
		qtdadePecas,
		controle,
		series,
		dataValidade,
		modoEdicao = 'N',
		volumeContinuo = 'N'
	}: ItemConferido = await request.json();

    if (!locals.usuario) {
        return json({
            success: false,
            error: {
                title: 'Erro ao tentar buscar tarefas pendentes',
                message: 'O ID do usuário é obrigatório.',
            },
            data: null
        });
    }

	const SERVICE_NAME = 'serviceName=MgeWmsSP.insereItemConferidoColetor';
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
					serviceName: 'serviceName=MgeWmsSP.insereItemConferidoColetor',
					requestBody: {
						idusu: {
							$: btoa(locals.usuario?.id.toString())
						},
						CONFERENCIA: {
							NUCONFERENCIA: {
								$: nroConferencia
							},
							CODBARRA: {
								$: codBarra
							},
							CONTROLE: {
								$: controle
							},
							SERIES: {
								$: series
							},
							DTVALIDADE: {
								$: ''
							},
							QUANTIDADE: {
								$: quantidade
							},
							QTDAVARIA: {
								$: qtdadeAvariada
							},
							NUMVOL: {
								$: nroVolume
							},
							CODCAIXA: {
								$: codCaixa
							},
							QTDPECAS: {
								$: qtdadePecas
							},
							MODOEDICAO: {
								$: modoEdicao
							},
							VOLCONTINUO: {
								$: volumeContinuo
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
				title: 'Erro ao tentar cancelar a conferência',
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
