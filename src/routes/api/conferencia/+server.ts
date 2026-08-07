import { LoadView } from '$lib/sankhya-client/client.js';
import { ViewAppSeparacao } from '$lib/sankhya-client/views/view-separacao';
import type { Separacao } from '$lib/types/separacao';
import { json } from '@sveltejs/kit';


type Filters = {
    checkout?: string,
    nroConferencia?: number
}

export async function POST({ request, locals }) {
    const {
        checkout,
        nroConferencia
    }: Filters = await request.json();

    const viewSeparacao = new ViewAppSeparacao();

    if (checkout) {
        let formatedCheckout = checkout;
        if (Number.isInteger(Number(checkout))) {
            if (checkout.length === 8) {
                formatedCheckout = `${checkout.slice(0,2)}.${checkout.slice(2,5)}.${checkout.slice(5,8)}`
            }
        }
        console.log(formatedCheckout);
        viewSeparacao.addExpression(`'${formatedCheckout}' IN ENDERECO`);
        viewSeparacao.addExpression(`COD_SITUACAO = 3`)
    }
    if (nroConferencia) viewSeparacao.addExpression(`NUCONFERENCIA = ${nroConferencia.toString()}`);

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
                title: 'Erro ao tentar buscar os itens',
                message: `Erro Interno: ${error}.`,
                type: 'error'
            }],
            data: null
        });
    }
}
