import { View } from './views';
import type { ItemConferencia, ItemConferenciaSaldo } from '$lib/types/conferencia';


export class ViewAppConferenciaItens extends View<ItemConferencia> {
    constructor() {
        super(
            'APP_CONFERENCIA_ITENS',
            'NUCONFERENCIA,CODPROD,DESCRPROD,MARCA,UND,QUANTIDADE,QTCONFERIDA,QTDAVARIA,SEQQUENCIA'
        );
    }

    getData(data: any): ItemConferencia {
        return {
            nroConferencia: Number(data.NUCONFERENCIA.$),
            codProduto: Number(data.CODPROD.$),
            descricaoProduto: data.DESCRPROD.$,
            marca: data.MARCA.$,
            unidade: data.UND.$,
            quantidade: Number(data.QUANTIDADE.$),
            qtdadeConferida: Number(data.QTCONFERIDA.$),
            qtdadeAvariada: Number(data.QTDAVARIA.$),
            sequencias: data.SEQQUENCIA.$,
            possuiDivergencia: false
        };
    }
}

export class ViewAppConferenciaItensSaldo extends View<ItemConferenciaSaldo> {
    constructor() {
        super(
            'APP_CONFERENCIA_ITENS_SALDO',
            'NUCONFERENCIA,CODPROD,QTCONFERIDA,QTDAVARIA,SEQQUENCIA'
        );
    }

    getData(data: any): ItemConferenciaSaldo {
        let sequencias = data.SEQQUENCIA.$;
        sequencias = sequencias ? sequencias.split(',') : [];
        sequencias = sequencias.map((s: string) => Number(s));
        
        return {
            nroConferencia: data.NUCONFERENCIA.$,
            codProduto: Number(data.CODPROD.$),
            qtdadeConferida: Number(data.QTCONFERIDA.$),
            qtdadeAvariada: Number(data.QTDAVARIA.$),
            sequencias: sequencias
        };
    }
}
