package com.snk.conferencia.features.conferencia

import kotlinx.serialization.Serializable

@Serializable
data class BuscarConferenciaRequest(
    val checkout: String? = null,
    val nroConferencia: Long? = null
)

@Serializable
data class ConferenciaResponse(
    val nroConferencia: Long? = null,
    val nroSeparacao: Long,
    val nroUnico: Long,
    val nroNota: Long,
    val ordemCarga: Long? = null,
    val checkout: String? = null,
    val codDoca: Long? = null,
    val descrDoca: String? = null
)

@Serializable
data class IniciarConferenciaRequest(
    val checkout: String
)

@Serializable
data class IniciarConferenciaResponse(
    val nroConferencia: Long,
    val tipoConferencia: String,
    val sepAgrupada: String? = null,
    val volumeContinuo: String? = null,
    val impEtiquetaFechVol: String? = null
)

@Serializable
data class ConferenciaPendenteResponse(
    val nroConferencia: Long,
    val checkout: String? = null,
    val nroSeparacao: Long
)

@Serializable
data class BuscarItensConferenciaRequest(
    val nroConferencia: Long,
    val codProduto: Long? = null,
    val codBarra: String? = null
)

@Serializable
data class ItemConferenciaResponse(
    val codProduto: Long,
    val descrProduto: String,
    val codBarra: String? = null,
    val quantidade: Double,
    val qtdadeConferida: Double = 0.0,
    val qtdadeAvariada: Double = 0.0,
    val sequencias: List<Long> = emptyList(),
    val possuiDivergencia: Boolean = false
)

@Serializable
data class InfoProdutoRequest(
    val nroConferencia: Long,
    val codBarra: String,
    val quantidade: Double
)

@Serializable
data class InfoProdutoResponse(
    val codProduto: Long,
    val descrProduto: String,
    val complemento: String? = null,
    val pesoBruto: Double? = null
)

@Serializable
data class RegistrarItemConferidoRequest(
    val nroConferencia: Long,
    val codBarra: String,
    val quantidade: Double,
    val qtdadeAvariada: Double = 0.0,
    val nroVolume: Int? = null,
    val codCaixa: String? = null,
    val modoEdicao: String = "N",
    val volumeContinuo: String = "N"
)

@Serializable
data class RegistrarItemResponse(
    val status: String = "OK",
    val mensagem: String? = null
)

@Serializable
data class AtualizarSaldoRequest(
    val nroConferencia: Long,
    val codBarra: String? = null,
    val codProduto: Long? = null
)

@Serializable
data class SaldoItemResponse(
    val codProduto: Long,
    val qtdadeConferida: Double,
    val sequencias: List<Long> = emptyList(),
    val qtdadeAvariada: Double = 0.0,
    val possuiDivergencia: Boolean = false
)

@Serializable
data class RemoverItensRequest(
    val nroConferencia: Long,
    val sequencias: List<Long>? = null
)

@Serializable
data class FinalizarConferenciaRequest(
    val nroConferencia: Long
)

@Serializable
data class FinalizarConferenciaResponse(
    val nroConferencia: Long,
    val status: String,
    val mensagem: String? = null
)

@Serializable
data class RegistrarVolumesRequest(
    val nroConferencia: Long,
    val quantidade: Int
)

@Serializable
data class ImprimirVolumesRequest(
    val nroUnico: Long? = null,
    val nroSeparacao: Long? = null,
    val quantidade: Int? = null
)

@Serializable
data class EnviarDocaRequest(
    val nroConferencia: Long,
    val nroNota: Long? = null,
    val ordemCarga: Long? = null
)

@Serializable
data class CancelarConferenciaRequest(
    val nroConferencia: Long,
    val codSit: Int? = null
)

@Serializable
data class ConferenciaActionResponse(
    val status: String = "1",
    val mensagem: String
)
