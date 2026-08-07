import { json } from '@sveltejs/kit';
import { LoadView } from '$lib/sankhya-client/client.js';
import { ViewAppItensSeparacao } from '$lib/sankhya-client/views/views.js';


export async function GET({ params, locals }) {
	const loadView = new LoadView(
		locals.sankhyaServer!,
		locals.sankhyaSessionId!
	);
	const viewAppItensSeparacao = new ViewAppItensSeparacao();
	viewAppItensSeparacao.addExpression(`NUSEPARACAO = ${params.separacaoId} ORDER BY DESCRICAO`);
	
	try {
		const responseData = await loadView.get(viewAppItensSeparacao);
		const { status } = responseData;
		const errors = [];

		if (Number(status) !== 1) {
			const { statusMessage } = responseData;
			errors.push({
				title: 'Erro ao tentar buscar os itens',
				message: `Erro Sankhya: ${statusMessage}.`,
				type: 'error'
			});

			return json({
				success: false,
				error: errors,
				data: null
			});
		}

		const records = responseData.responseBody.records;
		const hasData = Object.keys(records).length > 0;
		const itens = [];

		if (hasData) {
			const data = Array.isArray(records.record) ? records.record : [records.record];			
			for (const item of data) {
				itens.push(viewAppItensSeparacao.getData(item));
			}
		}

		return json({
			success: true,
			error: null,
			data: itens
		});
	} catch (error) {
		return json({
			success: false,
			error: [{
				title: 'Erro ao tentar buscar os itens',
				message: `Erro Interno: ${error}.`,
				type: 'error'
			}],
			data: null
		});
	}
}
