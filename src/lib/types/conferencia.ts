export type Conferencia = {
	nroUnico: number;
	nroNota: number;
	nomeParc: number;
	ordemCarga: number;
	checkout: string;
	separador: string;
	nroConferencia: number | null;
	nroSeparacao: number;
	codSituacao: number;
};

export type ItemConferencia = {
    nroConferencia: number;
	codProduto: number;
	descricaoProduto: string;
    marca: string;
	unidade: string;
    quantidade: number;
    qtdadeConferida: number;
    qtdadeAvariada: number;
    possuiDivergencia: boolean;
    sequencias: number[];
}

export type ItemConferenciaSaldo = {
    nroConferencia: number;
	codProduto: number;
    qtdadeConferida: number;
    qtdadeAvariada: number;
	sequencias: number[];
}
