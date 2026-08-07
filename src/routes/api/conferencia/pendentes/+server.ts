import { json } from '@sveltejs/kit';
import type { Separacao } from '$lib/types/separacao.js';
import { ViewAppSeparacao } from '$lib/sankhya-client/views/view-separacao.js';
import { LoadView } from '$lib/sankhya-client/client.js';

export async function GET({ locals }) {
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

    const viewSeparacao = new ViewAppSeparacao();
    viewSeparacao.addExpression(`COD_SITUACAO = 4 and CODUSU = ${locals.usuario.id}`);

    try {
        const loadView = new LoadView(locals.sankhyaServer!, locals.sankhyaSessionId!);
        const responseData = await loadView.get<Separacao>(viewSeparacao);        
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
        return json({
            success: false,
            error: [{
                title: 'Erro ao tentar buscar tarefas pendentes',
                message: `Erro Interno: ${error}.`,
                type: 'error'
            }],
            data: null
        });
    }
}
