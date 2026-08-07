import { type DateValue } from "@internationalized/date";


export type DivergenciaFilter = {
    empresa: number | null,
    conferente: number | null,
    dataInicio: DateValue | undefined,
    dataFim: DateValue | undefined,
    nroUnico: number | null,
    nroSeparacao: number | null,
}

export type Divergencia = {
    nroSeparacao: number;
    nroUnico: number;
    dataSeparacao: Date;
    nroConferencia: number;
    statusConferencia: string;
    situacao: number;
    descricaoSituacao: string;
    ordemCarga: number;
    codArea: number;
    areaSeparacao: string;
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