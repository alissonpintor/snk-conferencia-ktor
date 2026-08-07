import type { Recontagem } from "$lib/types/recontagem";
import { json } from "@sveltejs/kit";


const createConferencia = (rawData: any): Recontagem => {
	return {
		nroConferencia: Number(rawData.NUCONFERENCIA),
		nroTarefa: Number(rawData.NUTAREFA),
		nroUnico: Number(rawData.NUNOTA),
		nroNota: Number(rawData.NUMNOTA),
		ordemCarga: Number(rawData.ORDEMCARGA),
		codigoEndereco: Number(rawData.CODEND),
		codigoUsuario: Number(rawData.CODUSU),
		separador: rawData.NOMEUSU,
		tipoConferencia: rawData.TIPCONF
	} as Recontagem
}

export const POST = async ({ request, locals }) => {
    const { checkout } = await request.json();

    if (!checkout) {
        return json({
            success: false,
            error: [{title: "Erro ao iniciar recontagem", message: "O checkout é obrigatório"}],
            data: null
        })
    }

    try {
        const SERVICE_NAME = 'serviceName=MgeWmsSP.recontagemDoca';
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
					serviceName: 'MgeWmsSP.recontagemDoca',
					requestBody: {
						idusu: {
							$: btoa(locals.usuario!.id.toString())
						},
						ENDERECO: {
							$: checkout
						},
						recontagemPorPedido: {
							$: true
						},
						tipoConferencia: {
							$: "SAIDA"
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

		if (Number(status) !== 1) {
			const { statusMessage } = responseData;
			const error = {
				title: 'Erro ao iniciar a recontagem',
				message: statusMessage
			};

			return json({
				success: false,
				error: [error],
				data: null
			},{
				status: 400
			});
		}

        const data = responseData.responseBody.entity.linhas.linha;
		const recontagem: Recontagem = createConferencia(data)

		// 02.998.624
		return json({
            success: true,
            error: null,
			data: recontagem
        });
    } catch (error) {
        if (error instanceof Error) {
            return json({})
        }
    }

    return json({})
}