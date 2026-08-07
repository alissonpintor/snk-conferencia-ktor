import type { Separacao, ItensSeparacao } from "$lib/types/separacao";


export abstract class View<Tdata> {
    private serviceName = "CRUDServiceProvider.loadView";
    constructor(
        protected viewName: string,
        protected fields: string,
        protected expression: string = ''
    ) { }

    addExpression(newExpression: string): void {
        if (!newExpression) {
            return;
        }
        this.expression += this.expression ? ' and ' : '';
        this.expression += newExpression;
    }

    getBodyObject(): object {
        console.log(this.expression);
        return {
            serviceName: this.serviceName,
            requestBody: {
                query: {
                    viewName: this.viewName,
                    where: {
                        $: this.expression
                    },
                    fields: {
                        field: {
                            $: this.fields
                        }
                    }
                }
            }
        };
    }

    abstract getData(data: any): Tdata
}

export class ViewAppItensSeparacao extends View<ItensSeparacao> {
    constructor() {
        super(
            "APP_ITENS_SEPARACAO",
            "NUSEPARACAO, NUTAREFA, CODPROD, DESCRICAO, MARCA, REFERENCIA, REFFORN, UND, QTD, ENDORIG, ENDDEST, NOMEUSU, SITUACAO, DHINICIALEXEC, DHFINALEXEC"
        )
    }

    getData(data: any): ItensSeparacao {
        function parseDate(date: string): Date | null {
            if (date) {
                return new Date(date);
            }
            return null;
        }
        const dtHrInicial = data.DHINICIALEXEC.$ ? parseDate(data.DHINICIALEXEC.$) : null;
        const dtHrFinal = data.DHFINALEXEC.$ ? parseDate(data.DHFINALEXEC.$) : null;

        return {
            codProduto: Number(data.CODPROD.$),
            descricaoProduto: data.DESCRICAO.$,
            marca: data.MARCA.$,
            codBarras: data.REFERENCIA.$,
            referencia: data.REFFORN.$,
            unidade: data.UND.$,
            quantidade: Number(data.QTD.$),
            endOrigem: data.ENDORIG.$,
            endDestino: data.ENDDEST.$,
            usuario: data.NOMEUSU.$,
            situacao: data.SITUACAO.$,
            dtHrInicial,
            dtHrFinal
        }
    }
}
