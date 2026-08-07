import { json } from '@sveltejs/kit';
import type { ItemConferencia } from '$lib/types/conferencia';
import { LoadView } from '$lib/sankhya-client/client.js';
import { ViewAppConferenciaItens } from '$lib/sankhya-client/views/view-conferencia-itens.js';


type Filters = {
    nroConferencia: number,
    codProduto?: number,
	codBarra?: string
}

export async function POST({ request, locals }) {
    const {
        nroConferencia,
        codProduto,
		codBarra
    }: Filters = await request.json();

    const viewConferenciaItens = new ViewAppConferenciaItens();

    viewConferenciaItens.addExpression(`NUCONFERENCIA = ${nroConferencia.toString()}`);
    if (codProduto) viewConferenciaItens.addExpression(`CODPROD = ${codProduto}`);
    if (codBarra) viewConferenciaItens.addExpression(`CODPROD = GET_CODPROD_WITH_CODBARR('${codBarra}')`);

    try {
        const loadView = new LoadView(locals.sankhyaServer!, locals.sankhyaSessionId!);
        const responseData = await loadView.get<ItemConferencia>(viewConferenciaItens);
        
        const records = responseData.responseBody.records;
        const hasData = Object.keys(records).length > 0;
        const itens: ItemConferencia[] = [];

        if (hasData) {
            const data = Array.isArray(records.record) ? records.record : [records.record];            
            for (const item of data) {
                itens.push(viewConferenciaItens.getData(item));
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
                title: 'Erro ao tentar buscar o saldo do produto',
                message: `Erro Interno: ${error}.`,
                type: 'error'
            }],
            data: null
        });
    }
}
