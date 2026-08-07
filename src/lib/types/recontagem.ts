export type Recontagem = {
    nroSeparacao: number | null,
    nomeParc: string | null,
    nroConferencia: number;
    nroTarefa: number;
    codigoEndereco: number;
    ordemCarga: number;
    nroNota: number;
    nroUnico: number;
    codigoUsuario: number;
    separador: string;
    tipoConferencia: 'S' | 'E'
}

export type ItemRecontagem = {
    nroConferencia: number;
    nroTarefa: number;
    codigoProduto: number;
    descricaoProduto: string;
    marca:string;
    sequencia: number;
    codigoBarras: string;
    codigoEnereco: number;
    controle: string;
    usaControle: string;
    primeiraRecontagem: number;
    tipoRecebimento: string;
    conferido: boolean;
}