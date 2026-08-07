package com.snk.conferencia.features.separacao

import kotlinx.serialization.Serializable

@Serializable
data class SeparacaoFilterRequest(
    val empresa: Long? = null,
    val parceiro: Long? = null,
    val dataInicio: String? = null,
    val dataFim: String? = null,
    val nroSeparacao: Long? = null,
    val nroConferencia: Long? = null,
    val nroUnico: Long? = null,
    val nroPedido: Long? = null,
    val ordemCarga: Long? = null,
    val produto: Long? = null,
    val situacao: List<Int>? = null
)

@Serializable
data class SeparacaoResponse(
    val codEmp: Long,
    val nroSeparacao: Long,
    val nroTarefa: Long? = null,
    val nroUnico: Long,
    val nroNota: Long,
    val codParc: Long,
    val nomeParc: String,
    val ordemCarga: Long? = null,
    val dataSeparacao: String? = null,
    val codSit: Int? = null,
    val situacao: String? = null,
    val nroConferencia: Long? = null,
    val enviadoParaDoca: String? = null,
    val codConf: Long? = null,
    val nomeConf: String? = null,
    val separador: String? = null,
    val codArea: Long? = null,
    val areaSeparacao: String? = null,
    val checkout: String? = null,
    val tipoEntrega: String? = null
)

@Serializable
data class ItemSeparacaoResponse(
    val nroSeparacao: Long,
    val nroTarefa: Long? = null,
    val codProduto: Long,
    val descricaoProduto: String,
    val marca: String? = null,
    val codBarras: String? = null,
    val referencia: String? = null,
    val unidade: String? = null,
    val quantidade: Double,
    val endOrigem: String? = null,
    val endDestino: String? = null,
    val usuario: String? = null,
    val situacao: String? = null,
    val dtHrInicial: String? = null,
    val dtHrFinal: String? = null
)

@Serializable
data class QuantidadeVolumesResponse(
    val nroSeparacao: Long,
    val quantidade: Int
)

@Serializable
data class GerarVolumesRequest(
    val nroConferencia: Long,
    val quantidadeAtual: Int = 0,
    val quantidade: Int
)

@Serializable
data class GerarVolumesResponse(
    val nroSeparacao: Long,
    val status: String,
    val mensagem: String
)
