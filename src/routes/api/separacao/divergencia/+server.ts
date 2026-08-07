import { json } from '@sveltejs/kit';
import { DateFormatter } from '@internationalized/date';


type Filters = {
	empresa: number,
	conferente?: number,
	dataInicio?: string,
	dataFim?: string,
	nroUnico?: number,
	nroSeparacao?: number,
}

export async function POST({ request, locals }) {
	const {
		empresa,
		conferente,
		dataInicio,
		dataFim,
		nroSeparacao,
		nroUnico,
	}: Filters = await request.json();

	let expression = '';

	if (empresa) {
		expression += `CODEMPOC = ${empresa.toString()}`;
	}

	if (dataInicio) {
		expression += expression ? ' and ' : '';
		const date = new Date(dataInicio);
		const formatter = new DateFormatter('pt-BR');
		expression += `DTSEPARACAO >= TO_DATE('${formatter.format(date)}', 'DD/MM/YYYY')`;
	}

	if (dataFim) {
		expression += expression ? ' and ' : '';
		const date = new Date(dataFim);
		const formatter = new DateFormatter('pt-BR');
		expression += `DTSEPARACAO <= TO_DATE('${formatter.format(date)}', 'DD/MM/YYYY')`;
	}

	if (nroSeparacao) {
		expression += expression ? ' and ' : '';
		expression += `NUSEPARACAO = ${nroSeparacao.toString()}`;
	}

	if (nroUnico) {
		expression += expression ? ' and ' : '';
		expression += `NUNOTA = ${nroUnico.toString()}`;
	}

	if (conferente) {
		expression += expression ? ' and ' : '';
		expression += `exists (SELECT 1 FROM TGWCON CON WHERE CON.NUCONFERENCIA = NUCONFERENCIA AND CON.CODUSU = ${conferente.toString()});`
	}

	expression += expression ? ' and ' : '';
	expression += 'COD_SITUACAO = 12';

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
							viewName: 'APP_SEPARACAO',
							where: {
								$: expression
							},
							fields: {
								field: {
									$: 'CODEMPOC,NUSEPARACAO,NUNOTA,NUMNOTA,CODPARC,NOMEPARC,ORDEMCARGA,DTSEPARACAO,COD_SITUACAO,SITUACAO,NUCONFERENCIA,CODUSU,NOMEUSU,CODAREASEP,NOMEAREASEP'
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

		if (Number(status) !== 1) {
			const { statusMessage } = responseData;
			errors.push({
				title: 'Erro ao tentar buscar as divergencias',
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
		const separacoes = [];

		if (hasData) {
			const data = Array.isArray(records.record) ? records.record : [records.record];
	
			for (const item of data) {
				separacoes.push({
					codEmp: item.CODEMPOC.$,
					nroSeparacao: item.NUSEPARACAO.$,
					nroUnico: item.NUNOTA.$,
					nroNota: item.NUMNOTA.$,
					codParc: item.CODPARC.$,
					nomeParc: item.NOMEPARC.$,
					ordemCarga: item.ORDEMCARGA.$,
					dataSeparacao: item.DTSEPARACAO.$,
					codSit: item.COD_SITUACAO.$,
					situacao: item.SITUACAO.$,
					nroConferencia: item.NUCONFERENCIA.$,
					codConf: item.CODUSU.$,
					nomeConf: item.NOMEUSU.$,
					codArea: item.CODAREASEP.$,
					areaSeparacao: item.NOMEAREASEP.$
				});
			}			
		}

		return json({ 
			success: true,
			error: null,
			data: separacoes 
		});
	} catch (error) {
		return json({
			success: false,
			error: [{
				title: 'Erro ao tentar buscar as divergencias',
				message: `Erro Interno: ${error}.`,
				type: 'error'
			}],
			data: null
		});
	}
}
