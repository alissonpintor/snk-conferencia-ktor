import { json } from "@sveltejs/kit";
import type { ItemRecontagem } from "$lib/types/recontagem.js";


const createItemRecontagem = (rawData: any): ItemRecontagem => {
	return {
		nroConferencia: Number(rawData.NUCONFERENCIA),
		nroTarefa: Number(rawData.NUTAREFA),
		codigoProduto: Number(rawData.CODPROD),
		descricaoProduto: rawData.DESCRPROD,
		sequencia: Number(rawData.SEQUENCIA),
		codigoBarras: rawData.CODBARRA,
		codigoEnereco: Number(rawData.CODEND),
		controle: rawData.CONTROLE,
		usaControle: rawData.USACONTROLE,
		primeiraRecontagem: Number(rawData.PRIMEIRARECONTAGEM),
		tipoRecebimento: rawData.TIPOREC,
		conferido: false
	} as ItemRecontagem
}



export const POST = async ({ request, locals }) => {
    const { nroConferencia, nroTarefa, codigoEndreco } = await request.json();

    if (!nroConferencia || !nroTarefa || !codigoEndreco) {
        return json({
            success: false,
            error: [{title: "Erro ao buscar o próximo produto", message: "O nro da coferencia, nro da tarefa e codigo do endereço são obrigatórios."}],
            data: null
        })
    }

    try {
        const SERVICE_NAME = 'serviceName=MgeWmsSP.proximaRecontagem';
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
					serviceName: 'MgeWmsSP.proximaRecontagem',
					requestBody: {
						idusu: {
							$: btoa(locals.usuario!.id.toString())
						},
						NUCONFERENCIA: {
							$: nroConferencia
						},
						NUTAREFA: {
							$: nroTarefa
						},
						CODEND: {
							$: codigoEndreco
						},
						tipoConferencia: {
							$: "SAIDA"
						},
                        recontagemPorPedido: {
                            $: true
                        }
					}
				})
			}
		);

		const buffer = await response.arrayBuffer();
		const decoder = new TextDecoder('iso-8859-1');
		const jsonDecoded = decoder.decode(buffer);

		const responseData = JSON.parse(jsonDecoded);
		const { status } = responseData;
		const errors = [];

		console.log(responseData);

		if (Number(status) !== 1) {
			// Verifica se os itens de recontagem foram finalizadas
			const { tsError } = responseData;
			if (tsError.tsErrorCode === 'WMS_E00299') {
				return json({
					success: true,
					error: null,
					data: null
				});
			}

			const { statusMessage } = responseData;
			errors.push({
				title: 'Erro ao buscar o próximo produto',
				message: statusMessage
			});

			console.log(responseData.statusMessage);

			return json({
				success: false,
				error: errors,
				data: null
			});
		}

        const data = responseData.responseBody.entity.linhas.linha;
		const itemRecontagem: ItemRecontagem = createItemRecontagem(data)
        return json({
            success: true,
            error: null,
            data: itemRecontagem
        });
    } catch (error) {
        if (error instanceof Error) {
			return json(
				{
					success: false,
					error: [{ title: 'Erro ao buscar informaçoes do produto', message: error.message }],
					data: null
				},
				{
					status: 500
				}
			);
		}
    }

    return json({})
}