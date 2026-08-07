import { View } from './views';
import type { Separacao } from '$lib/types/separacao';


export class ViewAppSeparacao extends View<Separacao> {
	constructor() {
		super(
			'APP_SEPARACAO',
			'CODEMPOC,NUSEPARACAO,NROTAREFA,NUNOTA,NUMNOTA,CODPARC,NOMEPARC,ORDEMCARGA,DTSEPARACAO,COD_SITUACAO,SITUACAO,NUCONFERENCIA,ENVIADO_DOCA,CODUSU,NOMEUSU,SEPARADOR,CODAREASEP,NOMEAREASEP,ENDERECO,COD_SITUACAO,TIPO_ENTREGA'
		);
	}

	getData(data: any): Separacao {
		let enviadoParaDoca = data.ENVIADO_DOCA.$;
		if (enviadoParaDoca) {
			enviadoParaDoca = enviadoParaDoca === 'S' ? "Sim" : "Não";
		}

		return {
			codEmp: data.CODEMPOC.$,
			nroSeparacao: data.NUSEPARACAO.$,
			nroTarefa: data.NROTAREFA.$,
			nroUnico: data.NUNOTA.$,
			nroNota: data.NUMNOTA.$,
			codParc: data.CODPARC.$,
			nomeParc: data.NOMEPARC.$,
			ordemCarga: data.ORDEMCARGA.$,
			dataSeparacao: data.DTSEPARACAO.$,
			codSit: data.COD_SITUACAO.$,
			situacao: data.SITUACAO.$,
			nroConferencia: data.NUCONFERENCIA.$,
			enviadoParaDoca: enviadoParaDoca,
			codConf: data.CODUSU.$,
			nomeConf: data.NOMEUSU.$,
			codArea: data.CODAREASEP.$,
			areaSeparacao: data.NOMEAREASEP.$,
			separador: data.SEPARADOR.$,
			checkout: data.ENDERECO.$,
			codSituacao: Number(data.ENDERECO.$),
			tipoEntrega: data.TIPO_ENTREGA.$
		};
	}
}
