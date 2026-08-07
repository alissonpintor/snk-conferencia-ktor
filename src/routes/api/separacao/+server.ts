import { json } from '@sveltejs/kit';
import { DateFormatter } from '@internationalized/date';
import { LoadView } from '$lib/sankhya-client/client.js';
import { ViewAppSeparacao } from '$lib/sankhya-client/views/view-separacao.js';
import type { Separacao } from "$lib/types/separacao";
import { BaseError } from '$lib/sankhya-client/client.js';


type Filters = {
	empresa: number,
	parceiro?: number,
	dataInicio?: string,
	dataFim?: string,
	nroSeparacao?: number,
	nroConferencia?: number,
	nroUnico?: number,
	nroPedido?: number,
	ordemCarga?: number,
	produto?: number,
	situacao?: number[]
}

export async function POST({ request, locals }) {
	const {
		empresa,
		parceiro,
		dataInicio,
		dataFim,
		nroSeparacao,
		nroConferencia,
		nroUnico,
		nroPedido,
		ordemCarga,
		produto,
		situacao
	}: Filters = await request.json();

	const viewSeparacao = new ViewAppSeparacao();

	if (empresa) {
		viewSeparacao.addExpression(`CODEMPOC = ${empresa.toString()}`);
	}

	if (parceiro) {
		viewSeparacao.addExpression(`CODPARC = ${parceiro.toString()}`);
	}

	if (dataInicio) {
		const date = new Date(dataInicio);
		const formatter = new DateFormatter('pt-BR');		
		viewSeparacao.addExpression(`DTSEPARACAO >= TO_DATE('${formatter.format(date)}', 'DD/MM/YYYY')`);
	}

	if (dataFim) {
		const date = new Date(dataFim);
		const formatter = new DateFormatter('pt-BR');	
		viewSeparacao.addExpression(`DTSEPARACAO <= TO_DATE('${formatter.format(date)}', 'DD/MM/YYYY')`);
	}

	if (nroSeparacao) {
		viewSeparacao.addExpression(`NUSEPARACAO = ${nroSeparacao.toString()}`);
	}

	if (nroConferencia) {
		viewSeparacao.addExpression(`NUCONFERENCIA = ${nroConferencia.toString()}`);
	}

	if (nroUnico) {
		viewSeparacao.addExpression(`NUNOTA = ${nroUnico.toString()}`);
	}

	if (nroPedido) {
		viewSeparacao.addExpression(`NUMNOTA = ${nroPedido.toString()}`);
	}

	if (ordemCarga) {
		viewSeparacao.addExpression(`ORDEMCARGA = ${ordemCarga.toString()}`);
	}

	if (situacao && situacao.length > 0) {
		viewSeparacao.addExpression(`COD_SITUACAO in (${situacao.join(', ')})`);
	}
	
	if (produto) {
		viewSeparacao.addExpression(
			`exists (SELECT * FROM TGWITT I WHERE I.CODPROD = ${produto.toString()} AND I.NUTAREFA = NROTAREFA)`
		);
	}

	try {
		const loadView = new LoadView(locals.sankhyaServer!, locals.sankhyaSessionId!);
		const responseData = await loadView.get(viewSeparacao);
		const { status } = responseData;
		const errors = [];

		console.log(locals.sankhyaSessionId);

		if (Number(status) !== 1) {
			const { statusMessage } = responseData;
			errors.push({
				title: 'Erro ao tentar buscar as separações',
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
		const separacoes: Separacao[] = [];

		if (hasData) {
			const data = Array.isArray(records.record) ? records.record : [records.record];	
			for (const item of data) {
				separacoes.push(viewSeparacao.getData(item));
			}			
		}

		return json({ 
			success: true,
			error: null,
			data: separacoes 
		});

	} catch (error) {
		const responseError = {
			success: false,
			error: <any[]>[],
			data: null
		};
		let responseOptions: ResponseInit = {}
		if (error instanceof BaseError) {
			responseOptions.status = error.status;
			responseOptions.statusText = error.message;

			responseError.error.push({
				title: 'Erro ao tentar buscar as separações',
				message: `${error.name}: ${error.message}`,
				type: 'error'
			})
		}
		return json(responseError, responseOptions);
	}
}
