import { type DateValue } from "@internationalized/date";


export type SeparacaoFilter = {
    empresa: number | null,
    parceiro: number | null,
    dataInicio: DateValue | undefined,
    dataFim: DateValue | undefined,
    nroUnico: number | null,
    nroSeparacao: number | null,
    nroPedido: number | null,
    ordemCarga: number | null,
    produto: number | null,
    situacao: number[]
}

export type Separacao = {
    codEmp: number | null,
    nroSeparacao: number | null,
    nroTarefa: number | null,
    nroUnico: number | null,
    nroNota: number | null,
    codParc: number | null,
    nomeParc: string,
    ordemCarga: number | null,
    dataSeparacao: Date,
    codSit: number | null,
    situacao: string,
    nroConferencia: number | null,
    enviadoParaDoca: string | null,
    codConf: number | null,
    nomeConf: string,
    codArea: number | null,
    areaSeparacao: string,
    separador: string | null,
    checkout: string | null,
    codSituacao: number,
    tipoEntrega: string
}

export type ItensSeparacao = {
    codProduto: number,
    descricaoProduto: string,
    marca: string,
    codBarras: string,
    referencia: string,
    unidade: string,
    quantidade: number,
    endOrigem: string,
    endDestino: string,
    usuario: string | null,
    situacao: string,
    dtHrInicial: Date | null,
    dtHrFinal: Date | null,
}

export type Produto = {
    codigo: number
    descricao: string
    codigoBarras: string
    unidade: string
    qtdade: number
    qtdConferida: number
    descricaoMotivo: string
    tratativa: number | null
    motivo: number | null
}