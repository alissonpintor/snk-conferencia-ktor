import { json } from '@sveltejs/kit';
import type { ItemConferenciaSaldo } from '$lib/types/conferencia';
import { LoadView } from '$lib/sankhya-client/client.js';
import { ViewAppConferenciaItensSaldo } from '$lib/sankhya-client/views/view-conferencia-itens.js';


type Filters = {
    nroConferencia: number,
    codBarra?: string,
    codProduto?: number
}

export async function POST({ request, locals }) {
    const {
        nroConferencia,
        codBarra,
        codProduto
    }: Filters = await request.json();

    const viewConferenciaItensSaldo = new ViewAppConferenciaItensSaldo();

    viewConferenciaItensSaldo.addExpression(`NUCONFERENCIA = ${nroConferencia.toString()}`);
    if (codBarra) viewConferenciaItensSaldo.addExpression(`CODPROD = GET_CODPROD_WITH_CODBARR('${codBarra}')`);
    if (codProduto) viewConferenciaItensSaldo.addExpression(`CODPROD = ${codProduto}`);

    console.log(codProduto);

    try {
        const loadView = new LoadView(locals.sankhyaServer!, locals.sankhyaSessionId!);
        const responseData = await loadView.get<ItemConferenciaSaldo>(viewConferenciaItensSaldo);
        
        const records = responseData.responseBody.records;
        const hasData = Object.keys(records).length > 0;
        const itens: ItemConferenciaSaldo[] = [];

        if (hasData) {
            const data = Array.isArray(records.record) ? records.record : [records.record];            
            for (const item of data) {
                itens.push(viewConferenciaItensSaldo.getData(item));
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
